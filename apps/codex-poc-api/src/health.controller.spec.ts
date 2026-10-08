import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports availability using the shared response contract', () => {
    expect(new HealthController().health()).toEqual({ status: 'ok' });
  });
});
