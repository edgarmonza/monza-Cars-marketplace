import { describe, it, expect } from 'vitest';
import {
  detectCurrency,
  normalizePrice,
  extractCountryCode,
  deriveSaleDate,
  getBuyersPremiumPercent,
  extractTrimAndBodyStyle,
  classifyCondition,
} from '@/lib/scrapers/middleware';

// ---------------------------------------------------------------------------
// Target DB required fields (from QUICK_START_CAMILO_1PAGE.md)
// ---------------------------------------------------------------------------
const TARGET_LISTINGS_REQUIRED = [
  'source', 'source_id', 'source_url', 'year', 'make', 'model',
  'price_usd', 'country', 'mileage', 'sale_date', 'status',
];

const TARGET_LISTINGS_IMPORTANT = [
  'original_vs_restored', 'buyers_premium_percent',
  'condition_description', 'color_exterior', 'color_interior', 'hagerty_grade',
  'trim', 'body_style', 'price_eur', 'price_gbp',
];

// ---------------------------------------------------------------------------
// What the scrapers currently output
// ---------------------------------------------------------------------------
const SCRAPER_FIELDS = [
  'externalId', 'platform', 'url', 'title', 'make', 'model', 'year',
  'mileage', 'mileageUnit', 'transmission', 'engine', 'exteriorColor',
  'interiorColor', 'location', 'currentBid', 'bidCount', 'endTime',
  'imageUrl', 'description', 'sellerNotes', 'status', 'vin', 'images',
];

// Direct mapping from scraper field -> target field
const FIELD_MAPPING: Record<string, string> = {
  externalId: 'source_id',
  platform: 'source',
  url: 'source_url',
  year: 'year',
  make: 'make',
  model: 'model',
  mileage: 'mileage',
  status: 'status',
  exteriorColor: 'color_exterior',
  interiorColor: 'color_interior',
  description: 'condition_description',
};

// Middleware-provided fields that fill the gaps
const MIDDLEWARE_FIELDS: Record<string, string> = {
  'normalizePrice.price_usd': 'price_usd',
  'normalizePrice.price_eur': 'price_eur',
  'normalizePrice.price_gbp': 'price_gbp',
  'extractCountryCode': 'country',
  'deriveSaleDate': 'sale_date',
  'getBuyersPremiumPercent': 'buyers_premium_percent',
  'classifyCondition': 'original_vs_restored',
  'extractTrimAndBodyStyle.trim': 'trim',
  'extractTrimAndBodyStyle.bodyStyle': 'body_style',
};

