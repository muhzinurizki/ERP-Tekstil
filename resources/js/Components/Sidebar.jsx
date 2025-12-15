import { Link, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  Boxes,
  Factory,
  ShoppingCart,
  Wallet,
  Users,
} from 'lucide-react'

const menus = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inventory', href: '/inventory', icon: Boxes },
  { label: 'Production', href: '/production', icon: Factory },
  { label: 'Purchasing', href: '/purchasing', icon: ShoppingCart },
  { label: 'Finance', href: '/finance', icon: Wallet },
  { label: 'Users', href: '/users', icon: Users },
]

export default function Sidebar() {
  const { url } = usePage()

  return (
    <aside className="
      w-64 min-h-screen
      bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900
      text-slate-200
      flex flex-col
      shadow-[4px_0_24px_rgba(0,0,0,0.25)]
    ">
      {/* BRAND */}
      <div className="h-20 px-6 flex flex-col justify-center border-b border-slate-900">
        <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
          Enterprise System
        </span>
        <span className="text-xl font-semibold tracking-wide mt-1">
          ERP Tekstil
        </span>
      </div>

      {/* SECTION */}
      <div className="px-6 pt-6 pb-2 text-xs uppercase tracking-widest text-slate-500">
        Main Modules
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 space-y-1">
        {menus.map(menu => {
          const Icon = menu.icon
          const active = url.startsWith(menu.href)

          return (
            <Link
              key={menu.label}
              href={menu.href}
              className={`
                group relative flex items-center gap-3
                px-4 py-3 rounded-xl text-sm
                transition-all duration-200
                ${active
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              {/* Active indicator */}
              {active && (
                <span className="
                  absolute left-0 top-1/2 -translate-y-1/2
                  h-6 w-1 rounded-r bg-white
                " />
              )}

              <Icon
                className={`
                  w-4 h-4
                  ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}
                `}
              />

              <span>{menu.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t border-slate-900 text-xs text-slate-500">
        PT. Indotaichen Textile Industry
      </div>
    </aside>
  )
}
