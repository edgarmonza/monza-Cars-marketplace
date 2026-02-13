// @ts-nocheck
export type CurrencyCode = 'USD' | 'EUR' | 'GBP';
export type Platform = 'BRING_A_TRAILER' | 'CARS_AND_BIDS' | 'COLLECTING_CARS';

export interface MultiCurrencyPrice {
  price_usd: number | null;
  price_eur: number | null;
  price_gbp: number | null;
  original_currency: CurrencyCode;
}

const DEFAULT_RATES: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  USD: { USD: 1, EUR: 0.92, GBP: 0.79 },
  EUR: { USD: 1.09, EUR: 1, GBP: 0.86 },
  GBP: { USD: 1.27, EUR: 1.16, GBP: 1 },
};

export function detectCurrency(
  platform: Platform,
  rawPriceText?: string | null,
): CurrencyCode {
  if (rawPriceText) {
    if (rawPriceText.includes('\u00A3')) return 'GBP'; // £
    if (rawPriceText.includes('\u20AC') || rawPriceText.toUpperCase().includes('EUR')) return 'EUR'; // €
    if (rawPriceText.includes('$')) return 'USD';
  }
  if (platform === 'COLLECTING_CARS') return 'GBP';
  return 'USD';
}

export function normalizePrice(
  amount: number | null,
  currency: CurrencyCode,
  rates?: Record<CurrencyCode, Record<CurrencyCode, number>>,
): MultiCurrencyPrice {
  const r = rates ?? DEFAULT_RATES;
  if (amount === null) {
    return { price_usd: null, price_eur: null, price_gbp: null, original_currency: currency };
  }
  return {
    price_usd: Math.round(amount * r[currency].USD * 100) / 100,
    price_eur: Math.round(amount * r[currency].EUR * 100) / 100,
    price_gbp: Math.round(amount * r[currency].GBP * 100) / 100,
    original_currency: currency,
  };
}
