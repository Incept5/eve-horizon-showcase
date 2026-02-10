import { useParams, Link, Navigate } from 'react-router-dom'
import { capabilities } from '../data/capabilities'
import { Diagram } from '../components/Diagram'

interface Props {
  theme: 'light' | 'dark'
}

export function Detail({ theme }: Props) {
  const { id } = useParams<{ id: string }>()
  const cap = capabilities.find((c) => c.id === id)

  if (!cap) return <Navigate to="/" replace />

  const idx = capabilities.indexOf(cap)
  const prev = idx > 0 ? capabilities[idx - 1] : null
  const next = idx < capabilities.length - 1 ? capabilities[idx + 1] : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-(--color-border) bg-(--color-surface-2)">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-(--color-text-2) hover:text-(--color-accent) transition-colors mb-4"
          >
            <span>←</span> All Capabilities
          </Link>
          <h1 className="text-3xl font-bold text-(--color-text)">{cap.title}</h1>
          <p className="text-(--color-text-2) mt-1">{cap.subtitle}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Summary */}
        <p className="text-lg text-(--color-text) leading-relaxed mb-10">
          {cap.summary}
        </p>

        {/* Diagram */}
        <section className="mb-10">
          <Diagram code={cap.diagram} theme={theme} />
        </section>

        {/* Details */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-(--color-text) mb-4">
            How It Works
          </h2>
          <ul className="space-y-3">
            {cap.details.map((detail, i) => (
              <li key={i} className="flex gap-3 text-(--color-text-2) leading-relaxed">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-(--color-accent) mt-2.5" />
                {detail}
              </li>
            ))}
          </ul>
        </section>

        {/* Manifest Example */}
        {cap.manifestExample && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-(--color-text) mb-4">
              Manifest Example
            </h2>
            <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) overflow-hidden">
              <div className="px-4 py-2 border-b border-(--color-border) bg-(--color-surface-3)">
                <span className="text-xs font-mono text-(--color-text-3)">.eve/manifest.yaml</span>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className="text-(--color-text-2) font-mono">{cap.manifestExample}</code>
              </pre>
            </div>
          </section>
        )}

        {/* Commands */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-(--color-text) mb-4">
            CLI Commands
          </h2>
          <div className="space-y-2">
            {cap.commands.map((c, i) => (
              <div
                key={i}
                className="flex items-baseline gap-3 p-3 rounded-lg bg-(--color-surface-2) border border-(--color-border)"
              >
                <code className="text-sm font-mono text-(--color-accent) whitespace-nowrap flex-shrink-0">
                  {c.cmd}
                </code>
                <span className="text-sm text-(--color-text-3)">{c.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex justify-between pt-8 border-t border-(--color-border)">
          {prev ? (
            <Link
              to={`/${prev.id}`}
              className="group flex items-center gap-2 text-sm text-(--color-text-2) hover:text-(--color-accent) transition-colors"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              {prev.title}
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to={`/${next.id}`}
              className="group flex items-center gap-2 text-sm text-(--color-text-2) hover:text-(--color-accent) transition-colors"
            >
              {next.title}
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="text-sm text-(--color-text-2) hover:text-(--color-accent) transition-colors"
            >
              Back to overview →
            </Link>
          )}
        </nav>
      </main>
    </div>
  )
}
