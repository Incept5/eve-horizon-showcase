import { capabilities } from '../data/capabilities'

function generateLlmsTxt(): string {
  const lines: string[] = [
    '# Eve Horizon',
    '',
    '> A job-first platform where AI agents are first-class citizens.',
    '> Agents authenticate, create work, deploy code, coordinate teams, and respond to chat — all through a single CLI.',
    '',
    '## Core Principle',
    '',
    'Anything a human can do through the CLI, an agent can do too. Same commands. Same auth. Same API. No separate "agent API" — agents are users.',
    '',
    '## Architecture',
    '',
    'User/Agent → CLI → API Gateway → Orchestrator → Worker → Runner Pod → Agent Harness',
    'API stores state in Postgres. Event Spine routes triggers. Chat Gateway normalizes Slack + Nostr messages.',
    '',
    '## Quick Start',
    '',
    '```bash',
    'npm install -g @eve-horizon/cli',
    'eve skills install https://github.com/incept5/eve-skillpacks',
    'skill read eve-bootstrap',
    '```',
    '',
    'The bootstrap skill checks auth status and handles both new and existing users:',
    '- Already authenticated → skips to project setup',
    '- Not authenticated → creates profile, submits access request, waits for admin approval, auto-logs in',
    'Admin approves with: eve admin access-requests approve <id>',
    '',
    '## Manifest (.eve/manifest.yaml)',
    '',
    'The manifest is the single source of truth. Schema: eve/compose/v1.',
    'Top-level fields: schema, project, registry, services, environments, pipelines, workflows, x-eve.',
    '',
    '### Services (Compose-Style)',
    'Fields: image, build (context, dockerfile), environment, ports, depends_on, healthcheck, volumes.',
    'Eve extensions (x-eve): ingress, role (component|worker|job), api_spec, external, worker_type.',
    '',
    '### Environments',
    'Link to pipelines via pipeline: key. Support overrides and approval gates.',
    'Deploy triggers pipeline: eve env deploy staging --ref main. Use --direct to bypass.',
    '',
    '### Pipelines',
    'Ordered steps: action (build/release/deploy/run/job/create-pr), script, or agent.',
    'Triggers: github (push/PR with branch wildcards), cron, manual.',
    '',
    '### Workflows',
    'On-demand jobs with JSON input/output. Defined under workflows: key.',
    '',
    '## Secret Interpolation',
    '',
    '${secret.KEY} in environment values. Scopes: project → user → org → system.',
    'Runtime vars: ${ENV_NAME}, ${PROJECT_ID}, ${ORG_ID}, ${ORG_SLUG}, ${COMPONENT_NAME}.',
    '',
    '## x-eve Extensions',
    '',
    '### Defaults (x-eve.defaults)',
    'env, harness, harness_profile, harness_options, hints, git, workspace.',
    '',
    '### Agent Profiles (x-eve.agents)',
    'Named harness+model combos with fallback ordering. version: 1, availability, profiles.',
    'Harnesses: mclaude/claude, zai, gemini, codex/code.',
    '',
    '### AgentPacks (x-eve.packs)',
    'Bundle agent config, teams, chat routing, and skills. Local or remote sources.',
    'x-eve.install_agents: [claude-code, codex, gemini-cli]. Lock: .eve/packs.lock.yaml.',
    '',
    '### Git Controls (x-eve.defaults.git)',
    'ref_policy: auto|env|project_default|explicit.',
    'branch: job/${job_id}, create_branch: if_missing, commit: manual, push: never.',
    '',
    '## IDs',
    '',
    'Org: org_xxx, Project: proj_xxx, Job root: {slug}-{hash8}, Job child: {parent}.{n}.',
    'Pipeline run: prun_xxx, Build: bld_xxx, Build run: brun_xxx.',
    '',
    '## Job Lifecycle',
    '',
    'Phases: idea → backlog → ready → active → review → done (or cancelled).',
    'Priority: 0-4 (P0 highest). Dependencies via waits_for/blocks.',
    'Git controls per job: ref, branch, commit, push policies.',
    '',
    '## Agent Harnesses',
    '',
    'mclaude/claude (Anthropic), zai (Z.ai), gemini (Google), codex/code (OpenAI).',
    'Credential priority: API keys > OAuth tokens. Sandbox per workspace.',
    '',
    '## Build System',
    '',
    'BuildSpec → BuildRun → Artifacts (image digests). Backends: BuildKit, Buildx, Kaniko.',
    'Registry auth via GHCR_USERNAME + GHCR_TOKEN secrets.',
    '',
    '## Event Spine',
    '',
    'Sources: github, slack, cron, manual, app, system, runner.',
    'Runner events: started → progress → completed/failed.',
    'Trigger routing: orchestrator matches events to manifest triggers.',
    '',
    '## Chat Gateway',
    '',
    'Slack (webhook) + Nostr (relay subscription). Agent slug routing.',
    '@eve <agent-slug> <message>. Thread continuity across messages.',
    '',
    '## Identity Providers',
    '',
    'SSH (github_ssh): challenge-response via ssh-keygen.',
    'Nostr: kind-22242 challenge + NIP-98 per-request auth.',
    'Token TTL: 1-90 days. Invite-gated provisioning.',
    '',
    '## Skills System',
    '',
    'SKILL.md: YAML frontmatter + markdown instructions + references/, scripts/, assets/.',
    'Install: skills.txt → .eve/hooks/on-clone.sh → .agent/skills/ → .claude/skills/.',
    '',
    '## Observability',
    '',
    'Job: follow (stream), diagnose (timeline+recommendations), attempts (timing), result.',
    'System: health, status, logs (api/orchestrator/worker), pods, events.',
    'Environment: diagnose, logs, services. Build: diagnose (spec+runs+artifacts+logs).',
    '',
  ]

  lines.push('## Capability Reference', '')
  for (const cap of capabilities) {
    lines.push(`### ${cap.title}`, '')
    lines.push(cap.summary, '')
    for (const d of cap.details) {
      lines.push(`- ${d}`)
    }
    lines.push('')
    if (cap.commands.length > 0) {
      lines.push('Commands:')
      for (const c of cap.commands) {
        lines.push(`  ${c.cmd} — ${c.desc}`)
      }
      lines.push('')
    }
  }

  lines.push(
    '## Links',
    '',
    '- Showcase: https://web.incept5-evshow-staging.eh1.incept5.dev',
    '- GitHub: https://github.com/incept5/eve-horizon-showcase',
    '- Incept5: https://github.com/incept5',
    '',
  )

  return lines.join('\n')
}

export function LlmsTxt() {
  const content = generateLlmsTxt()

  return (
    <div className="min-h-screen">
      <header className="border-b border-(--color-border) bg-(--color-surface-2)">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-(--color-text-2) hover:text-(--color-accent) transition-colors mb-4"
          >
            <span>&larr;</span> Home
          </a>
          <h1 className="text-3xl font-bold text-(--color-text)">llms.txt</h1>
          <p className="text-(--color-text-2) mt-1">
            LLM-friendly reference for the Eve Horizon platform
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="/llms.txt"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-accent) text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Raw llms.txt
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(content)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) text-sm text-(--color-text-2) hover:text-(--color-accent) hover:border-(--color-accent) transition-colors"
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) overflow-hidden">
          <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
            <code className="text-(--color-text-2) font-mono whitespace-pre-wrap">{content}</code>
          </pre>
        </div>
      </main>
    </div>
  )
}
