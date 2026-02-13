import { describe, it, expect } from 'vitest';
import { detectCurrency, normalizePrice } from '@/lib/scrapers/middleware/currency';

describe('detectCurrency', () => {
  it('returns USD for BRING_A_TRAILER', () => {
    expect(detectCurrency('BRING_A_TRAILER')).toBe('USD');
  });

  it('returns USD for CARS_AND_BIDS', () => {
    expect(detectCurrency('CARS_AND_BIDS')).toBe('USD');
  });

  it('returns GBP for COLLECTING_CARS by default', () => {
    expect(detectCurrency('COLLECTING_CARS')).toBe('GBP');
  });

  it('overrides with £ symbol in rawPriceText', () => {
    expect(detectCurrency('BRING_A_TRAILER', '£95,000')).toBe('GBP');
  });

  it('overrides with € symbol in rawPriceText', () => {
    expect(detectCurrency('BRING_A_TRAILER', '€85,500')).toBe('EUR');
  });

  it('overrides with EUR text in rawPriceText', () => {
    expect(detectCurrency('COLLECTING_CARS', 'EUR 165,000')).toBe('EUR');
  });

  it('overrides with $ symbol for CC platform', () => {
    expect(detectCurrency('COLLECTING_CARS', '$120,000')).toBe('USD');
  });

  it('uses platform default when rawPriceText is null', () => {
    expect(detectCurrency('COLLECTING_CARS', null)).toBe('GBP');
  });

  it('uses platform default when rawPriceText has no currency symbol', () => {
    expect(detectCurrency('BRING_A_TRAILER', '45000')).toBe('USD');
  });
});

describe('normalizePrice', () => {
  it('converts USD amount to all three currencies', () => {
    const result = normalizePrice(100000, 'USD');
    expect(result.price_usd).toBe(100000);
    expect(result.price_eur).toBe(92000);
    expect(result.price_gbp).toBe(79000);
    expect(result.original_currency).toBe('USD');
  });

  it('converts GBP amount to all three currencies', () => {
    const result = normalizePrice(100000, 'GBP');
    expect(result.price_usd).toBe(127000);
    expect(result.price_eur).toBe(116000);
    expect(result.price_gbp).toBe(100000);
    expect(result.original_currency).toBe('GBP');
  });

  it('converts EUR amount to all three currencies', () => {
    const result = normalizePrice(100000, 'EUR');
    expect(result.price_usd).toBe(109000);
    expect(result.price_eur).toBe(100000);
    expect(result.price_gbp).toBe(86000);
    expect(result.original_currency).toBe('EUR');
  });

  it('returns all nulls for null amount', () => {
    const result = normalizePrice(null, 'USD');
    expect(result.price_usd).toBeNull();
    expect(result.price_eur).toBeNull();
    expect(result.price_gbp).toBeNull();
    expect(result.original_currency).toBe('USD');
  });

  it('accepts custom exchange rates', () => {
    const customRates = {
      USD: { USD: 1, EUR: 0.5, GBP: 0.4 },
      EUR: { USD: 2, EUR: 1, GBP: 0.8 },
      GBP: { USD: 2.5, EUR: 1.25, GBP: 1 },
    };
    const result = normalizePrice(10000, 'USD', customRates);
    expect(result.price_usd).toBe(10000);
    expect(result.price_eur).toBe(5000);
    expect(result.price_gbp).toBe(4000);
  });

  it('rounds to 2 decimal places', () => {
    const result = normalizePrice(33333, 'GBP');
    // 33333 * 1.27 = 42332.91
    expect(result.price_usd).toBe(42332.91);
  });
});
