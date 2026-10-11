import { HttpHealth } from './http-health';

describe('HttpHealth', () => {
  const response = (value: unknown, ok = true) =>
    ({ ok, json: jest.fn().mockResolvedValue(value) }) as unknown as Response;
  it('requests health without caching and validates the response', async () => {
    const fetcher = jest.fn().mockResolvedValue(response({ status: 'ok' }));
    await expect(
      new HttpHealth('http://localhost:3001', fetcher).isAvailable(),
    ).resolves.toBe(true);
    expect(fetcher).toHaveBeenCalledWith(
      'http://localhost:3001/api/health',
      expect.objectContaining({
        cache: 'no-store',
        signal: expect.any(AbortSignal),
      }),
    );
  });
  it('uses the platform fetch implementation by default', async () => {
    const previous = globalThis.fetch;
    globalThis.fetch = jest.fn().mockResolvedValue(response({ status: 'ok' }));
    try {
      await expect(new HttpHealth('http://api').isAvailable()).resolves.toBe(
        true,
      );
    } finally {
      globalThis.fetch = previous;
    }
  });
  it.each([{}, null, { status: 'down' }])(
    'rejects malformed response %p',
    async (value) => {
      await expect(
        new HttpHealth(
          'http://api',
          jest.fn().mockResolvedValue(response(value)),
        ).isAvailable(),
      ).resolves.toBe(false);
    },
  );
  it('handles unsuccessful responses', async () => {
    await expect(
      new HttpHealth(
        'http://api',
        jest.fn().mockResolvedValue(response({ status: 'ok' }, false)),
      ).isAvailable(),
    ).resolves.toBe(false);
  });
  it('handles connection errors', async () => {
    await expect(
      new HttpHealth(
        'http://api',
        jest.fn().mockRejectedValue(new Error('offline')),
      ).isAvailable(),
    ).resolves.toBe(false);
  });
  it('handles invalid JSON', async () => {
    const fetcher = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error('JSON')),
    });
    await expect(
      new HttpHealth('http://api', fetcher).isAvailable(),
    ).resolves.toBe(false);
  });
  it.each(['fetch', 'json'])('times out during %s', async (phase) => {
    jest.useFakeTimers();
    const pending = new Promise<Response>(() => undefined);
    const fetcher = jest
      .fn()
      .mockReturnValue(
        phase === 'fetch'
          ? pending
          : Promise.resolve({ ok: true, json: () => pending }),
      );
    const result = new HttpHealth('http://api', fetcher).isAvailable();
    await jest.advanceTimersByTimeAsync(3000);
    await expect(result).resolves.toBe(false);
    jest.useRealTimers();
  });
});
