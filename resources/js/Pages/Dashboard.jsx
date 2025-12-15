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
      <div className="space-y-8">

        {/* ================= WELCOME SECTION ================= */}
        <section className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* LEFT */}
            <div>
              <p className="text-sm text-gray-500">
                Selamat datang kembali,
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-gray-800">
                {user.name}
              </h1>

              <p className="mt-3 text-gray-600 max-w-2xl">
                Anda masuk sebagai{' '}
                <span className="font-medium capitalize">{role}</span>.
                Gunakan dashboard ini untuk memantau dan mengelola proses
                operasional perusahaan secara terintegrasi.
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-gray-50 border">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-semibold">
                {user.name.charAt(0)}
              </div>

              <div className="leading-tight">
                <div className="text-sm font-medium text-gray-800">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">
                  {user.email}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= CONTEXT CARDS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

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
        <section className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">

          {role === 'admin' && (
            <p className="text-sm text-gray-500">
              Ringkasan sistem, statistik master data, dan konfigurasi
              lanjutan akan ditampilkan di sini.
            </p>
          )}

          {role === 'manager' && (
            <p className="text-sm text-gray-500">
              Daftar approval pending, KPI operasional, dan monitoring
              produksi akan ditampilkan di sini.
            </p>
          )}

          {role === 'staff' && (
            <p className="text-sm text-gray-500">
              Daftar tugas harian, notifikasi stok, dan aktivitas
              operasional akan ditampilkan di sini.
            </p>
          )}

        </section>

      </div>
    </AppLayout>
  )
}

/* ================= CONTEXT CARD ================= */

function ContextCard({ title, value, icon: Icon, description }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-700" />
      </div>

      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="mt-1 text-lg font-semibold text-gray-800 capitalize">
          {value}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          {description}
        </div>
      </div>
    </div>
  )
}
