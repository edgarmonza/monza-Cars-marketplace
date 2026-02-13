import { describe, it, expect } from 'vitest';
import { deriveSaleDate } from '@/lib/scrapers/middleware/saleDate';

describe('deriveSaleDate', () => {
  it('returns Date when status is SOLD and endTime provided', () => {
    const result = deriveSaleDate('2025-06-15T18:00:00Z', 'SOLD');
    expect(result).toBeInstanceOf(Date);
    expect(result!.toISOString()).toContain('2025-06-15');
  });

  it('returns Date when status is ENDED', () => {
    const result = deriveSaleDate('2025-06-15T18:00:00Z', 'ENDED');
    expect(result).toBeInstanceOf(Date);
  });

  it('handles lowercase status', () => {
    const result = deriveSaleDate('2025-06-15T18:00:00Z', 'sold');
    expect(result).toBeInstanceOf(Date);
  });

  it('returns null when status is ACTIVE', () => {
    expect(deriveSaleDate('2025-06-15T18:00:00Z', 'ACTIVE')).toBeNull();
  });

  it('returns null when endTime is null', () => {
    expect(deriveSaleDate(null, 'SOLD')).toBeNull();
  });

  it('returns null for undefined status', () => {
    expect(deriveSaleDate('2025-06-15T18:00:00Z', undefined)).toBeNull();
  });

  it('accepts Date object as endTime', () => {
    const d = new Date('2025-06-15T18:00:00Z');
    const result = deriveSaleDate(d, 'SOLD');
    expect(result).toBeInstanceOf(Date);
    expect(result!.getTime()).toBe(d.getTime());
  });

  it('returns null for invalid date string', () => {
    expect(deriveSaleDate('not-a-date', 'SOLD')).toBeNull();
  });
});
