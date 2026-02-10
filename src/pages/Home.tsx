import { Link } from 'react-router-dom'
import { CapabilityCard } from '../components/CapabilityCard'
import { capabilities } from '../data/capabilities'

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-(--color-border)">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Eve Horizon
          </h1>
          <p className="mt-6 text-xl text-(--color-text-2) max-w-2xl mx-auto leading-relaxed">
            A job-first platform where AI agents are first-class citizens. Agents
            authenticate, create work, deploy code, coordinate teams, and respond
            to chat — all through a single CLI.
          </p>

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-12 flex-wrap">
            {[
              ['5', 'Agent Harnesses'],
              ['16', 'Capability Areas'],
              ['3', 'Build Backends'],
              ['80+', 'CLI Commands'],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-(--color-accent)">
                  {num}
                </div>
                <div className="text-xs uppercase tracking-wider text-(--color-text-3) mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* LLMs link */}
          <div className="mt-8">
            <Link
              to="/llms"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) bg-(--color-surface-2) text-sm text-(--color-text-2) hover:text-(--color-accent) hover:border-(--color-accent) transition-colors"
            >
              <span className="font-mono text-xs bg-(--color-surface-3) px-1.5 py-0.5 rounded">llms.txt</span>
              LLM-friendly platform reference
            </Link>
          </div>
        </div>
      </header>

      {/* Core Principle */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-green-500">
          The Core Principle
        </h2>
        <p className="mt-2 text-(--color-text-2) leading-relaxed">
          Anything a human can do through the CLI, an agent can do too. Same
          commands. Same auth. Same API. No separate "agent API" — agents{' '}
          <em className="text-(--color-text)">are</em> users.
        </p>
      </section>

      {/* Getting Started */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-(--color-text) mb-6">
          Getting Started
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) overflow-hidden">
            <div className="px-4 py-2 border-b border-(--color-border) bg-(--color-surface-3) flex items-center gap-2">
              <span className="text-xs font-mono text-(--color-text-3)">1. Install the Eve CLI</span>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-(--color-accent)">npm install -g @anthropic/eve-cli</code>
            </pre>
          </div>

          <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) overflow-hidden">
            <div className="px-4 py-2 border-b border-(--color-border) bg-(--color-surface-3) flex items-center gap-2">
              <span className="text-xs font-mono text-(--color-text-3)">2. Authenticate</span>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-(--color-accent)">{'eve profile create staging --api-url https://api.eh1.incept5.dev\neve profile use staging\neve auth login --email you@example.com'}</code>
            </pre>
          </div>

          <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) overflow-hidden">
            <div className="px-4 py-2 border-b border-(--color-border) bg-(--color-surface-3) flex items-center gap-2">
              <span className="text-xs font-mono text-(--color-text-3)">3. Install Eve skill packs into your repo</span>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-(--color-accent)">{'eve skills install'}</code>
            </pre>
          </div>

          <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) overflow-hidden">
            <div className="px-4 py-2 border-b border-(--color-border) bg-(--color-surface-3) flex items-center gap-2">
              <span className="text-xs font-mono text-(--color-text-3)">4. Create a project and deploy</span>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-(--color-accent)">{'eve project ensure --name my-app --slug myapp \\\n  --repo-url https://github.com/org/repo\neve project sync\neve env create staging --type persistent\neve env deploy staging --ref main --repo-dir .'}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Capability Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-(--color-text) mb-8">
          What Agents Can Do
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {capabilities.map((cap) => (
            <CapabilityCard key={cap.id} cap={cap} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-(--color-border) py-8 text-center text-sm text-(--color-text-3)">
        <div>
          Eve Horizon · Built by{' '}
          <a
            href="https://github.com/incept5"
            className="text-(--color-accent) hover:underline"
          >
            Incept5
          </a>
          {' · Diagrams by '}
          <a
            href="https://github.com/lukilabs/beautiful-mermaid"
            className="text-(--color-accent) hover:underline"
          >
            beautiful-mermaid
          </a>
        </div>
        <div className="mt-2">
          <a
            href="/llms"
            className="text-(--color-accent) hover:underline"
          >
            llms.txt
          </a>
          {' — LLM-friendly platform reference'}
        </div>
      </footer>
    </div>
  )
}
