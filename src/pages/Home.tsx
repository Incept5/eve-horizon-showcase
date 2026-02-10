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
              ['2', 'Chat Channels'],
              ['2', 'Identity Providers'],
              ['60+', 'CLI Commands'],
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
      </footer>
    </div>
  )
}
