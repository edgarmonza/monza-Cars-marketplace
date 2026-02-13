import { describe, it, expect } from 'vitest';
import { classifyCondition } from '@/lib/scrapers/middleware/conditionClassifier';

describe('classifyCondition', () => {
  it('classifies "original paint, matching numbers" as original', () => {
    expect(classifyCondition('This car retains its original paint and matching numbers throughout.')).toBe('original');
  });

  it('classifies "unrestored survivor" as original', () => {
    expect(classifyCondition('A true barn find survivor, completely unrestored.')).toBe('original');
  });

  it('classifies "rotisserie restoration" as restored', () => {
    expect(classifyCondition('Full rotisserie restoration completed in 2020 by marque specialists.')).toBe('restored');
  });

  it('classifies "frame-off, rebuilt engine" as restored', () => {
    expect(classifyCondition('Frame-off restoration with rebuilt engine and new paint.')).toBe('restored');
  });

  it('classifies "engine swap, turbo conversion" as modified', () => {
    expect(classifyCondition('LS3 engine swap with custom turbo conversion and widebody kit.')).toBe('modified');
  });

  it('classifies "aftermarket tuned" as modified', () => {
    expect(classifyCondition('Extensively modified with aftermarket exhaust, tuned ECU, and custom intake.')).toBe('modified');
  });

  it('returns unknown for null description', () => {
    expect(classifyCondition(null)).toBe('unknown');
  });

  it('returns unknown for empty string', () => {
    expect(classifyCondition('')).toBe('unknown');
  });

  it('returns unknown when no signals match', () => {
    expect(classifyCondition('A nice car in good condition. Well maintained by previous owner.')).toBe('unknown');
  });

  it('resolves mixed signals by highest score', () => {
    // "matching numbers" = 1 original signal, "restored" + "frame-off" = 2 restored signals
    expect(classifyCondition('Matching numbers car with frame-off restoration completed professionally.')).toBe('restored');
  });
});
