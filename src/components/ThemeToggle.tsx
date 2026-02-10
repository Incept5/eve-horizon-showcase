interface Props {
  theme: 'light' | 'dark'
  toggle: () => void
}

export function ThemeToggle({ theme, toggle }: Props) {
  return (
    <button
      onClick={toggle}
      className="fixed top-5 right-5 z-50 w-10 h-10 rounded-full bg-(--color-surface-2) border border-(--color-border) flex items-center justify-center text-lg cursor-pointer hover:bg-(--color-surface-3) transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
