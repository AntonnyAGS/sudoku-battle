import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApplication } from './configure-application';
import { readConfiguration } from './config';

async function bootstrap(): Promise<void> {
  const configuration = readConfiguration(process.env);
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  await app.listen(configuration.port, '0.0.0.0');
}

void bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
