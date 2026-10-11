import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { HealthController } from './health.controller';

describe('AppModule', () => {
  it('composes the health controller', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    expect(module.get(HealthController).health()).toEqual({ status: 'ok' });
    await module.close();
  });
});
