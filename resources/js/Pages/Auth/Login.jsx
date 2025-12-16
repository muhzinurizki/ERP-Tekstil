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

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
        {/* LEFT PANEL – BRANDING */}
        <div className="hidden lg:flex flex-col justify-center px-20 text-slate-800">
          <div className="max-w-lg">
            <div className="text-sm uppercase tracking-widest text-slate-500 font-medium">
              Enterprise Resource Planning
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              ERP Tekstil
            </h1>

            <p className="mt-6 text-slate-600 leading-relaxed">
              Sistem Informasi Manajemen Tekstil Terintegrasi
              untuk mengelola Purchasing, Inventory, Production,
              Sales, dan Finance secara terpusat dan akurat.
            </p>

            <div className="mt-10 text-sm text-slate-600 font-medium">
              PT. Indotaichen Textile Industry
            </div>
          </div>
        </div>

        {/* RIGHT PANEL – LOGIN FORM */}
        <div className="flex items-center justify-center bg-white px-6">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <LogIn className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Sign in
              </h2>
              <p className="mt-2 text-slate-600">
                Masuk untuk mengakses sistem ERP
              </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
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

              {/* REMEMBER ME & FORGOT PASSWORD */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                    Ingat saya
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Lupa password?
                  </a>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={processing}
                className="
                  w-full flex items-center justify-center gap-2
                  rounded-lg bg-indigo-600 py-3
                  text-sm font-medium text-white
                  hover:bg-indigo-700 transition
                  disabled:opacity-70 shadow-sm
                "
              >
                <LogIn className="w-4 h-4" />
                {processing ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-8 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} PT. Indotaichen Textile Industry. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
