import { describe, it, expect } from 'vitest';
import { extractTrimAndBodyStyle } from '@/lib/scrapers/middleware/trimExtractor';

describe('extractTrimAndBodyStyle', () => {
  it('extracts GT3 RS trim and no body style', () => {
    const { trim, bodyStyle } = extractTrimAndBodyStyle('2023 Porsche 911 GT3 RS');
    expect(trim).toBe('GT3 RS');
    expect(bodyStyle).toBeNull();
  });

  it('extracts Turbo S trim', () => {
    const { trim } = extractTrimAndBodyStyle('2024 Porsche 911 Turbo S');
    expect(trim).toBe('Turbo S');
  });

  it('extracts CSL trim', () => {
    const { trim } = extractTrimAndBodyStyle('1973 BMW 3.0 CSL');
    expect(trim).toBe('CSL');
  });

  it('extracts Cabriolet body style', () => {
    const { bodyStyle } = extractTrimAndBodyStyle('1990 Porsche 911 Carrera 4 Cabriolet');
    expect(bodyStyle).toBe('Cabriolet');
  });

  it('extracts Roadster body style', () => {
    const { bodyStyle } = extractTrimAndBodyStyle('1965 Jaguar E-Type Roadster');
    expect(bodyStyle).toBe('Roadster');
  });

  it('extracts Spider body style', () => {
    const { bodyStyle } = extractTrimAndBodyStyle('2024 Ferrari 296 GTS Spider');
    expect(bodyStyle).toBe('Spider');
  });

  it('extracts Carrera 4S trim (longer match before Carrera S)', () => {
    const { trim } = extractTrimAndBodyStyle('2020 Porsche 911 Carrera 4S');
    expect(trim).toBe('Carrera 4S');
  });

  it('returns nulls when no match', () => {
    const { trim, bodyStyle } = extractTrimAndBodyStyle('1990 Honda Civic');
    expect(trim).toBeNull();
    expect(bodyStyle).toBeNull();
  });

  it('extracts body style from description when not in title', () => {
    const { bodyStyle } = extractTrimAndBodyStyle(
      '1990 Porsche 911',
      'This beautiful convertible has been well maintained.',
    );
    expect(bodyStyle).toBe('Convertible');
  });

  it('is case insensitive', () => {
    const { trim, bodyStyle } = extractTrimAndBodyStyle('2023 porsche 911 gt3 rs cabriolet');
    expect(trim).toBe('GT3 RS');
    expect(bodyStyle).toBe('Cabriolet');
  });

  it('extracts Shooting Brake body style', () => {
    const { bodyStyle } = extractTrimAndBodyStyle('2020 Ferrari GTC4Lusso Shooting Brake');
    expect(bodyStyle).toBe('Shooting Brake');
  });
});
