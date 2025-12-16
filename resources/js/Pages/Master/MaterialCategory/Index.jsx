import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function MaterialCategoryIndex({ categories, filters }) {
    const [search, setSearch] = useState(filters?.search || "");

    function submit(e) {
        e.preventDefault();
        router.get(
            "/master/material-categories",
            { search },
            { preserveState: true }
        );
    }

    // Fungsi untuk menghapus kategori
    const deleteCategory = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/master/material-categories/${id}`, {
                onSuccess: () => {
                    // Pesan sukses akan ditampilkan oleh flash message di layout
                }
            });
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Material Category</h1>
                        <p className="text-sm text-gray-600 mt-1">Kelola kategori bahan baku untuk sistem ERP tekstil</p>
                    </div>
                    <Link
                        href="/master/material-categories/create"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                    >
                        + Tambah Kategori
                    </Link>
                </div>

                {/* Search and Filters Section */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <form onSubmit={submit} className="max-w-md">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Cari Kode atau Nama
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Masukkan kode atau nama kategori..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Kode</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Nama Kategori</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.data.length > 0 ? (
                                    categories.data.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 font-mono text-gray-900 whitespace-nowrap">
                                                {category.code}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    category.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {category.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        href={`/master/material-categories/${category.id}/edit`}
                                                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded transition-colors duration-150"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteCategory(category.id)}
                                                        className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded transition-colors duration-150"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Tidak ada data kategori material ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {categories.links && categories.links.length > 2 && (
                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                        <nav className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Menampilkan {categories.from ?? 1} sampai {categories.to ?? 0} dari {categories.total ?? 0} data
                            </div>
                            <div className="flex space-x-2">
                                {categories.links.map((link, index) => {
                                    if (index === 0 || index === categories.links.length - 1) return null; // Skip first and last (Prev/Next buttons handled separately)

                                    return (
                                        <a
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
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
