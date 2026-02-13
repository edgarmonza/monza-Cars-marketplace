// @ts-nocheck
const BODY_STYLES = [
  'Shooting Brake',
  'Cabriolet', 'Convertible', 'Roadster', 'Targa',
  'Speedster', 'Spyder', 'Spider', 'Berlinetta',
  'Sedan', 'Coupe', 'Coup\u00E9',
  'Wagon', 'Estate', 'Hatchback',
  'SUV', 'Truck', 'Van', 'Pickup',
];

const TRIM_KEYWORDS = [
  'GT3 RS', 'GT2 RS', 'GT3', 'GT2', 'GT4', 'GTS',
  'Turbo S', 'Turbo',
  'Carrera 4S', 'Carrera 4', 'Carrera S', 'Carrera',
  'Competition', 'CSL', 'CS',
  'AMG', 'M Sport', 'S-Line', 'R-Line',
  'Superleggera', 'Stradale', 'Speciale', 'Pista', 'Scuderia',
  'Wildtrak', 'Raptor', 'TRD Pro', 'Trail Boss',
  'RS', 'S', 'R',
  'Touring', 'Sport',
  'Limited', 'Premium', 'Luxury',
];

export function extractTrimAndBodyStyle(
  title: string,
  description?: string | null,
): { trim: string | null; bodyStyle: string | null } {
  const combined = `${title} ${description ?? ''}`;

  let bodyStyle: string | null = null;
  for (const style of BODY_STYLES) {
    if (new RegExp(`\\b${style}\\b`, 'i').test(combined)) {
      bodyStyle = style;
      break;
    }
  }

  let trim: string | null = null;
  for (const t of TRIM_KEYWORDS) {
    const escaped = t.replace(/\s+/g, '\\s+');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(title)) {
      trim = t;
      break;
    }
  }

  return { trim, bodyStyle };
}
