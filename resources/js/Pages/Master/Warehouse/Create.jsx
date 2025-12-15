import AppLayout from '@/Layouts/AppLayout'
import { useForm } from '@inertiajs/react'

export default function WarehouseCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    location: '',
  })

  function submit(e) {
    e.preventDefault()
    post('/master/warehouses')
  }

  return (
    <AppLayout>
      <form onSubmit={submit} className="max-w-xl space-y-6">
        <h1 className="text-xl font-semibold">
          Tambah Warehouse
        </h1>

        <div>
          <label className="text-sm">Nama Warehouse</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
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
          <label className="text-sm">Lokasi</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={data.location}
            onChange={e => setData('location', e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            disabled={processing}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </form>
    </AppLayout>
  )
}
