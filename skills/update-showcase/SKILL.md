---
name: update-showcase
description: Sync the Eve Horizon showcase with the current state of the platform by diffing against the eve-horizon repo git log, then adding, updating, reordering, or removing capability cards as needed.
---

# Update Showcase

You are updating the Eve Horizon showcase SPA to reflect the current state of the Eve Horizon platform. The showcase lives in this repo; the platform lives at `../eve-horizon`.

## Philosophy

The showcase is a curated, high-quality window into the platform — not a 1:1 mirror. Every card should earn its place. When the platform evolves, cards may need to be added, rewritten, merged, split, reordered, or removed. Always step back and assess the whole before touching the parts.

## Workflow

### 1. Gather platform reality

Read the eve-horizon git log for recent feature and doc commits:

```bash
git -C ../eve-horizon log --oneline --since="<last-update-date>" --no-merges | grep -iE "feat:|docs:"
```

If the scope is unclear, go deeper — read plan docs in `../eve-horizon/docs/plans/` for any feature that looks significant. Use subagents for parallel research when there are multiple features to investigate.

### 2. Inventory current showcase

Read `src/data/capabilities.ts` and build a mental map:
- What capabilities exist (id, title, summary)?
- What's the current ordering logic?
- Are any cards stale, overlapping, or missing context from recent platform changes?

### 3. Decide what changes are needed

This is the critical thinking step. For each platform feature found in step 1, decide:

- **New card** — feature is genuinely distinct and substantial enough to warrant its own card
- **Update existing card** — feature extends or changes something already showcased
- **Merge cards** — two cards now cover overlapping ground and should be combined
- **Split card** — a card has grown too broad and should become two focused cards
- **Remove card** — a feature was removed or deprecated upstream
- **Reorder** — the current sequence doesn't tell the best story anymore

Think about the ordering. Cards should flow logically:
1. Getting started / onboarding
2. Architecture / core concepts
3. Configuration (manifest, git controls)
4. Agent-centric features (packs, harnesses, models, orchestration, gateway)
5. Infrastructure (pipelines, builds, registry, managed DB)
6. Runtime (jobs, events, chat, identity, secrets, skills)
7. Operations (observability, resource management)

### 4. Implement changes

All capability content lives in `src/data/capabilities.ts`. The `Capability` interface:

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

If you need a new color, add it to both `colorMap` and `iconColorMap` in CapabilityCard.tsx.

**Diagrams**: Use mermaid graph TD, graph LR, or stateDiagram-v2. Use `\\n` for line breaks inside node labels. Escape `${...}` as `\${...}` in template literals.

**Writing quality**:
- Summaries should be punchy and concrete — what does it do, why does it matter
- Details should be technical and precise — assume the reader is an engineer
- Commands should be real `eve` CLI commands with accurate flags
- Manifest examples should be valid YAML that could actually go in `.eve/manifest.yaml`

### 5. Update supporting files

After changing capabilities.ts:

1. **Home page stats** — update the capability count in `src/pages/Home.tsx` (search for `Capability Areas`)
2. **Static llms.txt** — update `public/llms.txt` with new/changed sections and CLI commands in the quick reference
3. **LlmsTxt page** — `src/pages/LlmsTxt.tsx` auto-generates from capabilities data, no manual update needed

### 6. Verify

Run the production build — it must pass with zero errors:

```bash
npm run build
```

Common issues:
- Unescaped `${...}` in template literals — use `\${...}`
- `\\${...}` in diagrams evaluates as template expression — use `\${...}` instead
- Missing colors in CapabilityCard.tsx colorMap/iconColorMap

### 7. Deploy (if requested)

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
| `public/llms.txt` | Static LLM-friendly reference (must be manually updated) |
| `../eve-horizon/docs/plans/` | Platform feature plans for deep research |

## Anti-patterns

- Don't add a card for every commit — only substantial, user-facing platform capabilities
- Don't copy plan documents verbatim — distill into showcase-quality content
- Don't leave stale stats — always update the count on Home.tsx
- Don't forget llms.txt — it's the machine-readable contract and must stay in sync
- Don't skip the build check — TypeScript catches template literal escaping bugs
