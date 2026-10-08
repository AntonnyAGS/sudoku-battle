# Infrastructure

This Pulumi TypeScript project declares no resources or provider dependencies.
`pnpm exec nx run infrastructure:typecheck` and
`pnpm exec nx run infrastructure:build` need no cloud account, credentials,
Pulumi CLI, or stack. The workspace pins `@pulumi/pulumi` for future resources.

Deployment is deferred. Before introducing resources, record the provider,
regions, environments, state backend, secret management, and approval process
in an ADR. Install and pin the Pulumi CLI at that milestone.

For optional local experimentation after installing the CLI, use `pulumi login
--local` and `pulumi stack init dev --cwd infra`. Local state and stack files are
ignored; do not commit passphrases or credentials. The empty program provisions
nothing. These commands are outside normal development and validation.
