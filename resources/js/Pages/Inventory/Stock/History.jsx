import AppLayout from "@/Layouts/AppLayout";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function StockHistory({ mutations, warehouses, rawMaterials, filters }) {
    const { flash = {} } = usePage().props;

    const [itemFilter, setItemFilter] = useState(filters?.item_id || "");
    const [warehouseFilter, setWarehouseFilter] = useState(filters?.warehouse_id || "");
    const [typeFilter, setTypeFilter] = useState(filters?.type || "");
    const [showAlert, setShowAlert] = useState(true);

    function handleSearch(e) {
        e.preventDefault();

        // Use router from Inertia context to filter
        const params = new URLSearchParams();
        if (itemFilter) params.append('item_id', itemFilter);
        if (warehouseFilter) params.append('warehouse_id', warehouseFilter);
        if (typeFilter) params.append('type', typeFilter);

        window.location.href = `/inventory/stocks/history?${params.toString()}`;
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* ALERT */}
                {flash.success && showAlert && (
                    <div className="
                      flex items-center justify-between
                      px-4 py-3
                      bg-green-50 border border-green-200
                      text-green-800
                      rounded-lg
                    ">
                        <span className="text-sm">{flash.success}</span>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="text-sm font-medium"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-800">
                            Riwayat Stock Movement
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Monitor pergerakan stok bahan baku
                        </p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-48">
                            <label htmlFor="item" className="block text-sm font-medium text-slate-700 mb-1">
                                Bahan Baku
                            </label>
                            <select
                                id="item"
                                value={itemFilter}
                                onChange={(e) => setItemFilter(e.target.value)}
                                className="
                                  w-full
                                  border border-slate-300 rounded-lg
                                  px-4 py-2 text-sm
                                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                  shadow-sm
                                "
                            >
                                <option value="">Semua Bahan Baku</option>
                                {rawMaterials.map(material => (
                                    <option key={material.id} value={material.id}>
                                        {material.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full md:w-48">
                            <label htmlFor="warehouse" className="block text-sm font-medium text-slate-700 mb-1">
                                Warehouse
                            </label>
                            <select
                                id="warehouse"
                                value={warehouseFilter}
                                onChange={(e) => setWarehouseFilter(e.target.value)}
                                className="
                                  w-full
                                  border border-slate-300 rounded-lg
                                  px-4 py-2 text-sm
                                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                  shadow-sm
                                "
                            >
                                <option value="">Semua Warehouse</option>
                                {warehouses.map(warehouse => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full md:w-40">
                            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
                                Jenis Movement
                            </label>
                            <select
                                id="type"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="
                                  w-full
                                  border border-slate-300 rounded-lg
                                  px-4 py-2 text-sm
                                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                  shadow-sm
                                "
                            >
                                <option value="">Semua Jenis</option>
                                <option value="in">IN (Penambahan)</option>
                                <option value="out">OUT (Pengurangan)</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="
                                  w-full md:w-auto
                                  px-4 py-2
                                  bg-slate-100 text-slate-700
                                  text-sm font-medium
                                  rounded-lg
                                  hover:bg-slate-200
                                  transition-colors duration-200
                                "
                            >
                                Filter
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Bahan Baku</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Warehouse</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Jenis</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Jumlah</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Catatan</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {mutations.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
                                            Data movement tidak ditemukan
                                        </td>
                                    </tr>
                                )}

                                {mutations.data.map((mutation, index) => (
                                    <tr
                                        key={mutation.id}
                                        className="hover:bg-slate-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(mutation.created_at).toLocaleDateString('id-ID')} {' '}
                                            {new Date(mutation.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {mutation.raw_material.name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {mutation.from_warehouse ? 
                                                `From: ${mutation.from_warehouse.name}` : 
                                                `To: ${mutation.to_warehouse.name}`
                                            }
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {mutation.from_warehouse ? (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    OUT
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    IN
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center font-medium">
                                            {mutation.qty}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {mutation.created_by.name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {mutation.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {mutations.links && mutations.links.length > 2 && (
                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                        <nav className="flex items-center justify-between">
                            <div className="text-sm text-slate-700">
                                Menampilkan {mutations.from ?? 1} sampai {mutations.to ?? 0} dari {mutations.total ?? 0} data
                            </div>
                            <div className="flex space-x-2">
                                {mutations.links.map((link, index) => {
                                    if (index === 0 || index === mutations.links.length - 1) return null; // Skip first and last (Prev/Next buttons handled separately)

                                    return (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}