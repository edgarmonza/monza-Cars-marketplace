// ---------------------------------------------------------------------------
// Test script for the Bring a Trailer scraper
// Run from project root:  npx tsx scripts/test-scraper.ts
// ---------------------------------------------------------------------------

import { scrapeBringATrailer } from "../src/lib/scrapers/bringATrailer"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("=== Monza Lab — BaT Scraper Test ===\n")

  // 1. Scrape listings (1 page only)
  console.log("Scraping Bring a Trailer listings (1 page)...\n")
  const { auctions, errors } = await scrapeBringATrailer({
    maxPages: 1,
    scrapeDetails: false,
  })

  if (errors.length > 0) {
    console.log(`Scraper warnings: ${errors.length}`)
    errors.forEach((e) => console.log(`  - ${e}`))
    console.log()
  }

  if (auctions.length === 0) {
    console.log(
      "No auctions found. BaT page structure may have changed, or the request was blocked."
    )
    await prisma.$disconnect()
    process.exit(1)
  }

  // Take only 5
  const sample = auctions.slice(0, 5)
  console.log(
    `Found ${auctions.length} auctions total. Saving first ${sample.length} to DB...\n`
  )

  // 2. Save to DB
  let saved = 0
  for (const a of sample) {
    try {
      await prisma.auction.upsert({
        where: { externalId: a.externalId },
        create: {
          externalId: a.externalId,
          platform: a.platform,
          url: a.url,
          title: a.title,
          make: a.make,
          model: a.model,
          year: a.year,
          mileage: a.mileage,
          mileageUnit: a.mileageUnit,
          transmission: a.transmission,
          engine: a.engine,
          exteriorColor: a.exteriorColor,
          interiorColor: a.interiorColor,
          location: a.location,
          currentBid: a.currentBid,
          bidCount: a.bidCount,
          endTime: a.endTime ? new Date(a.endTime) : null,
          status: "ACTIVE",
          description: a.description,
          sellerNotes: a.sellerNotes,
          vin: a.vin,
          images: a.images,
        },
        update: {
          title: a.title,
          currentBid: a.currentBid,
          bidCount: a.bidCount,
          endTime: a.endTime ? new Date(a.endTime) : null,
          images: a.images,
          scrapedAt: new Date(),
        },
      })
      saved++
      console.log(`  + ${a.title}`)
    } catch (err) {
      console.log(`  x ${a.title}: ${(err as Error).message}`)
    }
  }

  // 3. Summary
  console.log("\n=== Summary ===")
  console.log(`Scraped:  ${auctions.length} auctions from BaT`)
  console.log(`Saved:    ${saved}/${sample.length} to database`)
  console.log(`Errors:   ${errors.length}`)

  if (saved > 0) {
    const ex = sample[0]
    console.log("\n--- Example Auction ---")
    console.log(`Title:    ${ex.title}`)
    console.log(`Year:     ${ex.year}`)
    console.log(`Make:     ${ex.make}`)
    console.log(`Model:    ${ex.model}`)
    console.log(
      `Bid:      ${ex.currentBid ? `$${ex.currentBid.toLocaleString()}` : "No bids"}`
    )
    console.log(`Bids:     ${ex.bidCount}`)
    console.log(`URL:      ${ex.url}`)
    console.log(`Images:   ${ex.images.length}`)
  }
}

main()
  .catch((err) => {
    console.error("Fatal error:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
