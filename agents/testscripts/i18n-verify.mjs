import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const messagesDir = path.join(repoRoot, 'messages');

const locales = ['en', 'de', 'es', 'ja'];
const sourceLocale = 'en';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function flattenKeys(obj, prefix = '') {
  const out = new Map();

  for (const [key, value] of Object.entries(obj ?? {})) {
    const next = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      for (const [k, v] of flattenKeys(value, next)) out.set(k, v);
    } else {
      out.set(next, typeof value);
    }
  }

  return out;
}

function diffKeys(sourceMap, targetMap) {
  const missing = [];
  const extra = [];
  const typeMismatches = [];

  for (const [key, sourceType] of sourceMap.entries()) {
    if (!targetMap.has(key)) {
      missing.push(key);
      continue;
    }
    const targetType = targetMap.get(key);
    if (targetType !== sourceType) {
      typeMismatches.push({ key, sourceType, targetType });
    }
  }

  for (const key of targetMap.keys()) {
    if (!sourceMap.has(key)) extra.push(key);
  }

  missing.sort();
  extra.sort();
  typeMismatches.sort((a, b) => a.key.localeCompare(b.key));

  return { missing, extra, typeMismatches };
}

function formatSection(title, lines) {
  if (!lines.length) return '';
  return `\n${title}\n${lines.map((l) => `  - ${l}`).join('\n')}`;
}

const sourcePath = path.join(messagesDir, `${sourceLocale}.json`);
if (!fs.existsSync(sourcePath)) {
  console.error(`Missing source messages: ${sourcePath}`);
  process.exit(2);
}

const source = flattenKeys(readJson(sourcePath));

let failed = false;

for (const locale of locales) {
  const targetPath = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(targetPath)) {
    console.error(`Missing messages file: ${targetPath}`);
    failed = true;
    continue;
  }

  const target = flattenKeys(readJson(targetPath));
  const { missing, extra, typeMismatches } = diffKeys(source, target);

  if (missing.length || extra.length || typeMismatches.length) {
    failed = true;
  }

  console.log(`\n== i18n key check: ${locale} (vs ${sourceLocale}) ==`);
  console.log(`Missing: ${missing.length} | Extra: ${extra.length} | Type mismatches: ${typeMismatches.length}`);

  process.stdout.write(formatSection('Missing keys', missing));
  process.stdout.write(formatSection('Extra keys', extra));
  process.stdout.write(
    formatSection(
      'Type mismatches',
      typeMismatches.map(
        (m) => `${m.key} (source: ${m.sourceType}, target: ${m.targetType})`
      )
    )
  );

  console.log('');
}

if (failed) {
  console.error('\nFAIL: i18n messages are out of sync.');
  process.exit(1);
}

console.log('\nPASS: i18n message keys are in sync.');
