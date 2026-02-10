# Eve Horizon Showcase

Interactive showcase for the [Eve Horizon](https://web.incept5-evshow-staging.eh1.incept5.dev) agent platform — a job-first cloud platform where AI agents are first-class citizens.

Built with React, TypeScript, Tailwind CSS, and deployed via the Eve platform itself.

## What is this?

A single-page application that serves as both a product demo and documentation hub for the Eve Horizon platform. It covers 16 capability areas including architecture, manifest spec, AgentPacks, harnesses, job lifecycle, orchestration, builds, observability, and more.

Each capability has an interactive detail page with Mermaid diagrams, CLI command references, and manifest examples.

The app also serves an `/llms` route with a structured reference document for LLM consumption, alongside a static `/llms.txt`.

## Live

**Staging:** https://web.incept5-evshow-staging.eh1.incept5.dev

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Mermaid diagrams (via `beautiful-mermaid`)
- Docker multi-stage build (Node 22 → Nginx Alpine)
- Eve Horizon platform for deployment

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deploy

Deployed to Eve Horizon staging via the Eve CLI:

```bash
eve profile use staging
eve env deploy staging --ref main --repo-dir .
```

The `.eve/manifest.yaml` defines the build → release → deploy pipeline targeting `ghcr.io/incept5/eve-horizon-showcase`.

## Project structure

```
src/
  pages/
    Home.tsx          # Hero, stats, getting started, capability grid
    Detail.tsx        # Per-capability deep dive with diagrams
    LlmsTxt.tsx       # LLM-friendly platform reference
  components/
    CapabilityCard.tsx
    Diagram.tsx       # Mermaid renderer with fullscreen
    ThemeToggle.tsx   # Light/dark mode
  data/
    capabilities.ts   # All 16 capability definitions
  hooks/
    useTheme.ts
    useMermaid.ts
public/
  llms.txt            # Static LLM reference
.eve/
  manifest.yaml       # Eve build/deploy config
```
