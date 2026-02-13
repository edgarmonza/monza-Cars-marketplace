// @ts-nocheck
export type ConditionClass = 'original' | 'restored' | 'modified' | 'unknown';

const RESTORED_SIGNALS = [
  'restored', 'restoration', 'concours restoration', 'bare-metal respray',
  'full repaint', 'rebuilt engine', 'refurbished', 'professionally restored',
  'rotisserie restoration', 'frame-off',
];

const ORIGINAL_SIGNALS = [
  'original paint', 'numbers matching', 'matching numbers', 'all original', 'unrestored',
  'survivor', 'time capsule', 'barn find', 'never restored',
  'original condition',
];

const MODIFIED_SIGNALS = [
  'modified', 'custom', 'swapped', 'aftermarket', 'turbo conversion',
  'engine swap', 'widebody', 'tuned', 'built motor', 'caged',
];

export function classifyCondition(description: string | null): ConditionClass {
  if (!description) return 'unknown';
  const lower = description.toLowerCase();

  let restoredScore = 0;
  let originalScore = 0;
  let modifiedScore = 0;

  for (const signal of RESTORED_SIGNALS) {
    if (lower.includes(signal)) restoredScore++;
  }
  for (const signal of ORIGINAL_SIGNALS) {
    if (lower.includes(signal)) originalScore++;
  }
  for (const signal of MODIFIED_SIGNALS) {
    if (lower.includes(signal)) modifiedScore++;
  }

  const max = Math.max(restoredScore, originalScore, modifiedScore);
  if (max === 0) return 'unknown';
  if (originalScore >= restoredScore && originalScore >= modifiedScore) return 'original';
  if (restoredScore >= modifiedScore) return 'restored';
  return 'modified';
}
