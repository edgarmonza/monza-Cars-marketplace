import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Prisma Auction model shape (mirrors prisma/schema.prisma)
// ---------------------------------------------------------------------------
type PrismaAuctionStatus = 'ACTIVE' | 'ENDING_SOON' | 'ENDED' | 'SOLD' | 'NO_SALE';
type PrismaPlatform = 'BRING_A_TRAILER' | 'CARS_AND_BIDS' | 'COLLECTING_CARS';

interface PrismaAuctionCreate {
  externalId: string;
  platform: PrismaPlatform;
  url: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileageUnit: string;
  bidCount: number;
  status: PrismaAuctionStatus;
  images: string[];
  // Optional fields
  trim?: string | null;
  vin?: string | null;
  mileage?: number | null;
  transmission?: string | null;
  engine?: string | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  location?: string | null;
  currentBid?: number | null;
  endTime?: Date | null;
  description?: string | null;
  sellerNotes?: string | null;
}

// ---------------------------------------------------------------------------
// mapStatus: mirrors the cron route logic
// ---------------------------------------------------------------------------
function mapStatus(raw: string | undefined): PrismaAuctionStatus {
  if (!raw) return 'ACTIVE';
  const upper = raw.toUpperCase();
  if (upper === 'ENDED' || upper === 'SOLD') return 'ENDED';
  return 'ACTIVE';
}

// ---------------------------------------------------------------------------
// Mapper: scraper output -> Prisma create input
// ---------------------------------------------------------------------------
function mapScraperToPrisma(auction: Record<string, any>): PrismaAuctionCreate {
  const images = auction.images?.length
    ? auction.images
    : auction.imageUrl ? [auction.imageUrl] : [];

  return {
    externalId: auction.externalId,
    platform: auction.platform,
    url: auction.url,
    title: auction.title,
    make: auction.make,
    model: auction.model,
    year: auction.year,
    vin: auction.vin ?? null,
    mileage: auction.mileage ?? null,
    mileageUnit: auction.mileageUnit ?? 'miles',
    transmission: auction.transmission ?? null,
    engine: auction.engine ?? null,
    exteriorColor: auction.exteriorColor ?? null,
    interiorColor: auction.interiorColor ?? null,
    location: auction.location ?? null,
    currentBid: auction.currentBid ?? null,
    bidCount: auction.bidCount ?? 0,
    endTime: auction.endTime ? new Date(auction.endTime) : null,
    status: mapStatus(auction.status),
    description: auction.description ?? null,
    sellerNotes: auction.sellerNotes ?? null,
    images,
  };
}

// ---------------------------------------------------------------------------
// Sample auction factory
// ---------------------------------------------------------------------------
function createSampleAuction(platform: PrismaPlatform) {
  return {
    externalId: `test-${platform.toLowerCase()}-1`,
    platform,
    title: '1990 Porsche 911 Carrera 4',
    make: 'Porsche',
    model: '911 Carrera 4',
    year: 1990,
    mileage: 45230,
    mileageUnit: 'miles',
    transmission: '5-Speed Manual',
    engine: '3.6L Flat-6',
    exteriorColor: 'Guards Red',
    interiorColor: 'Black',
    location: 'San Francisco, CA',
    currentBid: 52000,
    bidCount: 31,
    endTime: '2025-06-15T18:00:00Z',
    url: 'https://example.com/listing/test',
    imageUrl: 'https://example.com/img.jpg',
    description: 'Test description',
    sellerNotes: 'Test notes',
    status: 'active',
    vin: 'WP0CB2961LS451234',
    images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
const PLATFORMS: PrismaPlatform[] = ['BRING_A_TRAILER', 'CARS_AND_BIDS', 'COLLECTING_CARS'];

describe('Prisma Schema Alignment', () => {
  for (const platform of PLATFORMS) {
    describe(`${platform} -> Prisma Auction`, () => {
      it('maps all required fields without error', () => {
        const auction = createSampleAuction(platform);
        const mapped = mapScraperToPrisma(auction);

        expect(mapped.externalId).toBeTruthy();
        expect(mapped.platform).toBe(platform);
        expect(mapped.url).toBeTruthy();
        expect(mapped.title).toBeTruthy();
        expect(mapped.make).toBeTruthy();
        expect(mapped.model).toBeTruthy();
        expect(typeof mapped.year).toBe('number');
        expect(typeof mapped.bidCount).toBe('number');
        expect(['ACTIVE', 'ENDING_SOON', 'ENDED', 'SOLD', 'NO_SALE']).toContain(mapped.status);
        expect(Array.isArray(mapped.images)).toBe(true);
        expect(mapped.mileageUnit).toBeTruthy();
      });

      it('maps mileage as integer', () => {
        const mapped = mapScraperToPrisma(createSampleAuction(platform));
        if (mapped.mileage !== null && mapped.mileage !== undefined) {
          expect(Number.isInteger(mapped.mileage)).toBe(true);
        }
      });

      it('maps currentBid as number', () => {
        const mapped = mapScraperToPrisma(createSampleAuction(platform));
        if (mapped.currentBid !== null && mapped.currentBid !== undefined) {
          expect(typeof mapped.currentBid).toBe('number');
        }
      });

      it('converts endTime string to Date', () => {
        const mapped = mapScraperToPrisma(createSampleAuction(platform));
        if (mapped.endTime) {
          expect(mapped.endTime).toBeInstanceOf(Date);
          expect(mapped.endTime.getTime()).not.toBeNaN();
        }
      });

      it('handles null endTime', () => {
        const auction = { ...createSampleAuction(platform), endTime: null };
        const mapped = mapScraperToPrisma(auction);
        expect(mapped.endTime).toBeNull();
      });

      it('falls back to imageUrl when images array is empty', () => {
        const auction = { ...createSampleAuction(platform), images: [] };
        const mapped = mapScraperToPrisma(auction);
        expect(mapped.images).toEqual(['https://example.com/img.jpg']);
      });

      it('returns empty images when both images and imageUrl are absent', () => {
        const auction = { ...createSampleAuction(platform), images: [], imageUrl: null };
        const mapped = mapScraperToPrisma(auction);
        expect(mapped.images).toEqual([]);
      });
    });
  }

  describe('mapStatus', () => {
    it('maps "active" to ACTIVE', () => expect(mapStatus('active')).toBe('ACTIVE'));
    it('maps "ended" to ENDED', () => expect(mapStatus('ended')).toBe('ENDED'));
    it('maps "sold" to ENDED', () => expect(mapStatus('sold')).toBe('ENDED'));
    it('maps "ACTIVE" to ACTIVE', () => expect(mapStatus('ACTIVE')).toBe('ACTIVE'));
    it('maps undefined to ACTIVE', () => expect(mapStatus(undefined)).toBe('ACTIVE'));
    it('maps empty string to ACTIVE', () => expect(mapStatus('')).toBe('ACTIVE'));
    it('maps unknown string to ACTIVE', () => expect(mapStatus('unknown')).toBe('ACTIVE'));
  });
});
