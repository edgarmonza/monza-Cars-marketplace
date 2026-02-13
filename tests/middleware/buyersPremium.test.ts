import { describe, it, expect } from 'vitest';
import { getBuyersPremiumPercent } from '@/lib/scrapers/middleware/buyersPremium';

describe('getBuyersPremiumPercent', () => {
  it('returns 5% for BRING_A_TRAILER', () => {
    expect(getBuyersPremiumPercent('BRING_A_TRAILER')).toBe(5);
  });

  it('returns 4.5% for CARS_AND_BIDS', () => {
    expect(getBuyersPremiumPercent('CARS_AND_BIDS')).toBe(4.5);
  });

  it('returns 10% for COLLECTING_CARS', () => {
    expect(getBuyersPremiumPercent('COLLECTING_CARS')).toBe(10);
  });
});
