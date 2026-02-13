import { vi } from 'vitest';

// Suppress console output during tests unless DEBUG=true
if (!process.env.DEBUG) {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
}
