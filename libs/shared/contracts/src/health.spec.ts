import { isHealthResponse } from './health';
describe('health contract', () => {
  it('accepts healthy response', () =>
    expect(isHealthResponse({ status: 'ok' })).toBe(true));
  it.each([null, undefined, 'ok', 1, {}, { status: 'down' }])(
    'rejects invalid response %p',
    (value) => expect(isHealthResponse(value)).toBe(false),
  );
});
