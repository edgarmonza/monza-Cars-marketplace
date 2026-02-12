export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ScrapeResult {
  platform: string;
  auctionsFound: number;
  auctionsUpdated: number;
  errors: string[];
  duration: number;
}
