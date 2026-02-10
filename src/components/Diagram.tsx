import { useMermaid } from '../hooks/useMermaid'

interface Props {
  code: string
  theme: 'light' | 'dark'
}

export function Diagram({ code, theme }: Props) {
  const { svg, loading } = useMermaid(code, theme)

  if (loading) {
    return (
      <div className="diagram-container rounded-xl border border-(--color-border) bg-(--color-surface-2) p-8 flex items-center justify-center min-h-48">
        <div className="animate-pulse text-(--color-text-3)">Rendering diagram...</div>
      </div>
    )
  }

  return (
    <div
      className="diagram-container rounded-xl border border-(--color-border) bg-(--color-surface-2) p-6 overflow-x-auto text-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
