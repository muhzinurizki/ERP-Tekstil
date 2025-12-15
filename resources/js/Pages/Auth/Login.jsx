import { Head, useForm } from '@inertiajs/react'
import { LogIn } from 'lucide-react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  const submit = (e) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950">
        {/* LEFT PANEL – BRANDING */}
        <div className="hidden lg:flex flex-col justify-center px-20 text-slate-200">
          <div className="max-w-lg">
            <div className="text-sm uppercase tracking-widest text-slate-400">
              Enterprise Resource Planning
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              ERP Tekstil
            </h1>

            <p className="mt-6 text-slate-400 leading-relaxed">
              Sistem Informasi Manajemen Tekstil Terintegrasi
              untuk mengelola Purchasing, Inventory, Production,
              Sales, dan Finance secara terpusat dan akurat.
            </p>

            <div className="mt-10 text-sm text-slate-500">
              PT. Indotaichen Textile Industry
            </div>
          </div>
        </div>

        {/* RIGHT PANEL – LOGIN FORM */}
        <div className="flex items-center justify-center bg-gray-100 px-6">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Sign in
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Masuk untuk mengakses sistem ERP
              </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-300 focus:border-slate-800 focus:ring-slate-800"
                  placeholder="user@company.com"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border-gray-300 focus:border-slate-800 focus:ring-slate-800"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={processing}
                className="
                  w-full flex items-center justify-center gap-2
                  rounded-lg bg-slate-900 py-3
                  text-sm font-medium text-white
                  hover:bg-slate-800 transition
                  disabled:opacity-60
                "
              >
                <LogIn className="w-4 h-4" />
                {processing ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-8 text-xs text-gray-400">
              © {new Date().getFullYear()} PT. Indotaichen Textile Industry
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
