// @ts-nocheck
export function deriveSaleDate(
  endTime: Date | string | null,
  status: string | undefined,
): Date | null {
  if (!endTime) return null;
  const upper = (status ?? '').toUpperCase();
  if (upper === 'SOLD' || upper === 'ENDED') {
    const d = typeof endTime === 'string' ? new Date(endTime) : endTime;
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}
