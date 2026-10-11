import { GetAvailability, HealthPort } from './availability';

describe('GetAvailability', () => {
  it.each([true, false])('returns port availability %s', async (available) => {
    const port: HealthPort = {
      isAvailable: jest.fn().mockResolvedValue(available),
    };
    await expect(new GetAvailability(port).execute()).resolves.toBe(available);
    expect(port.isAvailable).toHaveBeenCalledTimes(1);
  });
});
