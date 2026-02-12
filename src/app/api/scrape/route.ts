// ═══════════════════════════════════════════════════════════════════════════
// MONZA LAB: SCRAPER API
// Zero-cost price fetching using CSS selectors — NO LLM TOKENS
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { scrapeAll, scrapePlatform, type ScrapedAuction } from '@/lib/scrapers'
import {
  fetchAuctionData,
  getCacheStats,
  cleanCache,
  getCachedData,
} from '@/lib/scraper'

function mapStatus(raw: string | undefined): 'ACTIVE' | 'ENDED' {
  if (!raw) return 'ACTIVE'
  const upper = raw.toUpperCase()
  if (upper === 'ENDED' || upper === 'SOLD') return 'ENDED'
  return 'ACTIVE'
}

// ─── GET: Zero-cost price fetch for a single URL ───
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const forceRefresh = request.nextUrl.searchParams.get("refresh") === "true"
  const statsOnly = request.nextUrl.searchParams.get("stats") === "true"

  // Return cache stats if requested
  if (statsOnly) {
    const stats = getCacheStats()
    return NextResponse.json({
      success: true,
      cache: stats,
    })
  }

  if (!url) {
    return NextResponse.json(
      { success: false, error: "Missing 'url' parameter" },
      { status: 400 }
    )
  }

  try {
    // Check if we have recent data in DB first (persistent cache)
    const existingAuction = await prisma.auction.findFirst({
      where: { url },
      select: {
        id: true,
        currentBid: true,
        bidCount: true,
        status: true,
        scrapedAt: true,
      },
    })

    // If DB data is less than 24 hours old, return it (skip scraping)
    if (existingAuction && !forceRefresh) {
      const ageMs = Date.now() - new Date(existingAuction.scrapedAt).getTime()
      const maxAgeMs = 24 * 60 * 60 * 1000 // 24 hours

      if (ageMs < maxAgeMs) {
        return NextResponse.json({
          success: true,
          source: "database",
          cached: true,
          ageHours: Math.round(ageMs / (60 * 60 * 1000) * 10) / 10,
          data: {
            currentBid: existingAuction.currentBid,
            bidCount: existingAuction.bidCount,
            status: existingAuction.status,
            scrapedAt: existingAuction.scrapedAt,
          },
        })
      }
    }

    // Fetch fresh data using the zero-cost scraper
    const scrapedData = await fetchAuctionData(url, forceRefresh)

    // Update DB if we got valid data
    if (scrapedData.currentBid !== null && existingAuction) {
      await prisma.auction.update({
        where: { id: existingAuction.id },
        data: {
          currentBid: scrapedData.currentBid,
          bidCount: scrapedData.bidCount ?? undefined,
          status: scrapedData.status === "SOLD" ? "ENDED" : scrapedData.status || undefined,
          scrapedAt: new Date(),
        },
      })
    }

    return NextResponse.json({
      success: true,
      source: "scraper",
      cached: false,
      data: scrapedData,
    })
  } catch (error) {
    console.error("[Scrape API] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Scraping failed",
      },
      { status: 500 }
    )
  }
}

// ─── DELETE: Clear cache ───
export async function DELETE() {
  try {
    const removed = cleanCache()
    return NextResponse.json({
      success: true,
      message: `Removed ${removed} expired cache entries`,
      currentStats: getCacheStats(),
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to clean cache" },
      { status: 500 }
    )
  }
}

// ─── POST: Full platform scraping (existing functionality) ───
export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))

    let scrapedAuctions: ScrapedAuction[]
    const errors: string[] = []

    if (body.platform) {
      try {
        scrapedAuctions = await scrapePlatform(body.platform)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown scraping error'
        errors.push(`${body.platform}: ${message}`)
        scrapedAuctions = []
      }
    } else {
      const result = await scrapeAll()
      scrapedAuctions = result.auctions
      errors.push(...result.errors)
    }

    let auctionsUpdated = 0

    for (const auction of scrapedAuctions) {
      try {
        const images = auction.images?.length
          ? auction.images
          : auction.imageUrl
            ? [auction.imageUrl]
            : []

        await prisma.auction.upsert({
          where: { externalId: auction.externalId },
          update: {
            title: auction.title,
            make: auction.make,
            model: auction.model,
            year: auction.year,
            mileage: auction.mileage,
            currentBid: auction.currentBid,
            bidCount: auction.bidCount ?? 0,
            endTime: auction.endTime ? new Date(auction.endTime) : null,
            url: auction.url,
            images,
            description: auction.description,
            transmission: auction.transmission,
            engine: auction.engine,
            exteriorColor: auction.exteriorColor,
            interiorColor: auction.interiorColor,
            location: auction.location,
            status: mapStatus(auction.status),
            scrapedAt: new Date(),
          },
          create: {
            externalId: auction.externalId,
            platform: auction.platform,
            title: auction.title,
            make: auction.make,
            model: auction.model,
            year: auction.year,
            mileage: auction.mileage,
            mileageUnit: auction.mileageUnit ?? 'miles',
            currentBid: auction.currentBid,
            bidCount: auction.bidCount ?? 0,
            endTime: auction.endTime ? new Date(auction.endTime) : null,
            url: auction.url,
            images,
            description: auction.description,
            sellerNotes: auction.sellerNotes,
            transmission: auction.transmission,
            engine: auction.engine,
            exteriorColor: auction.exteriorColor,
            interiorColor: auction.interiorColor,
            location: auction.location,
            vin: auction.vin,
            status: mapStatus(auction.status),
          },
        })
        auctionsUpdated++
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown DB error'
        errors.push(`Failed to upsert ${auction.externalId}: ${message}`)
      }
    }

    // Record price history
    for (const auction of scrapedAuctions) {
      if (auction.currentBid != null) {
        try {
          const dbAuction = await prisma.auction.findUnique({
            where: { externalId: auction.externalId },
            select: { id: true },
          })

          if (dbAuction) {
            await prisma.priceHistory.create({
              data: {
                auctionId: dbAuction.id,
                bid: auction.currentBid,
              },
            })
          }
        } catch {
          // Price history is non-critical
        }
      }
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        auctionsFound: scrapedAuctions.length,
        auctionsUpdated,
        errors,
        duration: `${duration}ms`,
      },
    })
  } catch (error) {
    console.error('Error during scraping:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run scraper',
        duration: `${Date.now() - startTime}ms`,
      },
      { status: 500 }
    )
  }
}
