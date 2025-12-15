import { Link, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  Boxes,
  Factory,
  ShoppingCart,
  Wallet,
  Users,
} from 'lucide-react'

const sidebarSections = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'manager', 'staff'],
      },
    ],
  },
  {
    title: 'Master Data',
    items: [
      {
        label: 'Warehouse',
        href: '/master/warehouses',
        icon: Boxes,
        roles: ['admin'],
      },
      {
        label: 'Raw Material',
        href: '/master/materials',
        icon: Boxes,
        roles: ['admin'],
      },
      {
        label: 'Machine',
        href: '/master/machines',
        icon: Factory,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Operasional',
    items: [
      {
        label: 'Inventory',
        href: '/inventory',
        icon: Boxes,
        roles: ['admin', 'staff'],
      },
      {
        label: 'Production',
        href: '/production',
        icon: Factory,
        roles: ['admin', 'manager'],
      },
      {
        label: 'Purchasing',
        href: '/purchasing',
        icon: ShoppingCart,
        roles: ['admin', 'staff'],
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      {
        label: 'Finance',
        href: '/finance',
        icon: Wallet,
        roles: ['admin', 'manager'],
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        label: 'Users',
        href: '/users',
        icon: Users,
        roles: ['admin'],
      },
    ],
  },
]

export default function Sidebar() {
  const { url, props } = usePage()
  const role = props.auth?.role?.toLowerCase() ?? 'staff'

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

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {sidebarSections.map(section => {
          const visibleItems = section.items.filter(item =>
            item.roles.includes(role)
          )

          if (visibleItems.length === 0) return null

          return (
            <div key={section.title}>
              {/* SECTION TITLE */}
              <div className="px-3 mb-2 text-xs uppercase tracking-widest text-slate-500">
                {section.title}
              </div>

              {/* ITEMS */}
              <div className="space-y-1">
                {visibleItems.map(item => {
                  const Icon = item.icon
                  const active = url.startsWith(item.href)

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`
                        group relative flex items-center gap-3
                        px-4 py-3 rounded-xl text-sm
                        transition-all duration-200
                        ${active
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      {active && (
                        <span className="
                          absolute left-0 top-1/2 -translate-y-1/2
                          h-6 w-1 rounded-r bg-white
                        " />
                      )}

                      <Icon
                        className={`
                          w-4 h-4
                          ${active
                            ? 'text-white'
                            : 'text-slate-500 group-hover:text-white'}
                        `}
                      />

                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
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
