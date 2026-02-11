import { Link } from 'react-router-dom'
import type { Capability } from '../data/capabilities'

interface Props {
  cap: Capability
}

const colorMap: Record<string, string> = {
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40',
  green: 'from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40',
  purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40',
  orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40',
  cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-500/40',
  amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 hover:border-amber-500/40',
  red: 'from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40',
  teal: 'from-teal-500/10 to-teal-600/5 border-teal-500/20 hover:border-teal-500/40',
  indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/40',
  slate: 'from-slate-500/10 to-slate-600/5 border-slate-500/20 hover:border-slate-500/40',
  violet: 'from-violet-500/10 to-violet-600/5 border-violet-500/20 hover:border-violet-500/40',
  pink: 'from-pink-500/10 to-pink-600/5 border-pink-500/20 hover:border-pink-500/40',
  emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40',
  lime: 'from-lime-500/10 to-lime-600/5 border-lime-500/20 hover:border-lime-500/40',
  sky: 'from-sky-500/10 to-sky-600/5 border-sky-500/20 hover:border-sky-500/40',
  rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 hover:border-rose-500/40',
  fuchsia: 'from-fuchsia-500/10 to-fuchsia-600/5 border-fuchsia-500/20 hover:border-fuchsia-500/40',
  yellow: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 hover:border-yellow-500/40',
  stone: 'from-stone-500/10 to-stone-600/5 border-stone-500/20 hover:border-stone-500/40',
  zinc: 'from-zinc-500/10 to-zinc-600/5 border-zinc-500/20 hover:border-zinc-500/40',
}

const iconColorMap: Record<string, string> = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  cyan: 'text-cyan-500',
  amber: 'text-amber-500',
  red: 'text-red-500',
  teal: 'text-teal-500',
  indigo: 'text-indigo-500',
  slate: 'text-slate-400',
  violet: 'text-violet-500',
  pink: 'text-pink-500',
  emerald: 'text-emerald-500',
  lime: 'text-lime-500',
  sky: 'text-sky-500',
  rose: 'text-rose-500',
  fuchsia: 'text-fuchsia-500',
  yellow: 'text-yellow-500',
  stone: 'text-stone-400',
  zinc: 'text-zinc-400',
}

export function CapabilityCard({ cap }: Props) {
  return (
    <Link
      to={`/${cap.id}`}
      className={`block group rounded-xl border bg-gradient-to-br p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${colorMap[cap.color] ?? colorMap.blue}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg bg-(--color-surface-3) flex items-center justify-center font-mono font-bold text-sm ${iconColorMap[cap.color] ?? ''}`}
        >
          {cap.icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-(--color-text) group-hover:text-(--color-accent) transition-colors">
            {cap.title}
          </h3>
          <p className="text-sm text-(--color-text-2) mt-0.5">{cap.subtitle}</p>
          <p className="text-sm text-(--color-text-2) mt-3 line-clamp-2 leading-relaxed">
            {cap.summary}
          </p>
        </div>
      </div>
    </Link>
  )
}
