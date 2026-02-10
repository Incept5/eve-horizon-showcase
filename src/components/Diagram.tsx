import { useState, useCallback, useEffect } from 'react'
import { useMermaid } from '../hooks/useMermaid'

interface Props {
  code: string
  theme: 'light' | 'dark'
}

export function Diagram({ code, theme }: Props) {
  const { svg, loading } = useMermaid(code, theme)
  const [expanded, setExpanded] = useState(false)

  const close = useCallback(() => setExpanded(false), [])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded, close])

  if (loading) {
    return (
      <div className="diagram-container rounded-xl border border-(--color-border) bg-(--color-surface-2) p-8 flex items-center justify-center min-h-48">
        <div className="animate-pulse text-(--color-text-3)">Rendering diagram...</div>
      </div>
    )
  }

  return (
    <>
      <div className="relative group">
        <div
          className="diagram-container rounded-xl border border-(--color-border) bg-(--color-surface-2) p-6 overflow-x-auto text-center cursor-pointer"
          onClick={() => setExpanded(true)}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <button
          onClick={() => setExpanded(true)}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-(--color-surface-3) border border-(--color-border) text-(--color-text-3) hover:text-(--color-accent) hover:border-(--color-accent)"
          title="Expand diagram"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10 2 14 2 14 6" />
            <polyline points="6 14 2 14 2 10" />
            <line x1="14" y1="2" x2="9" y2="7" />
            <line x1="2" y1="14" x2="7" y2="9" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="diagram-fullscreen relative w-[95vw] h-[90vh] rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 overflow-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 p-2 rounded-lg bg-(--color-surface-3) border border-(--color-border) text-(--color-text-3) hover:text-(--color-accent) hover:border-(--color-accent) z-10"
              title="Close (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
            <div
              className="diagram-container w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </>
  )
}
