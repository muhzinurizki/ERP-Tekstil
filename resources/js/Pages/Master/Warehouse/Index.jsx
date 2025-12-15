import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'

export default function WarehouseIndex({ warehouses }) {
  return (
    <AppLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Master Data – Warehouse
          </h1>

          <Link
            href="/master/warehouses/create"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm"
          >
            + Tambah Warehouse
          </Link>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map(w => (
                <tr key={w.id} className="border-t">
                  <td className="px-4 py-3">{w.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {w.location || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AppLayout>
  )
}
