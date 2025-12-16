import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";

export default function MaterialCategoryEdit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        code: category.code || "",
        name: category.name || "",
        description: category.description || "",
        is_active: category.is_active || false,
    });

    function submit(e) {
        e.preventDefault();
        put(`/master/material-categories/${category.id}`);
    }

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 mb-6">
                    <h1 className="text-xl font-semibold">Edit Kategori Material</h1>
                    <p className="text-slate-300 mt-1">Ubah informasi kategori material sesuai kebutuhan</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Kode Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={data.code}
                                        onChange={(e) => setData("code", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.code && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.code}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nama Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.name && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Deskripsi kategori (opsional)"
                                        rows="3"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.description && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Status
                                    </label>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                value="1"
                                                checked={data.is_active === true}
                                                onChange={() => setData("is_active", true)}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-slate-700">Aktif</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                value="0"
                                                checked={data.is_active === false}
                                                onChange={() => setData("is_active", false)}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-slate-700">Tidak Aktif</span>
                                        </label>
                                    </div>
                                    {errors.is_active && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.is_active}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Link
                                    href="/master/material-categories"
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
    );
}