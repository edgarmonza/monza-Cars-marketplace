// @ts-nocheck
const US_STATES = /,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\s*$/i;

const CANADIAN_PROVINCES = /,\s*(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|NT|YT|NU)\s*$/i;

const COUNTRY_MAP: Record<string, string> = {
  'united states': 'US', 'usa': 'US',
  'united kingdom': 'GB', 'england': 'GB', 'scotland': 'GB', 'wales': 'GB',
  'germany': 'DE', 'deutschland': 'DE',
  'france': 'FR',
  'italy': 'IT', 'italia': 'IT',
  'spain': 'ES',
  'netherlands': 'NL', 'holland': 'NL',
  'belgium': 'BE',
  'switzerland': 'CH',
  'austria': 'AT',
  'sweden': 'SE',
  'norway': 'NO',
  'denmark': 'DK',
  'japan': 'JP',
  'australia': 'AU',
  'canada': 'CA',
  'portugal': 'PT',
  'ireland': 'IE',
  'monaco': 'MC',
  'luxembourg': 'LU',
  'uae': 'AE', 'united arab emirates': 'AE',
  'qatar': 'QA',
  'singapore': 'SG',
  'new zealand': 'NZ',
  'south africa': 'ZA',
  'brazil': 'BR',
  'mexico': 'MX',
  'china': 'CN',
  'south korea': 'KR',
};

export function extractCountryCode(location: string | null): string | null {
  if (!location || !location.trim()) return null;

  // Check US state abbreviations
  if (US_STATES.test(location)) return 'US';

  // Check Canadian provinces
  if (CANADIAN_PROVINCES.test(location)) return 'CA';

  // Check for country name with word boundaries
  const lower = location.toLowerCase();
  for (const [name, code] of Object.entries(COUNTRY_MAP)) {
    if (new RegExp(`\\b${name}\\b`, 'i').test(lower)) return code;
  }

  // Check short codes at end of string: ", UK", ", US"
  const shortCodes: Record<string, string> = { 'uk': 'GB', 'us': 'US' };
  const endMatch = location.match(/,\s*(\w{2})\s*$/i);
  if (endMatch) {
    const code = shortCodes[endMatch[1].toLowerCase()];
    if (code) return code;
  }

  return null;
}
