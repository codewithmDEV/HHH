import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const navItems = [
  { to: '/', label: 'Space', icon: 'home' },
  { to: '/salah', label: 'Salah', icon: 'salah' },
  { to: '/intentions', label: 'Intentions', icon: 'intention' },
  { to: '/guidance', label: 'Guidance', icon: 'guidance' },
  { to: '/journal', label: 'Journal', icon: 'journal' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-forest border-t border-forest-light/30 z-50">
      <div className="flex items-stretch px-2 py-2 pb-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
            }
          >
            <Icon name={item.icon} size={22} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
