import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const filePath = path.join(
  repoRoot,
  'src/app/[locale]/auctions/[id]/AuctionDetailClient.tsx'
);

if (!fs.existsSync(filePath)) {
  console.error(`Missing file: ${filePath}`);
  process.exit(2);
}

const raw = fs.readFileSync(filePath, 'utf8');

// Heuristic: strip comments so we only flag actual UI strings.
const source = raw
  // block comments
  .replace(/\/\*[\s\S]*?\*\//g, '')
  // line comments
  .replace(/(^|\s)\/\/.*$/gm, '$1');

const requiredSnippets = ['useTranslations("auctionDetail")', 'useLocale()'];
const forbiddenPhrases = [
  'Current Bid',
  'Final Price',
  'Recommended Cap',
  'Based on market analysis',
  'Place Bid',
  'View Original Listing',
  'Chat with Analyst',
  'Go Back',
  'Back to Feed',
  'Live Auction',
  'Strategy Insights',
  'Financial Projection',
  'Due Diligence',
  'Comparable Sales',
  'Registry Intelligence'
];

const missingRequired = requiredSnippets.filter((s) => !source.includes(s));
const foundForbidden = forbiddenPhrases.filter((p) => source.includes(p));

if (missingRequired.length || foundForbidden.length) {
  console.error('FAIL: i18n auction detail hardcoded check');
  if (missingRequired.length) {
    console.error('\nMissing required wiring:');
    for (const s of missingRequired) console.error(`  - ${s}`);
  }
  if (foundForbidden.length) {
    console.error('\nFound forbidden hardcoded UI phrases:');
    for (const p of foundForbidden) console.error(`  - ${p}`);
  }
  process.exit(1);
}

console.log('PASS: Auction detail page uses next-intl and has no forbidden hardcoded phrases.');
