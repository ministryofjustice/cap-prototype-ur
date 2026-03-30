# Choose hosting environment

Date: 2025-01-27

## Status

✅ Accepted

## Context

We need somewhere to host the prototype. It should be reliable and follow MoJ patterns.

## Considerations

The prototype has two components with different hosting needs:

**Static prototype (`docs/`)** — a plain HTML/JS site with no server-side requirements. GitHub Pages is the simplest possible option and costs nothing.

**Express server (`server/`)** — requires a Node.js runtime and Redis for session storage. MoJ Cloud Platform (Kubernetes on AWS) is the standard hosting environment across MoJ digital services and is the natural choice. It provides managed infrastructure, consistent deployment patterns, and uses AWS ElastiCache for Redis.

## Decision

- The static `docs/` prototype is hosted on **GitHub Pages**, deploying automatically from the `main` branch.
- The Express server is hosted on **MoJ Cloud Platform** (Kubernetes), deployed via GitHub Actions to `development` and `staging` namespaces.
