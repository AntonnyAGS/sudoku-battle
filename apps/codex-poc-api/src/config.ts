export interface ApiConfiguration {
  readonly port: number;
  readonly environment: 'development' | 'test' | 'production';
}

export function readConfiguration(
  environment: Readonly<Record<string, string | undefined>>,
): ApiConfiguration {
  const nodeEnvironment = environment.NODE_ENV ?? 'development';
  if (
    nodeEnvironment !== 'development' &&
    nodeEnvironment !== 'test' &&
    nodeEnvironment !== 'production'
  ) {
    throw new Error('NODE_ENV must be development, test, or production');
  }

  const rawPort = environment.PORT ?? '3001';
  const port = Number(rawPort);
  if (
    !/^\d+$/.test(rawPort) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return { port, environment: nodeEnvironment };
}
