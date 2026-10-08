# Repository guidelines

Sudoku Battle lets two players join a room to compete or cooperate at Sudoku.
This milestone scaffolds the workspace; room/game behavior and deployment follow.

## Stack and structure

- Use strict TypeScript, Nx, pnpm, Node 24, NestJS (`apps/codex-poc-api`), Next.js App Router (`apps/codex-poc-frontend`), and Pulumi (`infra/`). Pin versions and commit the lockfile; keep Nx packages synchronized.
- Put reusable projects in `libs/` with explicit public exports and scope/layer tags. Enforce boundaries with lint.
- Dependencies point inward: framework-independent domain; application use cases and ports; adapters implement ports; applications compose dependencies. Frontend must not import backend implementation; infrastructure must not import application code. Framework dependencies belong only in adapters/composition.
- Introduce domain libraries alongside actual game behavior. Use constructor injection and patterns that solve concrete problems; avoid speculative abstractions, generic repositories, base entities, CQRS, and event buses.
- Prefer Server Components and server-side fetching. Use Client Components for interaction or browser APIs. Keep secrets server-only and validate configuration at startup.

## Quality

- Practice TDD: failing test, implementation, refactoring. Add regression tests for bug fixes.
- Enforce at least 90% statements, branches, functions, and lines independently for each app and its owned libraries, including unimported source. Only exclude tests, generated/configuration files, and explicitly documented thin framework entrypoints; verify SSR in production E2E tests without browser JavaScript.
- Use unit tests plus integration/E2E for crucial journeys. As implemented, cover create/join rooms, synchronization, competitive/cooperative moves, reconnection, and completion.
- The scaffold must provide `dev`, `lint`, `format:check`, `typecheck`, `test`, `test:coverage`, `test:integration`, `test:e2e`, `build`, and `check`. Treat commands as pending until implemented and verified; README documents actual usage.
- `check` must cover formatting, boundaries, types, coverage, integration, builds, and E2E. Husky pre-commit and independent CI must run the full suite; commit-msg validates Conventional Commits.

## Delivery and security

- Use descriptive `feat/…`, `fix/…`, or `chore/…` branches and small passing Conventional Commits. Squash-merge PRs; configure required checks and branch protection when a remote exists.
- Never commit secrets/credentials. Provide placeholder environment examples; ignore local environments, dependencies, caches, build output, coverage, scanner results, and local Pulumi state.
- Provide manually invoked, pinned OpenAI security scanner aliases; store results privately outside the repository.
- Preserve unrelated changes. Report checks accurately as passed, failed, or not run.
- Keep these instructions concise. Put onboarding in README and architecture rationale in ADRs.
