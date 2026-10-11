import { spawn } from 'node:child_process';
import { expect, test } from '@playwright/test';

test('invalid server configuration stops the production frontend', async () => {
  const server = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      'apps/codex-poc-frontend',
      '--port',
      '3003',
    ],
    { env: { ...process.env, API_BASE_URL: 'ftp://example.com' } },
  );
  let output = '';
  server.stdout.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  server.stderr.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  const deadline = setTimeout(() => server.kill(), 10_000);
  try {
    const code = await new Promise<number | null>((resolve, reject) => {
      server.once('error', reject);
      server.once('close', resolve);
    });
    expect(code).toBe(1);
    expect(output).toContain('API_BASE_URL must be an absolute HTTP(S) origin');
  } finally {
    clearTimeout(deadline);
    server.kill();
  }
});
