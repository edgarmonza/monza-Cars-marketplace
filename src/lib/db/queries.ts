import { prisma } from './prisma'
import type {
  Platform,
  AuctionStatus,
  Prisma,
} from '@prisma/client'

// ---------------------------------------------------------------------------
// Auction queries
// ---------------------------------------------------------------------------

interface GetAuctionsParams {
  platform?: Platform
  make?: string
  model?: string
  status?: AuctionStatus
  page?: number
  pageSize?: number
}

export async function getAuctions({
  platform,
  make,
  model,
  status,
  page = 1,
  pageSize = 20,
}: GetAuctionsParams = {}) {
  const where: Prisma.AuctionWhereInput = {}

  if (platform) where.platform = platform
  if (make) where.make = { equals: make, mode: 'insensitive' }
  if (model) where.model = { equals: model, mode: 'insensitive' }
  if (status) where.status = status

  const [auctions, total] = await Promise.all([
    prisma.auction.findMany({
      where,
      include: { analysis: true },
      orderBy: { endTime: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auction.count({ where }),
  ])

  return {
    auctions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getAuctionById(id: string) {
  return prisma.auction.findUnique({
    where: { id },
    include: {
      analysis: true,
      comparables: true,
      priceHistory: { orderBy: { timestamp: 'asc' } },
    },
  })
}

export async function getAuctionByExternalId(externalId: string) {
  return prisma.auction.findUnique({
    where: { externalId },
    include: {
      analysis: true,
      comparables: true,
      priceHistory: { orderBy: { timestamp: 'asc' } },
    },
  })
}

export async function upsertAuction(
  data: Prisma.AuctionCreateInput & { externalId: string },
) {
  const { externalId, ...rest } = data

  return prisma.auction.upsert({
    where: { externalId },
    create: { externalId, ...rest },
    update: rest,
  })
}

// ---------------------------------------------------------------------------
// Analysis queries
// ---------------------------------------------------------------------------

export async function saveAnalysis(
  auctionId: string,
  data: Omit<Prisma.AnalysisCreateInput, 'auction'>,
) {
  return prisma.analysis.upsert({
    where: { auctionId },
    create: {
      ...data,
      auction: { connect: { id: auctionId } },
    },
    update: data,
  })
}

// ---------------------------------------------------------------------------
// Comparable queries
// ---------------------------------------------------------------------------

export async function getComparables(auctionId: string) {
  return prisma.comparable.findMany({
    where: { auctionId },
    orderBy: { soldDate: 'desc' },
  })
}

export async function saveComparable(
  auctionId: string,
  data: Omit<Prisma.ComparableCreateInput, 'auction'>,
) {
  return prisma.comparable.create({
    data: {
      ...data,
      auction: { connect: { id: auctionId } },
    },
  })
}

// ---------------------------------------------------------------------------
// Price history queries
// ---------------------------------------------------------------------------

export async function savePriceHistory(auctionId: string, bid: number) {
  return prisma.priceHistory.create({
    data: {
      bid,
      auction: { connect: { id: auctionId } },
    },
  })
}

// ---------------------------------------------------------------------------
// Market data queries
// ---------------------------------------------------------------------------

export async function getMarketData(make: string, model: string) {
  return prisma.marketData.findMany({
    where: {
      make: { equals: make, mode: 'insensitive' },
      model: { equals: model, mode: 'insensitive' },
    },
    orderBy: { yearStart: 'asc' },
  })
}

export async function upsertMarketData(
  data: Prisma.MarketDataCreateInput,
) {
  const { make, model, yearStart, yearEnd, ...rest } = data

  return prisma.marketData.upsert({
    where: {
      make_model_yearStart_yearEnd: {
        make: make,
        model: model,
        yearStart: yearStart ?? 0,
        yearEnd: yearEnd ?? 0,
      },
    },
    create: { make, model, yearStart, yearEnd, ...rest },
    update: rest,
  })
}
