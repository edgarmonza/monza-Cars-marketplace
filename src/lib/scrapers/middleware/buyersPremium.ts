// @ts-nocheck
export type Platform = 'BRING_A_TRAILER' | 'CARS_AND_BIDS' | 'COLLECTING_CARS';

const PREMIUM_MAP: Record<Platform, number> = {
  BRING_A_TRAILER: 5,
  CARS_AND_BIDS: 4.5,
  COLLECTING_CARS: 10,
};

export function getBuyersPremiumPercent(platform: Platform): number {
  return PREMIUM_MAP[platform] ?? 0;
}
