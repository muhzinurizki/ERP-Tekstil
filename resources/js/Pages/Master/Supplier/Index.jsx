import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function SupplierIndex({ suppliers, filters }) {
    const { flash = {} } = usePage().props;

    const [search, setSearch] = useState(filters.search || "");
    const [showAlert, setShowAlert] = useState(true);

    function handleSearch(e) {
        e.preventDefault();

        router.get(
            "/master/suppliers",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    function handleDelete(id) {
        if (!confirm("Hapus supplier ini?")) return;
        router.delete(`/master/suppliers/${id}`);
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
                            Supplier Management
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Kelola informasi supplier yang digunakan dalam proses operasional
                        </p>
                    </div>

                    <Link
                        href="/master/suppliers/create"
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
                        + Tambah Supplier
                    </Link>
                </div>

                {/* SEARCH */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                        <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
                            Cari Supplier
                        </label>
                        <div className="relative w-full">
                            <input
                                id="search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau kontak supplier..."
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
                        <button
                            type="submit"
                            className="
                              px-4 py-2
                              bg-slate-100 text-slate-700
                              text-sm font-medium
                              rounded-lg
                              hover:bg-slate-200
                              transition-colors duration-200
                            "
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Nama Supplier</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Alamat</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {suppliers.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
                                            Data supplier tidak ditemukan
                                        </td>
                                    </tr>
                                )}

                                {suppliers.data.map((s, index) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-slate-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {s.name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {s.contact || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {s.address || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/master/suppliers/${s.id}/edit`}
                                                    className="
                                                      text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded transition-colors duration-150
                                                    "
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(s.id)}
                                                    className="
                                                      text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded transition-colors duration-150
                                                    "
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {suppliers.links && suppliers.links.length > 2 && (
                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                        <nav className="flex items-center justify-between">
                            <div className="text-sm text-slate-700">
                                Menampilkan {suppliers.from ?? 1} sampai {suppliers.to ?? 0} dari {suppliers.total ?? 0} data
                            </div>
                            <div className="flex space-x-2">
                                {suppliers.links.map((link, index) => {
                                    if (index === 0 || index === suppliers.links.length - 1) return null; // Skip first and last (Prev/Next buttons handled separately)

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
