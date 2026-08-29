import { Link, useNavigate } from 'react-router-dom'
import Icon from './Icon'

type Props = {
  title: string
  subtitle?: string
  back?: boolean
  action?: { label: string; to: string; icon?: string }
}

export default function PageHeader({ title, subtitle, back, action }: Props) {
  const navigate = useNavigate()
  return (
    <header className="px-5 pt-6 pb-4 animate-fade-in">
      <div className="flex items-center justify-between">
        {back ? (
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-stone text-sm">
            <Icon name="arrowLeft" size={18} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}
        {action && (
          <Link to={action.to} className="flex items-center gap-1 text-clay text-sm font-medium">
            {action.icon && <Icon name={action.icon} size={16} />}
            <span>{action.label}</span>
          </Link>
        )}
      </div>
      <h1 className="text-2xl text-forest mt-2 font-serif font-semibold">{title}</h1>
      {subtitle && <p className="text-stone text-sm mt-1">{subtitle}</p>}
    </header>
  )
}
