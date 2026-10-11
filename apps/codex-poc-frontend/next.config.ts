import type { NextConfig } from 'next';
import { createRequire } from 'node:module';

// Next's transpiled configuration needs an explicit origin for local TS imports.
const { readEnvironment } = createRequire(__filename)(
  './src/config/environment.ts',
) as typeof import('./src/config/environment');

readEnvironment(process.env);

// Repository guidelines are maintained in the root AGENTS.md.
const config: NextConfig = { poweredByHeader: false, agentRules: false };
export default config;
