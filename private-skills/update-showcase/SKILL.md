---
name: update-showcase
description: Sync the Eve Horizon showcase with the current state of the platform by diffing against the eve-horizon repo git log, then adding, updating, reordering, or removing capability cards as needed.
---

# Update Showcase

Sync the Eve Horizon showcase SPA with the current state of the Eve Horizon platform. The showcase lives in this repo; the platform lives at `../eve-horizon`.

## Philosophy

Treat the showcase as a curated, high-quality window into the platform — not a 1:1 mirror. Every card must earn its place. When the platform evolves, add, rewrite, merge, split, reorder, or remove cards as needed. Step back and assess the whole before touching the parts.

## Workflow

### 1. Gather platform reality

Pull the eve-horizon git log for recent feature and doc commits:

```bash
git -C ../eve-horizon log --oneline --since="<last-update-date>" --no-merges | grep -iE "feat:|docs:"
```

If the scope is unclear, go deeper — read plan docs in `../eve-horizon/docs/plans/` for any feature that looks significant.

### 2. Inventory current showcase

Read `src/data/capabilities.ts` and build a mental map:
- Which capabilities exist (id, title, summary)?
- What ordering logic is in place?
- Which cards are stale, overlapping, or missing context from recent platform changes?

### 3. Decide what changes are needed

This is the critical thinking step. For each platform feature found in step 1, decide:

- **New card** — feature is genuinely distinct and substantial enough to warrant its own card
- **Update existing card** — feature extends or changes something already showcased
- **Merge cards** — two cards now cover overlapping ground; combine them
- **Split card** — a card has grown too broad; break it into two focused cards
- **Remove card** — feature was removed or deprecated upstream
- **Reorder** — the current sequence no longer tells the best story

Order cards to flow logically:
1. Getting started / onboarding
2. Architecture / core concepts
3. Configuration (manifest, git controls)
4. Agent-centric features (packs, harnesses, models, orchestration, gateway)
5. Infrastructure (pipelines, builds, registry, managed DB)
6. Runtime (jobs, events, chat, identity, secrets, skills)
7. Operations (observability, resource management)

### 4. Create tracked work items

Create a work item for each change identified in step 3. Group them:

- **Research items** (one per feature needing deep investigation) — spawn these as parallel workers, each reading the relevant plan doc in `../eve-horizon/docs/plans/` and returning a distilled summary: what it does, key concepts, CLI commands, manifest shape.
- **Card authoring items** (one per card to create/update/merge/split/remove) — these depend on their corresponding research items. Author sequentially since all cards live in one file.
- **Supporting file items** (Home.tsx stats, llms.txt update, build verify) — these depend on all card authoring completing. Run in parallel where independent.

For single-card updates, skip the orchestration overhead and work directly.

### 5. Research (parallel)

For each research work item, spawn a parallel worker with a self-contained prompt:
- The target feature name and relevant plan doc path
- What to extract: summary, technical details, CLI commands, manifest examples, diagram concepts
- Return format: structured notes ready to author a card from

Collect all research results before proceeding to card authoring.

### 6. Author cards

Edit capability content in `src/data/capabilities.ts`. The `Capability` interface:

```typescript
interface Capability {
  id: string          // URL slug
  title: string       // Card title
  subtitle: string    // One-liner under title
  icon: string        // 1-3 char icon text
  color: string       // Tailwind color name
  diagram: string     // Mermaid diagram (template literal, use \\n for newlines)
  summary: string     // 1-2 sentence overview
  details: string[]   // 6-8 bullet points
  commands: { cmd: string; desc: string }[]  // CLI commands
  manifestExample?: string  // Optional YAML snippet
}
```

**Colors** available in `src/components/CapabilityCard.tsx`:
blue, green, purple, orange, cyan, amber, red, teal, indigo, slate, violet, pink, emerald, lime, sky, rose, fuchsia, yellow, stone, zinc.

To add a new color, update both `colorMap` and `iconColorMap` in CapabilityCard.tsx.

**Diagrams**: Use mermaid graph TD, graph LR, or stateDiagram-v2. Use `\\n` for line breaks inside node labels. Escape `${...}` as `\${...}` in template literals.

**Writing quality**:
- Make summaries punchy and concrete — what does it do, why does it matter
- Keep details technical and precise — assume the reader is an engineer
- Use real `eve` CLI commands with accurate flags
- Write valid YAML that could actually go in `.eve/manifest.yaml`

### 7. Update supporting files

After completing all card changes, update these in parallel:

1. **Home page stats** — update the capability count in `src/pages/Home.tsx` (search for `Capability Areas`)
2. **Static llms.txt** — update `public/llms.txt` with new/changed sections and CLI commands in the quick reference
3. **LlmsTxt page** — `src/pages/LlmsTxt.tsx` auto-generates from capabilities data; no manual update needed

### 8. Verify

Run the production build — it must pass with zero errors:

```bash
npm run build
```

Common issues:
- Unescaped `${...}` in template literals — use `\${...}`
- `\\${...}` in diagrams evaluates as template expression — use `\${...}` instead
- Missing colors in CapabilityCard.tsx colorMap/iconColorMap

### 9. Deploy (if requested)

```bash
git add <changed files>
git commit -m "feat: <describe changes>"
git push origin main
eve profile use staging
eve project sync --repo-dir .
eve env deploy staging --ref main --repo-dir .
```

## Key files

| File | Purpose |
|------|---------|
| `src/data/capabilities.ts` | All card content — single source of truth |
| `src/components/CapabilityCard.tsx` | Color maps for card styling |
| `src/pages/Home.tsx` | Landing page with stats grid |
| `src/pages/Detail.tsx` | Capability detail page (reads from capabilities data) |
| `src/pages/LlmsTxt.tsx` | Generated llms.txt page |
| `public/llms.txt` | Static LLM-friendly reference (update manually) |
| `../eve-horizon/docs/plans/` | Platform feature plans for deep research |

## Anti-patterns

- Adding a card for every commit — only showcase substantial, user-facing capabilities
- Copying plan documents verbatim — distill into showcase-quality content
- Leaving stale stats — always update the count on Home.tsx
- Forgetting llms.txt — it's the machine-readable contract and must stay in sync
- Skipping the build check — TypeScript catches template literal escaping bugs
- Serializing research — spawn parallel workers when investigating multiple features
