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
  manifestExample?: string
}

export const capabilities: Capability[] = [
  {
    id: 'onboarding',
    title: 'Self-Service Onboarding',
    subtitle: 'Zero to running in minutes',
    icon: 'GO',
    color: 'green',
    diagram: `graph TD
    subgraph Start["Install"]
      INSTALL["npm install -g @anthropic/eve-cli"]
      SKILLS["eve skills install ..."]
      BOOT["skill read eve-bootstrap"]
    end
    subgraph Bootstrap["Bootstrap Skill"]
      CHECK{"eve auth status"}
      PROFILE["Create profile"]
      REQ["Submit access request"]
      POLL["Poll for approval"]
      LOGIN["Auto-login"]
      PROJ["Create project + manifest"]
      LEARN["Read /llms reference"]
    end
    subgraph Admin
      LIST["eve admin access-requests"]
      APPROVE["approve <id>"]
    end
    INSTALL --> SKILLS
    SKILLS --> BOOT
    BOOT --> CHECK
    CHECK -->|"Not authenticated"| PROFILE
    CHECK -->|"Already authenticated"| PROJ
    PROFILE --> REQ
    REQ --> POLL
    LIST --> APPROVE
    APPROVE -.->|unblocks| POLL
    POLL --> LOGIN
    LOGIN --> PROJ
    PROJ --> LEARN`,
    summary:
      'One bootstrap skill handles everything — whether you\'re a new user or already onboarded. It checks auth status, requests access if needed (with admin approval gate), sets up your project, and points you to the platform reference. Works the same for humans driving Claude and for autonomous agents.',
    details: [
      'Auth-aware: bootstrap runs eve auth status first — if already authenticated, skips straight to project setup',
      'New users: skill creates a profile, submits access request with SSH pubkey, and polls until admin approves',
      'Admin gate: one eve admin access-requests approve <id> — no pre-provisioning, no auto-approve',
      'On approval: org created, user provisioned, identity registered, membership set to admin — all server-side',
      'Auto-login: --wait flag polls every 5s, then completes SSH challenge login automatically on approval',
      'Project setup: creates project, .eve/manifest.yaml, and profile defaults — same flow for new and existing users',
      'Two entry points: human starts Claude then asks for the skill, or agent runs eve skills install + skill read directly',
      'Platform learning: bootstrap points agents to the /llms route for full CLI, manifest, and capabilities reference',
    ],
    commands: [
      { cmd: 'eve skills install https://github.com/incept5/eve-skillpacks', desc: 'Install skills (creates skills.txt if needed)' },
      { cmd: 'skill read eve-bootstrap', desc: 'Load and follow the bootstrap skill' },
      { cmd: 'eve auth status', desc: 'Check if already authenticated' },
      { cmd: 'eve auth request-access --ssh-key ~/.ssh/id_ed25519.pub --org "My Co" --wait', desc: 'Request access and wait (new users)' },
      { cmd: 'eve admin access-requests', desc: 'List pending requests (admin)' },
      { cmd: 'eve admin access-requests approve areq_xxx', desc: 'Approve and provision (admin)' },
    ],
  },
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
      'Platform env vars injected: EVE_API_URL, EVE_PROJECT_ID, EVE_ORG_ID, EVE_ENV_NAME',
    ],
    commands: [
      { cmd: 'eve system health', desc: 'Check platform health' },
      { cmd: 'eve system status', desc: 'Full system overview' },
      { cmd: 'eve profile create staging --api-url https://api.eh1.incept5.dev', desc: 'Configure API target' },
      { cmd: 'eve profile set --org org_xxx --project proj_xxx', desc: 'Set default org and project' },
    ],
  },
  {
    id: 'manifest',
    title: 'Manifest Spec',
    subtitle: 'Single source of truth',
    icon: 'M',
    color: 'violet',
    diagram: `graph TD
    subgraph ManifestFile[".eve/manifest.yaml"]
      SCHEMA[schema: eve/compose/v1]
      REGISTRY[registry]
      SERVICES[services]
      ENVS[environments]
      PIPES[pipelines]
      WORKFLOWS[workflows]
      XEVE["x-eve extensions"]
    end
    subgraph Compose[Compose-Style Services]
      BUILD[build context]
      IMAGE[image refs]
      PORTS[ports]
      ENV_VARS[environment]
      HEALTH[healthcheck]
      DEPS[depends_on]
    end
    subgraph Extensions[Eve Extensions]
      INGRESS[ingress routing]
      ROLE[service roles]
      API_SPEC[api specs]
      DEFAULTS[job defaults]
      AGENTS[agent profiles]
      PACKS[agent packs]
      CHAT_CFG[chat config]
    end
    SERVICES --> Compose
    XEVE --> Extensions
    ENVS --> PIPES
    PIPES --> WORKFLOWS`,
    summary:
      'The manifest (.eve/manifest.yaml) is the single source of truth for builds, deploys, pipelines, workflows, agent configuration, and secrets. It uses a Compose-like schema with Eve extensions under x-eve.',
    details: [
      'Schema: eve/compose/v1 — Compose-like with Eve extensions under x-eve',
      'Services: image, build, environment, ports, depends_on, healthcheck, volumes',
      'Environments: link to pipelines, support overrides and approval gates',
      'Service roles: component (default), worker, or job (one-off migrations/seeds)',
      'Ingress: automatic URL generation from org/project slugs + domain',
      'Secret interpolation: ${secret.KEY} resolves at deploy time from encrypted store',
      'Runtime interpolation: ${ENV_NAME}, ${PROJECT_ID}, ${ORG_ID}, ${ORG_SLUG}, ${COMPONENT_NAME}',
      'Unknown fields allowed for forward compatibility',
    ],
    commands: [
      { cmd: 'eve project sync', desc: 'Sync manifest to platform' },
      { cmd: 'eve project sync --validate-secrets', desc: 'Validate required secrets' },
      { cmd: 'eve project sync --strict', desc: 'Strict validation mode' },
      { cmd: 'eve env deploy staging --ref main --repo-dir .', desc: 'Deploy via manifest pipeline' },
    ],
    manifestExample: `schema: eve/compose/v1
project: my-app

registry:
  host: ghcr.io
  namespace: myorg
  auth:
    username_secret: GHCR_USERNAME
    token_secret: GHCR_TOKEN

services:
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    image: ghcr.io/myorg/my-api
    ports: [3000]
    environment:
      NODE_ENV: production
      DATABASE_URL: \${secret.DB_PASSWORD}
    x-eve:
      ingress:
        public: true
        port: 3000
      api_spec:
        type: openapi
        spec_url: /openapi.json

environments:
  staging:
    pipeline: deploy
    pipeline_inputs:
      smoke_test: true
    overrides:
      services:
        api:
          environment:
            NODE_ENV: staging

pipelines:
  deploy:
    steps:
      - name: build
        action: { type: build }
      - name: release
        depends_on: [build]
        action: { type: release }
      - name: deploy
        depends_on: [release]
        action: { type: deploy }

x-eve:
  defaults:
    env: staging
    harness: mclaude
    harness_profile: primary-orchestrator
  requires:
    secrets: [GITHUB_TOKEN, DB_PASSWORD]`,
  },
  {
    id: 'agent-packs',
    title: 'AgentPacks',
    subtitle: 'Portable agent configurations',
    icon: 'AP',
    color: 'pink',
    diagram: `graph TD
    subgraph PackSources[Pack Sources]
      LOCAL["./skillpacks/my-pack"]
      REMOTE["github.com/org/packs"]
    end
    subgraph ManifestConfig[Manifest Config]
      XPACKS["x-eve.packs"]
      INSTALL["x-eve.install_agents"]
    end
    subgraph Resolution["eve agents sync"]
      RESOLVE[Resolve Packs]
      LOCK[".eve/packs.lock.yaml"]
    end
    subgraph Installed[Installed Artifacts]
      AGENTS_CFG["agents/agents.yaml"]
      TEAMS_CFG["agents/teams.yaml"]
      CHAT_CFG["agents/chat.yaml"]
      SKILL_FILES["SKILL.md files"]
    end
    subgraph Harnesses[Target Harnesses]
      CLAUDE[Claude Code]
      CODEX[Codex]
      GEMINI[Gemini CLI]
    end
    LOCAL --> XPACKS
    REMOTE --> XPACKS
    XPACKS --> RESOLVE
    INSTALL --> RESOLVE
    RESOLVE --> LOCK
    RESOLVE --> Installed
    Installed --> Harnesses`,
    summary:
      'AgentPacks bundle agent configurations, team definitions, chat routing, and skills into portable packages. They can be local directories or remote git repos, resolved at sync time and locked for reproducibility.',
    details: [
      'Pack sources: local directories (./skillpacks/my-pack) or remote git repos with SHA pinning',
      'Manifest config: x-eve.packs lists sources, x-eve.install_agents selects target harnesses',
      'Default harnesses: [claude-code] — override with [claude-code, codex, gemini-cli]',
      'Per-pack harness targeting: packs can specify install_agents to limit which harnesses get skills',
      'Lock file: .eve/packs.lock.yaml pins resolved versions for reproducible installs',
      'Agent config paths: x-eve.agents.config_path, teams_path, and chat.config_path',
      'Sync command: eve agents sync resolves packs and installs into workspace',
      'Migration: eve migrate skills-to-packs converts skills.txt to manifest-based packs',
    ],
    commands: [
      { cmd: 'eve agents sync --project proj_xxx --ref main --repo-dir .', desc: 'Sync agent/team/chat config from repo' },
      { cmd: 'eve agents config --project proj_xxx --json', desc: 'Inspect resolved agent config' },
      { cmd: 'eve packs status', desc: 'Check pack installation status' },
      { cmd: 'eve packs resolve --dry-run', desc: 'Preview pack resolution' },
      { cmd: 'eve migrate skills-to-packs', desc: 'Migrate from skills.txt to packs' },
    ],
    manifestExample: `x-eve:
  install_agents: [claude-code, codex, gemini-cli]
  packs:
    - source: ./skillpacks/my-pack
    - source: incept5/eve-skillpacks
      ref: 0123456789abcdef0123456789abcdef01234567
    - source: ./skillpacks/claude-only
      install_agents: [claude-code]
  agents:
    version: 1
    config_path: agents/agents.yaml
    teams_path: agents/teams.yaml
  chat:
    config_path: agents/chat.yaml`,
  },
  {
    id: 'harnesses',
    title: 'Agent Harnesses',
    subtitle: 'Multi-model execution',
    icon: 'H',
    color: 'emerald',
    diagram: `graph TD
    subgraph Profiles[Harness Profiles]
      P1["primary-orchestrator"]
      P2["primary-reviewer"]
      P3["fast-worker"]
    end
    subgraph Harnesses[Available Harnesses]
      MC["mclaude / claude"]
      ZAI["zai (Z.ai)"]
      GEM["gemini"]
      CDX["codex"]
      CODE["code"]
    end
    subgraph Options[Harness Options]
      MODEL["model: opus-4.5"]
      REASON["reasoning_effort: high"]
      VARIANT["variant: deep"]
    end
    subgraph Security[Sandbox & Auth]
      SANDBOX["Workspace Sandbox"]
      CREDS["Credential Resolution"]
      POLICY["Permission Policy"]
    end
    P1 --> MC
    P1 --> CDX
    P2 --> MC
    P3 --> GEM
    MC --> Options
    Options --> Security
    CREDS --> MC
    CREDS --> ZAI
    CREDS --> GEM
    CREDS --> CDX`,
    summary:
      'Five agent harnesses wrap different AI models. Harness profiles define fallback chains — if the primary model is unavailable, the next in the profile list is used. Each harness runs in a sandboxed workspace.',
    details: [
      'Harnesses: mclaude/claude (Anthropic), zai (Z.ai), gemini (Google), codex/code (OpenAI)',
      'Profiles: named lists of harness+model combos with fallback ordering',
      'Per-job selection: --harness mclaude --model opus-4.5 --reasoning high',
      'Profile selection: --profile primary-reviewer (from x-eve.agents.profiles)',
      'Availability: drop_unavailable: true skips harnesses without valid credentials',
      'Sandbox isolation: each harness gets workspace-scoped filesystem access only',
      'Credential priority: ANTHROPIC_API_KEY > OAuth tokens for Claude; similar chains per harness',
      'OAuth sync: eve auth sync pushes local Claude/Codex tokens to Eve for agent use',
    ],
    commands: [
      { cmd: 'eve job create --harness mclaude --model opus-4.5', desc: 'Create job with specific harness' },
      { cmd: 'eve job create --profile primary-reviewer', desc: 'Create job using profile' },
      { cmd: 'eve harness list --capabilities', desc: 'List available harnesses' },
      { cmd: 'eve auth creds', desc: 'Check local AI tool credentials' },
      { cmd: 'eve auth sync --project proj_xxx', desc: 'Sync OAuth tokens to Eve' },
    ],
    manifestExample: `x-eve:
  agents:
    version: 1
    availability:
      drop_unavailable: true
    profiles:
      primary-orchestrator:
        - harness: mclaude
          model: opus-4.5
          reasoning_effort: high
        - harness: codex
          model: gpt-5.2-codex
          reasoning_effort: x-high
      primary-reviewer:
        - harness: mclaude
          model: opus-4.5
          reasoning_effort: high
      fast-worker:
        - harness: gemini
          model: gemini-2.5-pro`,
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
      'Job context API: GET /jobs/:id/context returns blocked/waiting/effective_phase',
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
    id: 'git-controls',
    title: 'Git Controls',
    subtitle: 'Branch, commit, push policies',
    icon: 'G',
    color: 'lime',
    diagram: `graph TD
    subgraph JobConfig[Job Git Config]
      REF["ref: main"]
      BRANCH["branch: job/\${job_id}"]
      COMMIT["commit: auto|manual|never"]
      PUSH["push: on_success|never"]
    end
    subgraph RefPolicy[Ref Resolution]
      AUTO["auto: env release → defaults → project"]
      ENV_REF["env: use environment release"]
      EXPLICIT["explicit: use provided ref"]
    end
    subgraph Workspace[Workspace Mode]
      JOB_WS["job: fresh per job"]
      SESSION_WS["session: shared across session"]
      ISOLATED["isolated: fully isolated"]
    end
    subgraph Actions[Worker Actions]
      CLONE["git clone --ref"]
      CREATE_BR["create branch if missing"]
      GIT_ADD["git add -A (if auto)"]
      GIT_COMMIT["git commit"]
      GIT_PUSH["git push (if on_success)"]
    end
    JobConfig --> RefPolicy
    RefPolicy --> CLONE
    JobConfig --> CREATE_BR
    COMMIT --> GIT_ADD
    GIT_ADD --> GIT_COMMIT
    PUSH --> GIT_PUSH`,
    summary:
      'Job-level git controls govern how code is checked out, modified, and pushed. Ref policies determine which commit to start from. Branch, commit, and push policies control what happens with changes.',
    details: [
      'ref_policy: auto (env release → manifest defaults → project branch), env, project_default, or explicit',
      'Branch creation: never, if_missing, or always — with template support (job/${job_id})',
      'Commit policy: never (read-only), manual (agent decides), auto (git add -A + commit), required (fail if no commit)',
      'Push policy: never (local only), on_success (push if commits made), required (fail if no push)',
      'Commit message templates: job/${job_id}: ${summary}',
      'Workspace modes: job (fresh per job), session (shared), isolated',
      'Defaults from x-eve.defaults.git and x-eve.defaults.workspace in manifest',
      'Each attempt gets a fresh workspace today — workspace reuse is planned',
    ],
    commands: [
      { cmd: 'eve job create --description "Fix" --ref main', desc: 'Job with explicit ref' },
      { cmd: 'eve job create --description "Review" --branch job/review-1', desc: 'Job with custom branch' },
      { cmd: 'eve job show <id> --verbose', desc: 'See git config on a job' },
    ],
    manifestExample: `x-eve:
  defaults:
    git:
      ref_policy: auto
      branch: job/\${job_id}
      create_branch: if_missing
      commit: manual
      push: never
      remote: origin
    workspace:
      mode: job`,
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
    subgraph Trigger
      GH_PUSH[GitHub Push]
      MANUAL[Manual Deploy]
      CRON[Cron Schedule]
    end
    subgraph Pipeline
      BUILD[Build] --> RELEASE[Release] --> DEPLOY[Deploy]
    end
    subgraph Outputs
      SPEC[BuildSpec]
      RUN[BuildRun]
      DIGEST[Image Digests]
      REL[Release Record]
    end
    GH_PUSH --> BUILD
    MANUAL --> BUILD
    CRON --> BUILD
    BUILD --> SPEC
    BUILD --> RUN
    RUN --> DIGEST
    RELEASE --> REL
    DEPLOY -.-> |"Uses digest refs"| DIGEST`,
    summary:
      'Pipelines are manifest-defined sequences that expand into job graphs. Steps can be actions (build, release, deploy), scripts, or agent jobs. Builds produce tracked artifacts with image digests for deterministic deploys.',
    details: [
      'Defined in .eve/manifest.yaml — deterministic and version-controlled',
      'Step types: action (build/release/deploy/run/job/create-pr), script, or agent',
      'Build tracking: BuildSpec + BuildRun records with image digest artifacts',
      'Build backends: BuildKit (K8s production), Buildx (local), Kaniko (fallback)',
      'Promotion: build once in test, promote same artifacts to staging/production via release resolve',
      'Triggers: github (push/PR), cron, manual — with branch pattern wildcards',
      'Pipeline runs: prun_xxx IDs, --only <step> for partial runs',
      'Agent steps: prompt-driven AI jobs within the pipeline',
    ],
    commands: [
      { cmd: 'eve env deploy staging --ref main --repo-dir .', desc: 'Deploy via environment pipeline' },
      { cmd: 'eve pipeline run deploy --ref <sha> --env staging', desc: 'Trigger pipeline directly' },
      { cmd: 'eve pipeline approve <run-id>', desc: 'Approve gated pipeline' },
      { cmd: 'eve build diagnose <id>', desc: 'Debug build failures' },
      { cmd: 'eve build artifacts <id>', desc: 'List produced image digests' },
      { cmd: 'eve workflow run qa --input \'{"task":"audit"}\'', desc: 'Invoke workflow job' },
    ],
    manifestExample: `pipelines:
  deploy-test:
    trigger:
      github:
        event: push
        branch: main
    steps:
      - name: build
        action: { type: build }
      - name: unit-tests
        script: { run: "pnpm test", timeout: 1800 }
      - name: deploy
        depends_on: [build, unit-tests]
        action: { type: deploy }

workflows:
  nightly-audit:
    db_access: read_only
    steps:
      - agent:
          prompt: "Audit error logs and summarize anomalies"`,
  },
  {
    id: 'builds',
    title: 'Build System',
    subtitle: 'First-class image construction',
    icon: 'B',
    color: 'sky',
    diagram: `graph TD
    subgraph Input
      MANIFEST["Manifest"]
      SHA["Git SHA"]
      SECRETS["Registry Secrets"]
    end
    subgraph BuildSpec
      SPEC["BuildSpec Record"]
      SERVICES["Service List"]
      CONTEXT["Build Contexts"]
    end
    subgraph Execution
      BACKEND{"Build Backend"}
      BUILDKIT["BuildKit (K8s)"]
      BUILDX["Buildx (Local)"]
      KANIKO["Kaniko (Fallback)"]
    end
    subgraph Artifacts
      DIGEST["Image Digests"]
      REGISTRY["Container Registry"]
      LABELS["OCI Labels"]
    end
    MANIFEST --> SPEC
    SHA --> SPEC
    SPEC --> SERVICES
    SERVICES --> CONTEXT
    CONTEXT --> BACKEND
    BACKEND --> BUILDKIT
    BACKEND --> BUILDX
    BACKEND --> KANIKO
    BUILDKIT --> DIGEST
    BUILDX --> DIGEST
    SECRETS --> REGISTRY
    DIGEST --> REGISTRY
    LABELS --> REGISTRY`,
    summary:
      'Builds are first-class primitives that track image construction from input (spec) to execution (run) to output (artifacts). Three backends support different environments. Image digests ensure deterministic deploys.',
    details: [
      'BuildSpec: captures project, SHA, manifest hash, and service list at creation time',
      'BuildRun: execution record with status, backend selection, and timing data',
      'Backends: BuildKit (K8s production), Buildx (local docker), Kaniko (fallback)',
      'Artifacts: image digests (SHA256) stored per-service for release pinning',
      'OCI labels: org.opencontainers.image.source auto-injected for GHCR repo linking',
      'Registry auth: GHCR_USERNAME + GHCR_TOKEN secrets for push access',
      'Downstream: releases derive image refs from BuildArtifacts for digest-based deploys',
      'Diagnostics: eve build diagnose dumps spec + runs + artifacts + logs in one view',
    ],
    commands: [
      { cmd: 'eve build list --project <id>', desc: 'List recent builds' },
      { cmd: 'eve build show <build_id>', desc: 'Build spec details' },
      { cmd: 'eve build run <build_id>', desc: 'Start a build run' },
      { cmd: 'eve build logs <build_id>', desc: 'View build output' },
      { cmd: 'eve build artifacts <build_id>', desc: 'List image digests' },
      { cmd: 'eve build diagnose <build_id>', desc: 'Full diagnostic dump' },
      { cmd: 'eve build cancel <build_id>', desc: 'Cancel active build' },
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
      'Token TTL: configurable 1-90 days, capped by server EVE_AUTH_TOKEN_TTL_DAYS',
      'Token minting: eve auth mint for bot/service accounts without SSH login',
    ],
    commands: [
      { cmd: 'eve auth login --email you@example.com', desc: 'SSH challenge-response login' },
      { cmd: 'eve auth login --ttl 30', desc: 'Login with custom token TTL' },
      { cmd: 'eve auth status', desc: 'Check current auth state' },
      { cmd: 'eve auth mint --email bot@co.com --org org_xxx', desc: 'Mint bot token' },
      { cmd: 'POST /auth/invites', desc: 'Create identity-targeted invites' },
    ],
  },
  {
    id: 'secrets',
    title: 'Secret Isolation',
    subtitle: 'Agents get only what they need',
    icon: 'S',
    color: 'red',
    diagram: `graph TD
    subgraph Scopes["Scope Hierarchy (highest wins)"]
      SYS[System Secrets]
      ORG[Org Secrets]
      USER[User Secrets]
      PROJ[Project Secrets]
    end
    subgraph Resolution
      RESOLVE["Resolution: project → user → org → system"]
      ENCRYPT["AES-256 Encrypted at Rest"]
    end
    subgraph Worker
      ALLOWLIST[Env Allowlist]
      POLICY[Security Policy]
    end
    subgraph Agent
      ENV[Safe Env Vars]
      CLI_SEC[eve secrets]
    end
    PROJ --> RESOLVE
    USER --> RESOLVE
    ORG --> RESOLVE
    SYS --> RESOLVE
    RESOLVE --> ENCRYPT
    ENCRYPT --> ALLOWLIST
    ALLOWLIST --> ENV
    POLICY --> ENV
    ENV --> CLI_SEC`,
    summary:
      'Secrets stored encrypted at four scope levels with project winning over org. The worker applies a strict env allowlist — only safe variables reach the agent. Secret interpolation in manifests resolves at deploy time.',
    details: [
      'Scope priority: project → user → org → system (highest scope wins)',
      'Encrypted at rest: AES-256 encryption with EVE_SECRETS_MASTER_KEY',
      'Env allowlist: only safe variables forwarded to agent harness',
      'Security policy preamble: injected into every agent prompt automatically',
      'No master keys in execution: EVE_SECRETS_MASTER_KEY removed from runner env',
      'Manifest interpolation: ${secret.KEY} resolves at deploy time',
      'Manifest requirements: x-eve.requires.secrets declares needed keys',
      'Dev secrets: .eve/dev-secrets.yaml for local development (gitignored)',
    ],
    commands: [
      { cmd: 'eve secrets set KEY "value" --project proj_xxx', desc: 'Store encrypted secret' },
      { cmd: 'eve secrets list --project <id>', desc: 'List project secrets (keys only)' },
      { cmd: 'eve secrets ensure --keys K1,K2', desc: 'Verify required secrets exist' },
      { cmd: 'eve secrets validate --project proj_xxx', desc: 'Validate against manifest' },
      { cmd: 'eve secrets import --file secrets.env', desc: 'Bulk import from env file' },
      { cmd: 'eve secrets export --keys K1 --project proj_xxx', desc: 'Export specific keys' },
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
      GH[GitHub push/PR]
      CRON[Cron tick]
      CHAT[Chat message]
      APP[App event]
      MANUAL[Manual emit]
      SYSTEM[System events]
      RUNNER[Runner events]
    end
    subgraph Spine
      LOG[(Event Log)]
      DEDUPE[Dedupe Key]
      ACTOR[Actor Attribution]
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
    SYSTEM --> LOG
    RUNNER --> LOG
    LOG --> DEDUPE
    DEDUPE --> PIPE
    DEDUPE --> WORK
    DEDUPE --> NOTIFY
    ACTOR --> LOG`,
    summary:
      'Project-scoped event log in Postgres. GitHub pushes, PRs, cron ticks, chat messages, runner lifecycle events, and manual emissions flow through it. The orchestrator matches events against manifest triggers every 5 seconds.',
    details: [
      'Event sources: github, slack, cron, manual, app, system, runner',
      'Typed events: github.push, github.pull_request, cron.tick, system.job.failed',
      'Runner events: runner.started, runner.progress, runner.completed, runner.failed',
      'Dedupe keys: idempotent event processing via dedupe_key field',
      'Trigger matching: orchestrator polls pending events, matches manifest triggers',
      'GitHub PR triggers: support opened, synchronize, reopened, closed actions',
      'Branch patterns: wildcards like release/* or *-prod for trigger matching',
      'Actor attribution: user/system/app tracking on every event for audit',
    ],
    commands: [
      { cmd: 'eve event emit --type manual.test --source manual', desc: 'Emit event manually' },
      { cmd: 'eve event list --source github --type github.push', desc: 'Query event log' },
      { cmd: 'eve event show <id>', desc: 'Inspect event details' },
    ],
    manifestExample: `pipelines:
  ci:
    trigger:
      github:
        event: pull_request
        action: [opened, synchronize]
        base_branch: main
    steps:
      - name: test
        script: { run: "pnpm test" }
      - name: review
        depends_on: [test]
        agent:
          prompt: "Review the PR changes"`,
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
      HOOK[".eve/hooks/on-clone.sh"]
      SKILL_MD["SKILL.md"]
    end
    subgraph Structure[Skill Structure]
      META["Frontmatter: name, description"]
      BODY["Instructions Body"]
      REFS["references/"]
      SCRIPTS["scripts/"]
      ASSETS["assets/"]
    end
    subgraph Installed
      AGENT[".agent/skills/"]
      CLAUDE[".claude/skills/"]
    end
    subgraph Runtime
      HARNESS[Agent Harness]
      READ["skill read name"]
    end
    TXT --> HOOK
    PACKS --> HOOK
    HOOK --> AGENT
    AGENT --> CLAUDE
    SKILL_MD --> Structure
    AGENT --> HARNESS
    HARNESS --> READ`,
    summary:
      'Skills are repo-local SKILL.md files that teach agents how to work with your codebase. Installed from skills.txt at clone time. No central registry — skills live with the code they describe.',
    details: [
      'SKILL.md format: YAML frontmatter (name, description) + markdown instructions',
      'Progressive disclosure: metadata always available, body loaded on invoke',
      'Bundled resources: references/, scripts/, assets/ directories alongside SKILL.md',
      'Auto-install: .eve/hooks/on-clone.sh runs skills installer on clone',
      'Install targets: .agent/skills/ (universal) with .claude/skills/ symlink',
      'Search priority: project → global, universal → harness-specific',
      'Five harnesses supported: mclaude, zai, gemini, code, codex',
      'Migration path: skills.txt → x-eve.packs in manifest via eve migrate skills-to-packs',
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
    title: 'Observability & Cost',
    subtitle: 'Timing, cost, and diagnostics',
    icon: 'OB',
    color: 'slate',
    diagram: `graph TD
    subgraph JobTelemetry[Job-Level Telemetry]
      FOLLOW["eve job follow"]
      DIAG["eve job diagnose"]
      LOGS["eve job logs"]
      ATTEMPTS["eve job attempts"]
      RESULT["eve job result"]
    end
    subgraph RunnerMetrics[Runner Metrics]
      STARTED["runner.started"]
      PROGRESS["runner.progress"]
      COMPLETED["runner.completed"]
      FAILED["runner.failed"]
    end
    subgraph SystemLevel[System-Level]
      STATUS["eve system status"]
      HEALTH["eve system health"]
      SLOGS["eve system logs"]
      PODS["eve system pods"]
      EVENTS["eve system events"]
    end
    subgraph EnvLevel[Environment-Level]
      ENVD["eve env diagnose"]
      ENVL["eve env logs"]
      ENVSVC["eve env services"]
      BUILD_DIAG["eve build diagnose"]
    end
    subgraph CostTracking[Timing & Cost Data]
      DURATION["Attempt Duration"]
      TOKEN_USE["Token Usage"]
      BUILD_TIME["Build Timing"]
      PIPE_TIME["Pipeline Timing"]
    end
    JobTelemetry --> CostTracking
    RunnerMetrics --> CostTracking
    EnvLevel --> CostTracking`,
    summary:
      'Every layer is observable through the CLI. Job telemetry tracks attempt durations and runner lifecycle events. Build and pipeline timing data flows through the event spine. System-wide health, pod status, and component logs — all without kubectl.',
    details: [
      'Job follow: real-time JSONL log streaming as the agent works',
      'Job diagnose: timeline, error summary, and actionable recommendations',
      'Job attempts: view all execution attempts with duration, status, and exit codes',
      'Runner events: started → progress (message/percentage) → completed (result) or failed (error/exitCode)',
      'Build timing: BuildRun records capture start/end timestamps per backend',
      'Pipeline timing: pipeline run status tracks per-step durations (build → release → deploy)',
      'System status: aggregate health across API, orchestrator, worker, DB',
      'System logs: stream component logs (api, orchestrator, worker) with tail/grep',
      'Environment diagnostics: pod phase, restart counts, readiness, k8s events',
      'Build diagnostics: full dump — spec + runs + artifacts + logs in one command',
    ],
    commands: [
      { cmd: 'eve job follow <id>', desc: 'Stream logs in real-time' },
      { cmd: 'eve job diagnose <id>', desc: 'Full diagnostic with recommendations' },
      { cmd: 'eve job attempts <id>', desc: 'View all attempts with timing' },
      { cmd: 'eve job watch <id>', desc: 'Watch job status changes' },
      { cmd: 'eve system status', desc: 'Platform-wide health overview' },
      { cmd: 'eve system logs api --tail 50', desc: 'Stream component logs' },
      { cmd: 'eve system pods', desc: 'Pod status across namespaces' },
      { cmd: 'eve env diagnose <proj> <env>', desc: 'Environment health + events' },
      { cmd: 'eve env services <proj> <env>', desc: 'Per-service pod summary' },
      { cmd: 'eve build diagnose <id>', desc: 'Build spec + runs + artifacts + logs' },
    ],
  },
]
