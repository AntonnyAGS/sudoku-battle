# ADR 0001: Nx workspace with inward dependencies

Status: accepted.

## Context

Sudoku Battle needs a NestJS API and a Next.js frontend while keeping game rules
independent of transport, storage, and frameworks. This scaffold has no game
behavior yet. Development and verification must work without cloud credentials.

## Decision

Use pinned Node 24, pnpm, strict TypeScript, synchronized Nx packages, NestJS,
Next.js App Router, and a provider-neutral Pulumi TypeScript project. Put entry
points in `apps/`, reusable tagged projects in `libs/`, and infrastructure in
`infra/`. Enforce scope and layer dependencies with Nx ESLint boundaries and
restrict framework imports to adapters/composition.

Dependencies point inward: domain defines framework-independent behavior;
application defines use cases and ports; adapters implement ports; applications
compose objects using constructor injection. Frontend cannot import backend
implementation, and infrastructure cannot import application code. Share only
framework-independent public contracts across application scopes.

Start with health contracts and a frontend availability port/use case and HTTP
adapter. Add room/game domain libraries only with actual behavior. Avoid generic
repositories, base entities, CQRS, and event buses until concrete requirements
justify them. Prefer Server Components and server-side fetching; add Client
Components for interactions or browser APIs.

The HTTP adapter disables caching, enforces a three-second timeout, validates the
response contract, and maps failures to unavailable. Keep configuration validated
and server-only. API composition adds security headers, structured request
logging, and graceful shutdown.

## Consequences

Nx tags and explicit library exports make boundaries reviewable and enforceable.
Ports enable isolated tests without real servers. Separate API/frontend coverage
gates include each application's owned libraries; shared contracts have their own
independent gate. This prevents one application's coverage from hiding gaps in
the other. Behavior-free public export barrels and documented thin framework
entrypoints are omitted, with production SSR E2E verifying composition
and initial HTML without browser JavaScript.

The full quality suite runs both through local hooks and independent CI. Pulumi
build/typecheck introduces tooling without choosing a cloud or provisioning
resources. Provider choice, persistence, synchronization, authentication, and
deployment each require later decisions with corresponding journeys and tests.
