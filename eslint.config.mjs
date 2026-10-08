import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nx from '@nx/eslint-plugin';

const constraints = [
  {
    sourceTag: 'scope:frontend',
    onlyDependOnLibsWithTags: ['scope:frontend', 'scope:shared'],
  },
  {
    sourceTag: 'scope:backend',
    onlyDependOnLibsWithTags: ['scope:backend', 'scope:shared'],
  },
  { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: ['scope:shared'] },
  {
    sourceTag: 'scope:infrastructure',
    onlyDependOnLibsWithTags: ['scope:infrastructure'],
  },
  {
    sourceTag: 'layer:domain',
    onlyDependOnLibsWithTags: ['layer:domain', 'layer:contract'],
    bannedExternalImports: [
      '@nestjs/*',
      'next',
      'next/*',
      'react',
      'react-dom',
      '@pulumi/*',
      'server-only',
    ],
  },
  {
    sourceTag: 'layer:contract',
    onlyDependOnLibsWithTags: ['layer:contract'],
    bannedExternalImports: [
      '@nestjs/*',
      'next',
      'next/*',
      'react',
      'react-dom',
      '@pulumi/*',
      'server-only',
    ],
  },
  {
    sourceTag: 'layer:application',
    onlyDependOnLibsWithTags: [
      'layer:application',
      'layer:domain',
      'layer:contract',
    ],
    bannedExternalImports: [
      '@nestjs/*',
      'next',
      'next/*',
      'react',
      'react-dom',
      '@pulumi/*',
      'server-only',
    ],
  },
  {
    sourceTag: 'layer:adapter',
    onlyDependOnLibsWithTags: [
      'layer:adapter',
      'layer:application',
      'layer:domain',
      'layer:contract',
    ],
  },
  {
    sourceTag: 'layer:composition',
    onlyDependOnLibsWithTags: [
      'layer:adapter',
      'layer:application',
      'layer:domain',
      'layer:contract',
    ],
  },
];
export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      'dist/**',
      'coverage/**',
      '.nx/**',
      'playwright-report/**',
      'test-results/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@nx': nx },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: false,
          allow: [],
          depConstraints: constraints,
        },
      ],
    },
  },
  {
    files: ['**/*.cjs', '**/*.mjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
);
