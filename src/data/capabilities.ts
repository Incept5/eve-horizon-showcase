export interface Capability {
  id: string
  title: string
  subtitle: string
  icon: string
  color: string
  diagram: string
  summary: string
  details: string[]
  commands: { cmd: string; desc: string }[]
}

export const capabilities: Capability[] = [
  {
    id: 'architecture',
    title: 'Platform Architecture',
    subtitle: 'How agents connect',
    icon: '{}',
    color: 'blue',
    diagram: `graph TD
    subgraph Interfaces
      CLI[Eve CLI]
      Slack[Slack]
      Nostr[Nostr]
      GitHub[GitHub Webhooks]
    end
    subgraph Platform
      API[API Gateway]
      GW[Chat Gateway]
      ORCH[Orchestrator]
      WORKER[Worker]
      DB[(Postgres)]
      EVENTS[Event Spine]
    end
    subgraph Execution
      RUNNER[Runner Pod]
      REPO[Git Repo]
      SKILLS[Skills]
      HARNESS[Agent Harness]
    end
    CLI --> API
    Slack --> GW
    Nostr --> GW
    GitHub --> API
    GW --> API
    API --> DB
    API --> ORCH
    API --> EVENTS
    ORCH --> EVENTS
    ORCH --> WORKER
    WORKER --> RUNNER
    RUNNER --> REPO
    RUNNER --> SKILLS
    RUNNER --> HARNESS`,
    summary:
      'Agents interact exclusively through the Eve CLI. The API is the single source of truth. Every job runs in an isolated runner pod with its own git clone, skills, and harness.',
    details: [
      'CLI-first: humans and agents use the same interface — no separate "agent API"',
      'API Gateway handles auth, state, routing to orchestrator and worker services',
      'Chat Gateway normalizes Slack and Nostr messages into platform events',
      'Event Spine in Postgres provides observable trigger routing',
      'Each job runs in an isolated Kubernetes pod with full git clone',
      'Skills are installed from repo-local sources at clone time',
      'Five agent harnesses: Claude, Z.ai, Gemini, Code, Codex',
    ],
    commands: [
      { cmd: 'eve system health', desc: 'Check platform health' },
      { cmd: 'eve system status', desc: 'Full system overview' },
      { cmd: 'eve profile create staging --api-url ...', desc: 'Configure API target' },
    ],
  },
  {
    id: 'jobs',
    title: 'Job Lifecycle',
    subtitle: 'The unit of all work',
    icon: 'J',
    color: 'green',
    diagram: `stateDiagram-v2
    [*] --> idea
    idea --> backlog
    backlog --> ready
    ready --> active : Claimed
    active --> review : Submitted
    review --> done : Approved
    review --> active : Rejected
    active --> done : Complete
    active --> cancelled : Cancelled
    done --> [*]
    cancelled --> [*]`,
    summary:
      'Everything in Eve is a job — agent tasks, builds, deploys, chat responses. Jobs have a phase-based lifecycle with optional human-in-the-loop review gates.',
    details: [
      'Phases: idea → backlog → ready → active → review → done/cancelled',
      'Hierarchical IDs: root jobs get {slug}-{hash}, children get {parent}.{n}',
      'Priority levels 0-4 (P0=critical, P4=backlog) control scheduling order',
      'Sub-jobs with parent/child relationships for work decomposition',
      'Dependencies via waits_for and blocks relations',
      'Control signals: agents emit json-result with waiting/success/failed status',
      'Review gates: optional submit → approve/reject cycle for human oversight',
    ],
    commands: [
      { cmd: 'eve job create --description "..."', desc: 'Create new work' },
      { cmd: 'eve job follow <id>', desc: 'Stream logs in real-time' },
      { cmd: 'eve job diagnose <id>', desc: 'Diagnostics with recommendations' },
      { cmd: 'eve job submit <id> --summary "..."', desc: 'Submit for review' },
      { cmd: 'eve job result <id>', desc: 'Get structured results' },
      { cmd: 'eve job dep add <a> <b>', desc: 'Wire dependencies' },
    ],
  },
  {
    id: 'orchestration',
    title: 'Multi-Agent Orchestration',
    subtitle: 'Agents coordinating agents',
    icon: 'O',
    color: 'purple',
    diagram: `graph TD
    LEAD[Lead Agent]
    LEAD -->|spawns| A[Sub-Agent A]
    LEAD -->|spawns| B[Sub-Agent B]
    LEAD -->|spawns| C[Sub-Agent C]
    A -->|waits_for| LEAD
    B -->|waits_for| LEAD
    C -->|waits_for| LEAD
    COORD([Coordination Thread])
    A -.->|status| COORD
    B -.->|status| COORD
    C -.->|status| COORD
    COORD -.->|inbox| LEAD`,
    summary:
      'A lead agent decomposes work into parallel sub-jobs, waits on results, and synthesizes. Coordination threads give real-time visibility into sibling progress.',
    details: [
      'Depth propagation: parent sets target depth, children honor it',
      'Parallel decomposition: independent work runs simultaneously',
      'Coordination threads: automatic per-dispatch communication channel',
      'End-of-attempt relay: child summaries posted to coordination thread',
      'Coordination inbox: .eve/coordination-inbox.md written to workspace',
      'Supervision stream: lead can long-poll child events in real-time',
      'Team dispatch modes: fanout (parallel), with council/relay planned',
    ],
    commands: [
      { cmd: 'eve job create --parent $JOB_ID', desc: 'Spawn sub-agent work' },
      { cmd: 'eve supervise <id> --timeout 60', desc: 'Long-poll child events' },
      { cmd: 'eve thread messages <id> --since 5m', desc: 'Read coordination inbox' },
      { cmd: 'eve thread post <id> --body \'{"kind":"directive",...}\'', desc: 'Send directive to children' },
      { cmd: 'eve thread follow <id>', desc: 'Stream thread in real-time' },
    ],
  },
  {
    id: 'pipelines',
    title: 'Build → Release → Deploy',
    subtitle: 'Deterministic CI/CD',
    icon: 'P',
    color: 'orange',
    diagram: `graph LR
    BUILD[Build] --> RELEASE[Release] --> DEPLOY[Deploy] --> VERIFY[Verify]`,
    summary:
      'Pipelines are manifest-defined sequences that expand into job graphs. Steps can be actions (build, release, deploy), scripts, or agent jobs. One command deploys.',
    details: [
      'Defined in .eve/manifest.yaml — deterministic and version-controlled',
      'Steps: action (build/release/deploy/run), script, or agent',
      'Build tracking: BuildSpec + BuildRun records with image digest artifacts',
      'Promotion: build once in test, promote same artifacts to staging/production',
      'Environment pipelines: eve env deploy triggers the configured pipeline',
      'Workflow invocation: on-demand jobs with JSON input/output',
      'Pipeline triggers: GitHub webhooks, Slack events, cron, manual',
    ],
    commands: [
      { cmd: 'eve env deploy staging --ref main', desc: 'Deploy to environment' },
      { cmd: 'eve pipeline run deploy --ref <sha>', desc: 'Trigger pipeline directly' },
      { cmd: 'eve build diagnose <id>', desc: 'Debug build failures' },
      { cmd: 'eve workflow run qa --input \'{"task":"audit"}\'', desc: 'Invoke workflow' },
      { cmd: 'eve env diagnose proj staging', desc: 'Environment health check' },
    ],
  },
  {
    id: 'chat',
    title: 'Chat → Agent → Reply',
    subtitle: 'Multi-channel conversations',
    icon: 'C',
    color: 'cyan',
    diagram: `graph LR
    subgraph Sources
      S1[Slack]
      S2[Nostr DM]
    end
    subgraph Gateway
      NORM[Normalize]
      ROUTE[Route]
    end
    subgraph Work
      THREAD[Thread Context]
      JOB[Agent Job]
      REPLY[Reply]
    end
    S1 --> NORM
    S2 --> NORM
    NORM --> ROUTE
    ROUTE --> THREAD
    THREAD --> JOB
    JOB --> REPLY
    REPLY -.-> S1
    REPLY -.-> S2`,
    summary:
      'Messages from Slack and Nostr are normalized by the Chat Gateway, routed to the right agent, and executed as jobs. Thread context preserves full conversation history across turns.',
    details: [
      'Gateway plugin architecture: providers register as factories with transport type',
      'Slack: webhook transport with signature verification and URL challenge',
      'Nostr: subscription transport via relay pools (NIP-04 DMs + Kind 1 mentions)',
      'Agent slug routing: @eve <agent-slug> <message> in Slack',
      'Passive listeners: agents can watch channels without being mentioned',
      'Thread continuity: same thread_key → same thread_id across messages',
      'Thread context in job hints: prior messages with direction, actor, text, timestamp',
    ],
    commands: [
      { cmd: '@eve <agent> <message>', desc: 'Slack: invoke agent directly' },
      { cmd: '@eve agents listen <slug>', desc: 'Slack: passive channel listener' },
      { cmd: 'eve chat simulate --text "hello"', desc: 'Test routing without Slack' },
      { cmd: 'eve agents sync --project <id>', desc: 'Push agent config from repo' },
      { cmd: 'eve org update <id> --default-agent <slug>', desc: 'Set fallback agent' },
    ],
  },
  {
    id: 'identity',
    title: 'Pluggable Identity',
    subtitle: 'SSH, Nostr, and beyond',
    icon: 'ID',
    color: 'amber',
    diagram: `graph TD
    subgraph Providers
      SSH[SSH Keys]
      NOSTR_ID[Nostr Keypair]
    end
    subgraph AuthChain[Auth Chain]
      CHALLENGE[Challenge]
      VERIFY_SIG[Verify Signature]
      JWT_OUT[JWT Token]
    end
    subgraph Access
      API_ACCESS[API Access]
      REQ_AUTH[Per-Request Auth]
    end
    SSH --> CHALLENGE
    NOSTR_ID --> CHALLENGE
    CHALLENGE --> VERIFY_SIG
    VERIFY_SIG --> JWT_OUT
    JWT_OUT --> API_ACCESS
    NOSTR_ID -->|NIP-98| REQ_AUTH
    REQ_AUTH --> API_ACCESS`,
    summary:
      'Multiple identity providers through a pluggable framework. Agents and humans authenticate via challenge-response or per-request signatures. New providers plug in without changing the auth guard.',
    details: [
      'IdentityProvider interface: createChallenge, verifyChallenge, fingerprint',
      'SSH provider (github_ssh): challenge-response via ssh-keygen signatures',
      'Nostr provider: kind-22242 challenge-response + NIP-98 per-request auth',
      'Auth chain: Stage 1 (Bearer JWT) → Stage 2 (provider request auth)',
      'Invite-gated provisioning: admin creates invites with provider/identity hints',
      'Auto-provisioning: unregistered identities matched to invites get accounts',
      'Replay protection: NIP-98 events tracked with 120s TTL in replay table',
    ],
    commands: [
      { cmd: 'eve auth login', desc: 'SSH challenge-response login' },
      { cmd: 'eve auth status', desc: 'Check current auth state' },
      { cmd: 'Authorization: Nostr <base64>', desc: 'Per-request NIP-98 auth' },
      { cmd: 'POST /auth/invites', desc: 'Create identity-targeted invites' },
    ],
  },
  {
    id: 'secrets',
    title: 'Secret Isolation',
    subtitle: 'Agents get only what they need',
    icon: 'S',
    color: 'red',
    diagram: `graph LR
    subgraph Storage
      ORG[Org Secrets]
      PROJ[Project Secrets]
    end
    subgraph Worker
      ALLOWLIST[Env Allowlist]
      POLICY[Security Policy]
    end
    subgraph Agent
      ENV[Safe Env Vars]
      CLI_SEC[eve secrets]
    end
    ORG --> ALLOWLIST
    PROJ --> ALLOWLIST
    ALLOWLIST --> ENV
    POLICY --> ENV
    ENV --> CLI_SEC`,
    summary:
      'Secrets stored encrypted at org and project scope. The worker applies a strict env allowlist — only safe variables reach the agent. A security policy preamble is injected into every prompt.',
    details: [
      'Encrypted at rest: AES-256 encryption with per-org master keys',
      'Org + project scoping: secrets cascade from org to all projects',
      'Env allowlist: only safe variables forwarded to agent harness',
      'Security policy preamble: injected into every agent prompt automatically',
      'No master keys in execution: EVE_SECRETS_MASTER_KEY removed from runner env',
      'Manifest interpolation: ${secret.KEY} resolves at deploy time',
      'Dev secrets: .eve/dev-secrets.yaml for local development',
    ],
    commands: [
      { cmd: 'eve secrets set KEY "value"', desc: 'Store encrypted secret' },
      { cmd: 'eve secrets list --project <id>', desc: 'List project secrets' },
      { cmd: 'eve secrets ensure --keys K1,K2', desc: 'Verify required secrets' },
      { cmd: 'eve secrets import --file secrets.env', desc: 'Bulk import' },
    ],
  },
  {
    id: 'events',
    title: 'Event Spine',
    subtitle: 'One observable trigger log',
    icon: 'E',
    color: 'teal',
    diagram: `graph TD
    subgraph Sources
      GH[GitHub push]
      CRON[Cron tick]
      CHAT[Chat message]
      APP[App event]
      MANUAL[Manual emit]
    end
    subgraph Spine
      LOG[(Event Log)]
    end
    subgraph Reactions
      PIPE[Pipeline Run]
      WORK[Workflow Job]
      NOTIFY[Notification]
    end
    GH --> LOG
    CRON --> LOG
    CHAT --> LOG
    APP --> LOG
    MANUAL --> LOG
    LOG --> PIPE
    LOG --> WORK
    LOG --> NOTIFY`,
    summary:
      'Project-scoped event log in Postgres. GitHub pushes, cron ticks, chat messages, and manual emissions flow through it. The orchestrator matches events against manifest triggers.',
    details: [
      'Event sources: GitHub webhooks, Slack, cron, manual, app, system',
      'Typed events: github.push, cron.tick, system.job.failed, etc.',
      'Dedupe keys: idempotent event processing via dedupe_key field',
      'Trigger matching: orchestrator polls pending events every 5 seconds',
      'System failure events: system.job.failed, system.pipeline.failed with error taxonomy',
      'Full payload storage: event-specific JSON payload preserved for audit',
      'Actor attribution: user/system/app tracking on every event',
    ],
    commands: [
      { cmd: 'eve event emit --type github.push', desc: 'Emit event manually' },
      { cmd: 'eve event list --source github', desc: 'Query event log' },
      { cmd: 'eve event show <id>', desc: 'Inspect event details' },
    ],
  },
  {
    id: 'skills',
    title: 'Repo-Local Skills',
    subtitle: 'Knowledge that travels with code',
    icon: 'SK',
    color: 'indigo',
    diagram: `graph TD
    subgraph Repository
      TXT[skills.txt]
      PACKS[skillpacks/]
      HOOK[.eve/hooks/on-clone.sh]
    end
    subgraph Installed
      AGENT[.agent/skills/]
      CLAUDE[.claude/skills/]
    end
    subgraph Runtime
      HARNESS[Agent Harness]
      READ[skill read name]
    end
    TXT --> HOOK
    PACKS --> HOOK
    HOOK --> AGENT
    AGENT --> CLAUDE
    AGENT --> HARNESS
    HARNESS --> READ`,
    summary:
      'Skills are repo-local SKILL.md files that teach agents how to work with your codebase. Installed from skills.txt at clone time. No central registry — skills live with the code they describe.',
    details: [
      'SKILL.md format: metadata (name, description) + instructions + references',
      'Progressive disclosure: metadata always available, body loaded on invoke',
      'Bundled resources: references/, scripts/, assets/ directories',
      'Auto-install: .eve/hooks/on-clone.sh runs skills installer on clone',
      'Search priority: project → global, universal → Claude-specific',
      'Five harnesses supported: mclaude, zai, gemini, code, codex',
      'AgentPacks migration: eve migrate skills-to-packs for manifest-based packs',
    ],
    commands: [
      { cmd: 'skill read <name>', desc: 'Load skill instructions' },
      { cmd: './bin/eh skills install', desc: 'Install from skills.txt' },
      { cmd: 'eve packs status', desc: 'Check AgentPacks status' },
      { cmd: 'eve migrate skills-to-packs', desc: 'Migrate to manifest-based packs' },
    ],
  },
  {
    id: 'observability',
    title: 'Observability',
    subtitle: 'CLI-first, no kubectl needed',
    icon: 'OB',
    color: 'slate',
    diagram: `graph LR
    subgraph JobLevel[Job Level]
      FOLLOW[eve job follow]
      DIAG[eve job diagnose]
      LOGS[eve job logs]
    end
    subgraph SystemLevel[System Level]
      STATUS[eve system status]
      HEALTH[eve system health]
      SLOGS[eve system logs]
    end
    subgraph EnvLevel[Environment Level]
      ENVD[eve env diagnose]
      ENVL[eve env logs]
      BUILD[eve build diagnose]
    end`,
    summary:
      'Every capability is observable through the CLI. Job logs, system health, diagnostics, and environment status — all without touching kubectl or cloud consoles.',
    details: [
      'Job follow: real-time log streaming as the agent works',
      'Job diagnose: timeline, error summary, and actionable recommendations',
      'Job attempts: view all execution attempts with details',
      'System status: aggregate health across API, orchestrator, worker, DB',
      'System logs: stream component logs (api, orchestrator, worker)',
      'Build diagnose: full diagnostic dump (spec + runs + artifacts + logs)',
      'Environment diagnose: end-to-end health check for deployed environments',
    ],
    commands: [
      { cmd: 'eve job follow <id>', desc: 'Stream logs in real-time' },
      { cmd: 'eve job diagnose <id>', desc: 'Full diagnostic with recommendations' },
      { cmd: 'eve system status', desc: 'Platform-wide health overview' },
      { cmd: 'eve system logs api --tail 50', desc: 'Stream component logs' },
      { cmd: 'eve env diagnose <proj> <env>', desc: 'Environment health check' },
      { cmd: 'eve build diagnose <id>', desc: 'Debug build failures' },
    ],
  },
]
