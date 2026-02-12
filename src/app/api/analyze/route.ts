import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { analyzeAuction } from '@/lib/ai/analyzer'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateUser, deductCredit, hasAlreadyAnalyzed } from '@/lib/credits'

interface AnalyzeRequestBody {
  auctionId: string
}

const ANALYSIS_CACHE_HOURS = 24

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'AUTH_REQUIRED',
          message: 'Please sign in to analyze auctions',
        },
        { status: 401 }
      )
    }

    const body: AnalyzeRequestBody = await request.json()

    if (!body.auctionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'auctionId is required',
        },
        { status: 400 }
      )
    }

    // Get or create user in our database
    const dbUser = await getOrCreateUser(
      authUser.id,
      authUser.email!,
      authUser.user_metadata?.full_name
    )

    // Fetch the auction from the database
    const auction = await prisma.auction.findUnique({
      where: { id: body.auctionId },
      include: {
        analysis: true,
        comparables: true,
      },
    })

    if (!auction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Auction not found',
        },
        { status: 404 }
      )
    }

    // Check if user has already analyzed this auction (free re-access)
    const alreadyAnalyzed = await hasAlreadyAnalyzed(dbUser.id, body.auctionId)

    // Check if a recent analysis already exists (within cache window)
    if (auction.analysis) {
      const analysisAge =
        Date.now() - new Date(auction.analysis.createdAt).getTime()
      const cacheThreshold = ANALYSIS_CACHE_HOURS * 60 * 60 * 1000

      if (analysisAge < cacheThreshold) {
        return NextResponse.json({
          success: true,
          data: auction.analysis,
          cached: true,
          creditUsed: 0,
          creditsRemaining: dbUser.creditsBalance,
        })
      }
    }

    // If new analysis needed and user hasn't analyzed before, check credits
    if (!alreadyAnalyzed && dbUser.creditsBalance < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'INSUFFICIENT_CREDITS',
          message: 'You have no analysis credits remaining. Purchase more to continue.',
          creditsRemaining: 0,
        },
        { status: 402 }
      )
    }

    // Fetch comparables linked to this auction + market data for context
    const [auctionComparables, marketDataRecords] = await Promise.all([
      prisma.comparable.findMany({
        where: { auctionId: auction.id },
        orderBy: { soldDate: 'desc' },
        take: 10,
      }),
      prisma.marketData.findMany({
        where: {
          make: { equals: auction.make, mode: 'insensitive' },
          model: { equals: auction.model, mode: 'insensitive' },
        },
        take: 5,
      }),
    ])

    // Format vehicle data and market data for the AI prompt
    const vehicleData = {
      id: auction.id,
      title: auction.title,
      make: auction.make,
      model: auction.model,
      year: auction.year,
      mileage: auction.mileage,
      platform: auction.platform,
      currentBid: auction.currentBid,
      endTime: auction.endTime,
      description: auction.description,
      url: auction.url,
      imageUrl: auction.images?.[0] ?? null,
    }

    const marketData = {
      comparableSales: auctionComparables.map((comp: { title: string; mileage: number | null; soldPrice: number; soldDate: Date | null; platform: string; condition: string | null }) => ({
        title: comp.title,
        mileage: comp.mileage,
        soldPrice: comp.soldPrice,
        soldDate: comp.soldDate,
        platform: comp.platform,
        condition: comp.condition,
      })),
      marketContext: marketDataRecords.map((m: { avgPrice: number | null; medianPrice: number | null; totalSales: number; trend: string | null }) => ({
        avgPrice: m.avgPrice,
        medianPrice: m.medianPrice,
        totalSales: m.totalSales,
        trend: m.trend,
      })),
      totalComparables: auctionComparables.length,
    }

    // Call the AI analyzer
    const analysisResult = await analyzeAuction(vehicleData, marketData)

    // Save or update the analysis in the database
    // Map analysisResult fields to the actual Prisma schema
    const analysisData = {
      bidTargetLow: analysisResult.fairValueLow ?? null,
      bidTargetHigh: analysisResult.fairValueHigh ?? null,
      confidence: analysisResult.confidenceScore >= 0.8 ? 'HIGH' as const : analysisResult.confidenceScore >= 0.5 ? 'MEDIUM' as const : 'LOW' as const,
      redFlags: analysisResult.redFlags ?? [],
      keyStrengths: analysisResult.pros ?? [],
      criticalQuestions: [],
      investmentGrade: analysisResult.confidenceScore >= 0.8 ? 'EXCELLENT' as const : analysisResult.confidenceScore >= 0.6 ? 'GOOD' as const : analysisResult.confidenceScore >= 0.4 ? 'FAIR' as const : 'SPECULATIVE' as const,
      appreciationPotential: analysisResult.marketTrend ?? null,
      rawAnalysis: { summary: analysisResult.summary, recommendation: analysisResult.recommendation, cons: analysisResult.cons },
    }

    const savedAnalysis = await prisma.analysis.upsert({
      where: { auctionId: auction.id },
      update: analysisData,
      create: { auctionId: auction.id, ...analysisData },
    })

    // Deduct credit if this is a new analysis for this user
    let creditUsed = 0
    if (!alreadyAnalyzed) {
      const creditResult = await deductCredit(dbUser.id, body.auctionId)
      if (creditResult.success) {
        creditUsed = creditResult.creditUsed
      }
    }

    // Get updated credits balance
    const updatedUser = await prisma.user.findUnique({
      where: { id: dbUser.id },
      select: { creditsBalance: true },
    })

    return NextResponse.json({
      success: true,
      data: savedAnalysis,
      cached: false,
      creditUsed,
      creditsRemaining: updatedUser?.creditsBalance ?? dbUser.creditsBalance,
    })
  } catch (error) {
    console.error('Error analyzing auction:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze auction',
      },
      { status: 500 }
    )
  }
}
