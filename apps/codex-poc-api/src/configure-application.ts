import type { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';

export function configureApplication(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(
    pinoHttp({
      redact: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ],
      genReqId: (_request, response) => {
        const requestId = randomUUID();
        response.setHeader('X-Request-Id', requestId);
        return requestId;
      },
    }),
  );
  app.enableShutdownHooks();
}
