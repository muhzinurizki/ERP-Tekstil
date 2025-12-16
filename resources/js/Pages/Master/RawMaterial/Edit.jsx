import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";

export default function RawMaterialEdit({ rawMaterial, categories, units }) {
    const { data, setData, put, processing, errors } = useForm({
        material_category_id: rawMaterial.material_category_id || "",
        unit_id: rawMaterial.unit_id || "",
        name: rawMaterial.name || "",
        min_stock:
            rawMaterial.min_stock !== null
                ? Number(rawMaterial.min_stock)
                : "",
    });

    function submit(e) {
        e.preventDefault();
        put(`/master/raw-materials/${rawMaterial.id}`);
    }

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 mb-6">
                    <h1 className="text-xl font-semibold">Edit Raw Material</h1>
                    <p className="text-slate-300 mt-1">Ubah informasi raw material sesuai kebutuhan</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* READ ONLY CODE */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Kode Material
                                    </label>
                                    <input
                                        value={rawMaterial.code}
                                        disabled
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-500"
                                    />
                                </div>

                                {/* MATERIAL CATEGORY */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Material Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.material_category_id}
                                        onChange={(e) => setData("material_category_id", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    >
                                        <option value="">-- Pilih Category --</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.code} - {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.material_category_id && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.material_category_id}
                                        </div>
                                    )}
                                </div>

                                {/* NAME */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nama Material <span className="text-red-500">*</span>
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

                                {/* UNIT */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Unit <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.unit_id}
                                        onChange={(e) => setData("unit_id", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    >
                                        <option value="">-- Pilih Unit --</option>
                                        {units.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.code})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unit_id && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.unit_id}
                                        </div>
                                    )}
                                </div>

                                {/* MIN STOCK */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Min Stock
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.min_stock}
                                        onChange={(e) => setData("min_stock", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.min_stock && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.min_stock}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Link
                                    href="/master/raw-materials"
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