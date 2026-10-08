import { ESLint } from 'eslint';

// Verify real lint diagnostics for forbidden imports without changing tracked files.
const probes = [
  {
    filePath: 'libs/frontend/application/src/boundary-probe.ts',
    code: "import { Module } from '@nestjs/common'; void Module;",
  },
  {
    filePath: 'libs/frontend/application/src/boundary-probe.ts',
    code: "import { HttpHealth } from '@sudoku/frontend-http-adapter'; void HttpHealth;",
  },
  {
    filePath: 'apps/codex-poc-frontend/src/boundary-probe.ts',
    code: "import { AppModule } from '../../codex-poc-api/src/app.module'; void AppModule;",
  },
  {
    filePath: 'infra/src/boundary-probe.ts',
    code: "import { isHealthResponse } from '@sudoku/contracts'; void isHealthResponse;",
  },
];

async function main(): Promise<void> {
  const eslint = new ESLint();
  for (const probe of probes) {
    const results = await eslint.lintText(probe.code, {
      filePath: probe.filePath,
    });
    if (
      !results.some((result) =>
        result.messages.some(
          (message) => message.ruleId === '@nx/enforce-module-boundaries',
        ),
      )
    ) {
      throw new Error(`Architecture rule did not reject ${probe.code}`);
    }
  }
  console.log(
    'Architecture probes passed: framework, layer, frontend/backend, and infrastructure boundaries.',
  );
}
void main();
