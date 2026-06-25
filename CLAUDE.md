# Eve Horizon Showcase

Interactive showcase SPA for the Eve Horizon agent platform. React 19 + TypeScript + Tailwind CSS 4 + Vite. Dockerized with Nginx for production serving.

## Live URL

https://showcase.eve.example.com

## Architecture

Single-page app with three routes:
- `/` — Home (hero, stats, getting started guide, capability grid)
- `/:id` — Capability detail page (diagram, how it works, CLI commands, manifest examples)
- `/llms` — LLM-friendly markdown reference generated from capabilities data

All capability content lives in `src/data/capabilities.ts` — single source of truth for titles, diagrams, details, commands, and manifest examples. Pages render from this data.

Theme toggle (light/dark) persists to localStorage. Mermaid diagrams render via `beautiful-mermaid` with fullscreen expand.

## Eve Project (Staging)

- **Project ID:** proj_example (placeholder)
- **Org:** org_example
- **Slug:** evshow
- **Profile:** staging (api: https://api.eve.example.com)

## Secrets

Project secrets are stored in `env.secrets` (gitignored). Import them into Eve with:

```bash
eve secrets import --file env.secrets --project proj_example
```

## Deploy

```bash
eve profile use staging
eve env deploy staging --ref main --repo-dir .
```

Pipeline defined in `.eve/manifest.yaml`: build → release → deploy to `ghcr.io/eve-horizon/eve-horizon-showcase`.

## Development

```bash
npm install
npm run dev
```
