import AppLayout from '@/Layouts/AppLayout'
import { Link, useForm } from '@inertiajs/react'

export default function WarehouseEdit({ warehouse }) {
  const { data, setData, put, processing, errors } = useForm({
    name: warehouse.name || '',
    location: warehouse.location || '',
  })

  function submit(e) {
    e.preventDefault()
    put(`/master/warehouses/${warehouse.id}`)
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 mb-6">
          <h1 className="text-xl font-semibold">Edit Warehouse</h1>
          <p className="text-slate-300 mt-1">Ubah informasi warehouse sesuai kebutuhan</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Warehouse <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                  />
                  {errors.name && (
                    <div className="text-sm text-red-600 mt-1">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                    value={data.location}
                    onChange={e => setData('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Link
                  href="/master/warehouses"
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors duration-200 shadow-sm font-medium"
                >
                  {processing ? 'Menyimpan...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
