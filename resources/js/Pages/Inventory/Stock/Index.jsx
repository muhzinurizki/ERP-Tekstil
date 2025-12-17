import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function StockIndex({ stocks, warehouses, filters, canAdjust, canView }) {
    const { flash = {} } = usePage().props;

    const [search, setSearch] = useState(filters?.search || "");
    const [warehouseFilter, setWarehouseFilter] = useState(filters?.warehouse_id || "");
    const [showAlert, setShowAlert] = useState(true);

    function handleSearch(e) {
        e.preventDefault();

        router.get(
            "/inventory/stocks",
            { search, warehouse_id: warehouseFilter },
            {
                preserveState: true,
                replace: true,
            }
        );
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
                            Inventory Management
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Monitor stok bahan baku di setiap warehouse
                        </p>
                    </div>

                    {canAdjust && (
                        <Link
                            href="/inventory/stocks/adjust"
                            className="
                              inline-flex items-center
                              px-4 py-2
                              bg-indigo-600 text-white
                              rounded-lg text-sm font-medium
                              hover:bg-indigo-700
                              shadow-sm
                              transition-colors duration-200
                            "
                        >
                            + Adjust Stock
                        </Link>
                    )}
                </div>

                {/* FILTERS */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
                                Cari Bahan Baku
                            </label>
                            <div className="relative">
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama bahan baku..."
                                    className="
                                      w-full
                                      border border-slate-300 rounded-lg
                                      px-4 py-2 pr-10 text-sm
                                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                      shadow-sm
                                    "
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
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
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Warehouse</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Bahan Baku</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Unit</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Stok Saat Ini</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Min Stok</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {stocks.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
                                            Data stok tidak ditemukan
                                        </td>
                                    </tr>
                                )}

                                {stocks.data.map((stock, index) => (
                                    <tr
                                        key={stock.id}
                                        className={`hover:bg-slate-50 transition-colors duration-150 ${
                                            stock.qty < stock.raw_material.min_stock ? 'bg-red-50' : ''
                                        }`}
                                    >
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {stock.warehouse.name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {stock.raw_material.name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {stock.raw_material.unitRef?.name || 'N/A'}
                                        </td>

                                        <td className="px-6 py-4 text-center font-medium">
                                            {stock.qty}
                                        </td>

                                        <td className="px-6 py-4 text-center text-slate-600">
                                            {stock.raw_material.min_stock}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {stock.qty < stock.raw_material.min_stock ? (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Aman
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {stocks.links && stocks.links.length > 2 && (
                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                        <nav className="flex items-center justify-between">
                            <div className="text-sm text-slate-700">
                                Menampilkan {stocks.from ?? 1} sampai {stocks.to ?? 0} dari {stocks.total ?? 0} data
                            </div>
                            <div className="flex space-x-2">
                                {stocks.links.map((link, index) => {
                                    if (index === 0 || index === stocks.links.length - 1) return null; // Skip first and last (Prev/Next buttons handled separately)

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