import { readEnvironment } from './environment';

describe('readEnvironment', () => {
  it('uses localhost by default', () => {
    expect(readEnvironment({})).toEqual({
      apiBaseUrl: 'http://localhost:3001',
    });
  });
  it.each(['http://api:3001', 'https://example.com/'])('accepts %s', (url) => {
    expect(readEnvironment({ API_BASE_URL: url }).apiBaseUrl).toBe(
      url.replace(/\/$/, ''),
    );
  });
  it.each([
    '',
    'broken',
    'ftp://example.com',
    'http://user:pass@example.com',
    'http://:pass@example.com',
    'https://example.com/path',
    'https://example.com?q=1',
    'https://example.com#hash',
  ])('rejects %s', (url) => {
    expect(() => readEnvironment({ API_BASE_URL: url })).toThrow(
      'API_BASE_URL',
    );
  });
});
