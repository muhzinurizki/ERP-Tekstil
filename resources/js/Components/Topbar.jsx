import { router, usePage } from '@inertiajs/react'
import { ChevronDown, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Topbar() {
  const { auth } = usePage().props
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const logout = () => router.post('/logout')

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="
      h-16 bg-white
      border-b border-gray-200
      flex items-center justify-between
      px-8
    ">
      {/* LEFT */}
      <div className="flex flex-col leading-tight">
        <span className="text-xs uppercase tracking-widest text-gray-400">
          Dashboard
        </span>
        <span className="text-sm font-medium text-gray-800">
          Operational Overview
        </span>
      </div>

      {/* RIGHT */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-4
            px-3 py-2 rounded-lg
            hover:bg-gray-100
            transition
          "
        >
          <div className="
            w-9 h-9 rounded-full
            bg-gradient-to-br from-slate-200 to-slate-300
            flex items-center justify-center
            text-xs font-semibold
          ">
            {auth.user.name.charAt(0)}
          </div>

          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-gray-800">
              {auth.user.name}
            </span>
            <span className="text-xs text-gray-400">
              {auth.user.roles?.[0]?.name ?? 'User'}
            </span>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {open && (
          <div className="
            absolute right-0 mt-2 w-52
            bg-white border border-gray-200
            rounded-xl shadow-lg
            overflow-hidden
          ">
            <button
              onClick={logout}
              className="
                w-full flex items-center gap-2
                px-4 py-3 text-sm text-red-600
                hover:bg-gray-50
              "
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
