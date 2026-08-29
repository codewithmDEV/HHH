import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

type Props = {
  to: string
  icon: string
  label: string
  description: string
  accent?: boolean
  children?: ReactNode
}

export default function FeatureCard({ to, icon, label, description, accent, children }: Props) {
  return (
    <Link
      to={to}
      className={`block rounded-2xl p-4 transition-all active:scale-[0.98] animate-slide-up ${
        accent
          ? 'bg-forest text-cream border border-forest-light/30'
          : 'bg-moss/30 text-ink border border-forest/10 hover:bg-moss/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            accent ? 'bg-cream/15 text-cream' : 'bg-forest/10 text-forest'
          }`}
        >
          <Icon name={icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-serif text-lg font-semibold ${accent ? 'text-cream' : 'text-forest'}`}>
            {label}
          </h3>
          <p className={`text-xs mt-0.5 ${accent ? 'text-cream/70' : 'text-stone'}`}>
            {description}
          </p>
          {children}
        </div>
      </div>
    </Link>
  )
}
