import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function RawMaterialIndex({ materials, filters }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [showAlert, setShowAlert] = useState(true);

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            "/master/raw-materials",
            { search },
            { preserveState: true, replace: true }
        );
    }

    function handleDelete(id) {
        if (!confirm("Hapus raw material ini?")) return;
        router.delete(`/master/raw-materials/${id}`);
    }

    const rows = materials.data || [];

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* ALERT */}
                {flash.success && showAlert && (
                    <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
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
                            Raw Material Management
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Kelola bahan baku yang digunakan dalam proses produksi
                        </p>
                    </div>

                    <Link
                        href="/master/raw-materials/create"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors duration-200"
                    >
                        + Tambah Material
                    </Link>
                </div>

                {/* SEARCH */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode, nama, atau unit..."
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors duration-200"
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
                                    <th className="px-6 py-3 w-12">No</th>
                                    <th className="px-6 py-3">Kode</th>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Unit</th>
                                    <th className="px-6 py-3">Min Stock</th>
                                    <th className="px-6 py-3 text-center w-40">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {rows.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
                                            Data raw material tidak ditemukan
                                        </td>
                                    </tr>
                                )}

                                {rows.map((m, i) => (
                                    <tr
                                        key={m.id}
                                        className="hover:bg-slate-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 text-slate-500">
                                            {(materials.from ?? 1) + i}
                                        </td>
                                        <td className="px-6 py-4 font-mono">
                                            {m.code}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {m.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {m.category?.name || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {m.unitRef?.code || m.unit || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {m.min_stock !== null
                                                ? Number(m.min_stock).toLocaleString()
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/master/raw-materials/${m.id}/edit`}
                                                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded transition-colors duration-150"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(m.id)
                                                    }
                                                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded transition-colors duration-150"
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

                    {/* PAGINATION */}
                    {materials.links && (
                        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-slate-200 text-sm">
                            <div className="text-slate-600 mb-2 sm:mb-0">
                                Menampilkan {materials.from} – {materials.to} dari{" "}
                                {materials.total} data
                            </div>
                            <div className="flex gap-2">
                                {materials.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {},
                                                { preserveState: true }
                                            )
                                        }
                                        className={`px-3 py-1.5 rounded-md ${
                                            link.active
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        } ${
                                            !link.url
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
