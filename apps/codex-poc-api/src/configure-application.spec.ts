import type { INestApplication } from '@nestjs/common';
import { configureApplication } from './configure-application';
import pinoHttp from 'pino-http';
import type { Options } from 'pino-http';

jest.mock('pino-http', () => ({
  __esModule: true,
  default: jest.fn(() => () => undefined),
}));

describe('configureApplication', () => {
  it('sets the API prefix, installs HTTP middleware, and enables graceful shutdown', () => {
    const app = {
      setGlobalPrefix: jest.fn(),
      use: jest.fn(),
      enableShutdownHooks: jest.fn(),
    };
    configureApplication(app as unknown as INestApplication);
    expect(app.setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(app.use).toHaveBeenCalledTimes(2);
    expect(
      app.use.mock.calls.every(
        ([middleware]) => typeof middleware === 'function',
      ),
    ).toBe(true);
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);
    const options = jest.mocked(pinoHttp).mock.calls[0]?.[0] as
      | Options
      | undefined;
    expect(options).toMatchObject({
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ],
    });
    const response = { setHeader: jest.fn() };
    const generateId = options?.genReqId;
    if (typeof generateId !== 'function')
      throw new Error('Missing request ID generator');
    const requestId = generateId({} as never, response as never);
    expect(requestId).toMatch(/^[a-f0-9-]{36}$/);
    expect(response.setHeader).toHaveBeenCalledWith('X-Request-Id', requestId);
  });
});
