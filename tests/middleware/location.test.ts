import { describe, it, expect } from 'vitest';
import { extractCountryCode } from '@/lib/scrapers/middleware/location';

describe('extractCountryCode', () => {
  it('maps "San Francisco, CA" to US', () => {
    expect(extractCountryCode('San Francisco, CA')).toBe('US');
  });

  it('maps "Dallas, TX" to US', () => {
    expect(extractCountryCode('Dallas, TX')).toBe('US');
  });

  it('maps "New York, NY" to US', () => {
    expect(extractCountryCode('New York, NY')).toBe('US');
  });

  it('maps "Washington, DC" to US', () => {
    expect(extractCountryCode('Washington, DC')).toBe('US');
  });

  it('maps "Toronto, ON" to CA (Canadian province)', () => {
    expect(extractCountryCode('Toronto, ON')).toBe('CA');
  });

  it('maps "Vancouver, BC" to CA', () => {
    expect(extractCountryCode('Vancouver, BC')).toBe('CA');
  });

  it('maps "London, UK" to GB', () => {
    expect(extractCountryCode('London, UK')).toBe('GB');
  });

  it('maps "London, United Kingdom" to GB', () => {
    expect(extractCountryCode('London, United Kingdom')).toBe('GB');
  });

  it('maps "Munich, Germany" to DE', () => {
    expect(extractCountryCode('Munich, Germany')).toBe('DE');
  });

  it('maps "Paris, France" to FR', () => {
    expect(extractCountryCode('Paris, France')).toBe('FR');
  });

  it('maps "Tokyo, Japan" to JP', () => {
    expect(extractCountryCode('Tokyo, Japan')).toBe('JP');
  });

  it('maps "Sydney, Australia" to AU', () => {
    expect(extractCountryCode('Sydney, Australia')).toBe('AU');
  });

  it('maps "Milan, Italy" to IT', () => {
    expect(extractCountryCode('Milan, Italy')).toBe('IT');
  });

  it('maps "Monaco" to MC', () => {
    expect(extractCountryCode('Monaco')).toBe('MC');
  });

  it('returns null for null', () => {
    expect(extractCountryCode(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractCountryCode('')).toBeNull();
  });

  it('returns null for unknown location', () => {
    expect(extractCountryCode('Unknown Place')).toBeNull();
  });
});