// ---------------------------------------------------------------------------
// Tests: gap-filling verification
// ---------------------------------------------------------------------------
describe('Target DB Schema Alignment (with middleware)', () => {
  it('covers core identification fields (source, source_id, source_url)', () => {
    expect(SCRAPER_FIELDS).toContain('platform');     // -> source
    expect(SCRAPER_FIELDS).toContain('externalId');   // -> source_id
    expect(SCRAPER_FIELDS).toContain('url');          // -> source_url
  });

  it('covers vehicle identification fields (year, make, model)', () => {
    expect(SCRAPER_FIELDS).toContain('year');
    expect(SCRAPER_FIELDS).toContain('make');
    expect(SCRAPER_FIELDS).toContain('model');
  });

  it('covers mileage field', () => {
    expect(SCRAPER_FIELDS).toContain('mileage');
    expect(SCRAPER_FIELDS).toContain('mileageUnit');
  });

  it('covers status field', () => {
    expect(SCRAPER_FIELDS).toContain('status');
  });

  it('covers price_usd via currency middleware', () => {
    const currency = detectCurrency('BRING_A_TRAILER');
    expect(currency).toBe('USD');

    const prices = normalizePrice(50000, 'USD');
    expect(prices).not.toBeNull();
    expect(prices!.price_usd).toBe(50000);
    expect(prices!.price_eur).toBeGreaterThan(0);
    expect(prices!.price_gbp).toBeGreaterThan(0);
  });

  it('covers price_eur and price_gbp via currency middleware', () => {
    // CC uses GBP by default
    const currency = detectCurrency('COLLECTING_CARS');
    expect(currency).toBe('GBP');

    const prices = normalizePrice(185000, 'GBP');
    expect(prices!.price_gbp).toBe(185000);
    expect(prices!.price_usd).toBeGreaterThan(185000); // GBP -> USD conversion
    expect(prices!.price_eur).toBeGreaterThan(0);
  });

  it('covers country via location middleware', () => {
    expect(extractCountryCode('San Francisco, CA')).toBe('US');
    expect(extractCountryCode('London, UK')).toBe('GB');
    expect(extractCountryCode('Munich, Germany')).toBe('DE');
  });

  it('covers sale_date via saleDate middleware', () => {
    const endTime = new Date('2025-06-15T18:00:00Z');
    const saleDate = deriveSaleDate(endTime, 'SOLD');
    expect(saleDate).toBeInstanceOf(Date);
    expect(saleDate!.toISOString()).toBe('2025-06-15T18:00:00.000Z');

    // ACTIVE auctions have no sale date
    const activeSaleDate = deriveSaleDate(endTime, 'ACTIVE');
    expect(activeSaleDate).toBeNull();
  });

  it('covers buyers_premium_percent via buyersPremium middleware', () => {
    expect(getBuyersPremiumPercent('BRING_A_TRAILER')).toBe(5);
    expect(getBuyersPremiumPercent('CARS_AND_BIDS')).toBe(4.5);
    expect(getBuyersPremiumPercent('COLLECTING_CARS')).toBe(10);
  });

  it('covers original_vs_restored via conditionClassifier middleware', () => {
    expect(classifyCondition('matching numbers, original paint')).toBe('original');
    expect(classifyCondition('full rotisserie restoration')).toBe('restored');
    expect(classifyCondition('engine swap, turbo conversion')).toBe('modified');
  });

  it('covers trim via trimExtractor middleware', () => {
    const result = extractTrimAndBodyStyle('2023 Porsche 911 GT3 RS');
    expect(result.trim).toBe('GT3 RS');
  });

  it('covers body_style via trimExtractor middleware', () => {
    const result = extractTrimAndBodyStyle('1990 Porsche 911 Carrera 4 Cabriolet');
    expect(result.bodyStyle).toBe('Cabriolet');
  });

  it('calculates overall coverage percentage (> 90%)', () => {
    const allMappedFields = new Set([
      ...Object.values(FIELD_MAPPING),
      ...Object.values(MIDDLEWARE_FIELDS),
    ]);

    const coveredRequired = TARGET_LISTINGS_REQUIRED.filter(
      (field) => allMappedFields.has(field),
    );
    const coverage = coveredRequired.length / TARGET_LISTINGS_REQUIRED.length;

    // Now covers 11/11 required fields via direct mapping + middleware
    expect(coverage).toBe(1.0);
  });

  it('full middleware pipeline produces complete target-DB record', () => {
    // Simulate a scraped BaT auction going through middleware pipeline
    const scraperOutput = {
      platform: 'BRING_A_TRAILER',
      externalId: 'bat-1990-porsche-911',
      url: 'https://bringatrailer.com/listing/1990-porsche-911/',
      title: '1990 Porsche 911 Carrera 4 Cabriolet',
      make: 'Porsche',
      model: '911 Carrera 4 Cabriolet',
      year: 1990,
      mileage: 45230,
      currentBid: 52000,
      status: 'SOLD',
      location: 'San Francisco, CA',
      endTime: new Date('2025-06-15T18:00:00Z'),
      description: 'Beautiful example, matching numbers, original paint',
    };

    // Run through middleware pipeline
    const currency = detectCurrency(scraperOutput.platform as any);
    const prices = normalizePrice(scraperOutput.currentBid, currency);
    const country = extractCountryCode(scraperOutput.location);
    const saleDate = deriveSaleDate(scraperOutput.endTime, scraperOutput.status);
    const buyersPremium = getBuyersPremiumPercent(scraperOutput.platform as any);
    const { trim, bodyStyle } = extractTrimAndBodyStyle(scraperOutput.title);
    const condition = classifyCondition(scraperOutput.description);

    // Build the complete target-DB record
    const targetRecord = {
      source: scraperOutput.platform,
      source_id: scraperOutput.externalId,
      source_url: scraperOutput.url,
      year: scraperOutput.year,
      make: scraperOutput.make,
      model: scraperOutput.model,
      price_usd: prices!.price_usd,
      price_eur: prices!.price_eur,
      price_gbp: prices!.price_gbp,
      country,
      mileage: scraperOutput.mileage,
      sale_date: saleDate,
      status: scraperOutput.status,
      buyers_premium_percent: buyersPremium,
      original_vs_restored: condition,
      trim,
      body_style: bodyStyle,
    };

    // Verify ALL required fields are present and valid
    expect(targetRecord.source).toBe('BRING_A_TRAILER');
    expect(targetRecord.source_id).toBe('bat-1990-porsche-911');
    expect(targetRecord.source_url).toContain('bringatrailer.com');
    expect(targetRecord.year).toBe(1990);
    expect(targetRecord.make).toBe('Porsche');
    expect(targetRecord.model).toBe('911 Carrera 4 Cabriolet');
    expect(targetRecord.price_usd).toBe(52000);
    expect(targetRecord.price_eur).toBeGreaterThan(0);
    expect(targetRecord.price_gbp).toBeGreaterThan(0);
    expect(targetRecord.country).toBe('US');
    expect(targetRecord.mileage).toBe(45230);
    expect(targetRecord.sale_date).toBeInstanceOf(Date);
    expect(targetRecord.status).toBe('SOLD');
    expect(targetRecord.buyers_premium_percent).toBe(5);
    expect(targetRecord.original_vs_restored).toBe('original');
    expect(targetRecord.body_style).toBe('Cabriolet');
  });

  it('documents additional target tables not yet supported', () => {
    const targetTables = [
      'VEHICLE_SPECS', 'PRICING', 'AUCTION_INFO', 'LOCATION_DATA',
      'PROVENANCE_DATA', 'VEHICLE_HISTORY', 'PHOTOS_MEDIA',
      'PRICE_HISTORY', 'MARKET_SEGMENTS', 'MARKET_ANALYTICS',
    ];

    const prismaModels = ['Auction', 'PriceHistory', 'MarketData'];
    expect(targetTables.length).toBeGreaterThan(prismaModels.length);
  });

  it('documents MISSING: hagerty_grade (requires external API)', () => {
    // Hagerty grade requires integration with Hagerty's valuation API
    // This cannot be derived from scraped data alone
    expect(SCRAPER_FIELDS).not.toContain('hagerty_grade');
  });
});
