# TMS UI

Frontend repository for the Travel Management System web application.

## Repository Intent

This repository is prepared as a production-grade UI baseline before application code lands. It includes:

- environment separation for local, dev, stage, and prod
- pull-request based promotion through `dev`, `stage`, and `prod`
- baseline CI validation and CodeRabbit review config
- documentation for architecture, release flow, and environment expectations

## Recommended Frontend Baseline

- Node.js 20 LTS
- TypeScript
- Next.js or React-based SSR-capable application shell
- component-driven design system
- API integration through typed clients
- observability, error tracking, and E2E validation

## Branching Model

1. Feature branches merge into `dev`
2. `dev` is promoted into `stage`
3. `stage` is promoted into `prod`

Do not merge feature work directly into `stage` or `prod`.

## Initial Structure

- `src/` application code
- `public/` static assets
- `styles/` global styling primitives
- `tests/` automated test assets
- `docs/` architecture and operational standards
- `.github/` CI and pull request governance

## Next Build Step

Scaffold the chosen frontend framework, implement authentication and layout foundations, and enforce required status checks in GitHub.
