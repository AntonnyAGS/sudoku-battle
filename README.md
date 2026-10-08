# Sudoku Battle

Two players will join a room to compete or cooperate at Sudoku. This milestone
provides the Nx foundation and a production SSR health journey. Room behavior,
authentication, persistence, Redis, WebSockets, Sudoku rules, and deployment are
future milestones.

## Get started

Use Node **24.18.0** (see `.node-version`) and pnpm **11.17.0** (see
`package.json`). Install that pnpm version through your preferred package manager.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

Open [the frontend](http://localhost:3000). The NestJS API listens on port 3001;
`GET /api/health` returns `{"status":"ok"}`. The home page renders API availability
on the server. A failed request, invalid response, or three-second timeout renders
an accessible “Service unavailable” state.

No application secrets or cloud account are required. Development defaults work
without environment files. See the application `.env.example` files for optional
overrides. `PORT` configures the API; `API_BASE_URL` is a server-only HTTP(S) origin
for Next.js and must never use a `NEXT_PUBLIC_` prefix. Configuration is validated
at startup. Keep local environment files and credentials out of Git.

## Commands

Run commands from the workspace root.

| Command                      | Purpose                                                                |
| ---------------------------- | ---------------------------------------------------------------------- |
| `pnpm dev`                   | Start both applications with local development tooling                 |
| `pnpm lint`                  | ESLint and Nx dependency boundaries                                    |
| `pnpm format:check`          | Check Prettier formatting                                              |
| `pnpm typecheck`             | Strict TypeScript validation across the workspace                      |
| `pnpm test`                  | Unit tests                                                             |
| `pnpm test:coverage`         | Unit tests with independent coverage gates                             |
| `pnpm test:integration`      | NestJS HTTP integration tests                                          |
| `pnpm test:e2e`              | Production SSR journeys in Playwright                                  |
| `pnpm build`                 | Build API, frontend, and infrastructure                                |
| `pnpm check`                 | Formatting, lint/boundaries, types, coverage, integration, builds, E2E |
| `pnpm security:scan:dry-run` | Manually validate scanner inputs                                       |
| `pnpm security:scan`         | Manually run the pinned security scanner                               |

Playwright requires Chromium and uses production servers. On Linux CI, install
with `pnpm exec playwright install chromium --with-deps`. Release ports 3000/3001
and 3002 before running E2E or the full check. Port 3002 hosts the unavailable
frontend scenario; port 3999 must remain unused for its unreachable API.
Diagnostic output is in `coverage/`,
`playwright-report/`, and `test-results/`.

## Architecture and tests

`apps/` contains NestJS and Next.js composition. `libs/` contains shared response
contracts, frontend application ports/use cases, and the server-only HTTP adapter.
`infra/` contains a provider-neutral Pulumi project with no resources. Projects
have explicit exports and Nx scope/layer tags. Lint rejects frontend dependencies
on backend implementation, infrastructure dependencies on application code, and
dependencies that point outward from application/domain layers. See
[ADR 0001](docs/adr/0001-workspace-architecture.md) for rationale.

Jest, React Testing Library, Nest testing utilities, and Supertest cover
configuration, health behavior, HTTP success/failure, and rendering. Coverage must
reach 90% separately for statements, branches, functions, and lines for API-owned
source and frontend-owned source, including unimported files. Shared contracts
have their own independent 90% gate. Tests and configuration/generated files are
excluded, together with behavior-free public export barrels (`index.ts`). Thin entrypoints excluded explicitly are API `src/main.ts` and frontend
`src/app/page.tsx`, `src/app/layout.tsx`, and `src/instrumentation.ts`; behavior
resides in tested modules. Playwright checks healthy and unavailable responses
against production builds with browser JavaScript disabled and checks initial
HTML, covering the SSR composition excluded from unit coverage.

Practice TDD: failing test, implementation, then refactoring. The next milestone
is create/join-room behavior, with domain libraries introduced alongside it.
Crucial future journeys need integration/E2E coverage when implemented: room
creation/joining, player synchronization, competitive/cooperative moves,
reconnection, and completion.

## Delivery

Use descriptive `feat/…`, `fix/…`, or `chore/…` branches and small Conventional
Commits. Husky pre-commit runs `pnpm check`; commit-msg validates Conventional
Commits. The GitHub Actions `quality` job independently runs the same full check
for PRs and `main`, using frozen installation and diagnostic artifacts.

When a GitHub remote exists, enable squash-only merges, protect `main`, require
PR review and the `quality` status check, and prevent direct pushes. These hosting
settings are not configured by files in this repository.

## Security scanning

The aliases invoke `@openai/codex-security@0.2.0` manually; they are separate from
ordinary checks and CI. Follow the [official CLI quickstart](https://learn.chatgpt.com/docs/security/cli).
Authenticate with `pnpm dlx @openai/codex-security@0.2.0 login`; headless machines
can add `--device-auth`. API-key authentication is also available when configured
privately. Scans may require account access and incur usage costs.

```sh
pnpm security:scan:dry-run
pnpm security:scan --output-dir /private/path/outside/repository/results
```

Without `--output-dir`, results use the CLI's private persistent state directory
outside this repository. If needed, set `CODEX_SECURITY_STATE_DIR` to a private
directory outside the repository. Results/logs can contain source excerpts and
vulnerability details; keep them private and choose a retention policy. Never
commit credentials or scanner results. Dry run validates inputs without starting
a model scan.

Dependency audit (2026-10-07): runtime dependencies have no reported advisories.
Two advisories remain in development tooling (`braces` and `sprintf-js`); their
reported patched releases, 3.0.4 and 1.1.4 respectively, are not yet published
in npm. Available `undici` and `esbuild` fixes are pinned through workspace
overrides. Recheck upstream releases before changing those pins.
