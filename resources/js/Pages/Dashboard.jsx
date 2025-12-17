import AppLayout from '@/Layouts/AppLayout'
import { usePage } from '@inertiajs/react'
import {
  User,
  ShieldCheck,
  Factory,
  Boxes,
  ClipboardList,
} from 'lucide-react'

export default function Dashboard() {
  const { auth } = usePage().props
  const user = auth.user

  // SINGLE SOURCE OF TRUTH
  const role = auth.role?.toLowerCase() ?? 'staff'

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* ================= WELCOME SECTION ================= */}
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* LEFT */}
            <div>
              <p className="text-sm text-slate-300">
                Selamat datang kembali di
              </p>

              <h1 className="mt-1 text-xl font-bold text-white">
                ERP PT. Indotaichen Textile Industry
              </h1>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-600 text-white font-medium">
                  {role}
                </span>
                <p className="text-slate-300 text-sm">
                  Akses Anda: {role === 'admin' ? 'Administrator' : role === 'manager' ? 'Manager' : 'Staff Operasional'}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="leading-tight">
                <div className="text-sm font-medium text-white">
                  {user.name}
                </div>
                <div className="text-xs text-slate-300">
                  {user.email}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= CONTEXT CARDS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <ContextCard
            title="Role Aktif"
            value={role}
            icon={ShieldCheck}
            description="Hak akses sistem"
          />

          {/* ADMIN */}
          {role === 'admin' && (
            <>
              <ContextCard
                title="Master Data"
                value="Warehouse, Material"
                icon={Boxes}
                description="Data inti sistem"
              />
              <ContextCard
                title="User & Akses"
                value="RBAC"
                icon={User}
                description="Manajemen user"
              />
            </>
          )}

          {/* MANAGER */}
          {role === 'manager' && (
            <>
              <ContextCard
                title="Approval"
                value="PR / WO / Transfer"
                icon={ClipboardList}
                description="Dokumen menunggu persetujuan"
              />
              <ContextCard
                title="Production"
                value="Monitoring"
                icon={Factory}
                description="Status proses produksi"
              />
            </>
          )}

          {/* STAFF */}
          {role === 'staff' && (
            <>
              <ContextCard
                title="Inventory"
                value="Operasional"
                icon={Boxes}
                description="Stok & mutasi"
              />
              <ContextCard
                title="Tugas Hari Ini"
                value="—"
                icon={ClipboardList}
                description="Aktivitas operasional"
              />
            </>
          )}

        </section>

        {/* ================= PLACEHOLDER ENTERPRISE ================= */}
        <section className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 rounded-xl p-8 text-center shadow-sm">
          <div className="max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
              <Factory className="w-6 h-6 text-indigo-600" />
            </div>

            {role === 'admin' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Dashboard Administratif</h3>
                <p className="text-sm text-slate-600">
                  Ringkasan sistem, statistik master data, dan konfigurasi
                  lanjutan akan ditampilkan di sini.
                </p>
              </div>
            )}

            {role === 'manager' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Dashboard Manajerial</h3>
                <p className="text-sm text-slate-600">
                  Daftar approval pending, KPI operasional, dan monitoring
                  produksi akan ditampilkan di sini.
                </p>
              </div>
            )}

            {role === 'staff' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Dashboard Operasional</h3>
                <p className="text-sm text-slate-600">
                  Daftar tugas harian, notifikasi stok, dan aktivitas
                  operasional akan ditampilkan di sini.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  )
}

/* ================= CONTEXT CARD ================= */

function ContextCard({ title, value, icon: Icon, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icon className="w-4 h-4 text-white" />
      </div>

      <div className="min-w-0">
        <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">{title}</div>
        <div className="mt-1 text-base font-semibold text-slate-800 capitalize">
          {value}
        </div>
        <div className="mt-1 text-xs text-slate-400">
          {description}
        </div>
      </div>
    </div>
  )
}
