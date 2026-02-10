import { useState, useEffect } from 'react'
import { renderMermaid } from 'beautiful-mermaid'

const lightTheme = {
  bg: '#f8fafc',
  fg: '#1e293b',
  line: '#3b82f6',
  accent: '#2563eb',
  muted: '#64748b',
  surface: '#ffffff',
  border: '#cbd5e1',
}

const darkTheme = {
  bg: '#0d1117',
  fg: '#c9d1d9',
  line: '#388bfd',
  accent: '#58a6ff',
  muted: '#8b949e',
  surface: '#161b22',
  border: '#30363d',
}

export function useMermaid(code: string, theme: 'light' | 'dark') {
  const [svg, setSvg] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const colors = theme === 'dark' ? darkTheme : lightTheme
    renderMermaid(code.trim(), { ...colors, transparent: true })
      .then((result) => {
        if (!cancelled) {
          setSvg(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Mermaid render error:', err)
          setSvg(`<pre style="color:red">${err.message}</pre>`)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [code, theme])

  return { svg, loading }
}
