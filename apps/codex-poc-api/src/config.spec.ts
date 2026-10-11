import { readConfiguration } from './config';

describe('API configuration', () => {
  it('uses local development defaults', () => {
    expect(readConfiguration({})).toEqual({
      port: 3001,
      environment: 'development',
    });
  });

  it.each(['development', 'test', 'production'])(
    'accepts %s',
    (environment) => {
      expect(
        readConfiguration({ NODE_ENV: environment, PORT: '4001' }),
      ).toEqual({
        port: 4001,
        environment,
      });
    },
  );

  it.each(['0', '-1', '65536', '3.5', 'abc', '', ' 3001', '1e3'])(
    'rejects port %j',
    (port) => {
      expect(() => readConfiguration({ PORT: port })).toThrow('PORT');
    },
  );

  it('rejects unsupported environments', () => {
    expect(() => readConfiguration({ NODE_ENV: 'staging' })).toThrow(
      'NODE_ENV',
    );
  });
});
