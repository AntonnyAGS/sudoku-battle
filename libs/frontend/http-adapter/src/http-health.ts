import 'server-only';
import { isHealthResponse } from '@sudoku/contracts';
import type { HealthPort } from '@sudoku/frontend-application';

export class HttpHealth implements HealthPort {
  constructor(
    private readonly baseUrl: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async isAvailable(): Promise<boolean> {
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<false>((resolve) => {
      timeout = setTimeout(() => {
        controller.abort();
        resolve(false);
      }, 3000);
    });
    const request = async (): Promise<boolean> => {
      try {
        const response = await this.fetcher(`${this.baseUrl}/api/health`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        return response.ok && isHealthResponse(await response.json());
      } catch {
        return false;
      }
    };
    try {
      return await Promise.race([request(), deadline]);
    } finally {
      clearTimeout(timeout);
    }
  }
}
