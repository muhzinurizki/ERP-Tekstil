import AppLayout from "@/Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";

export default function StockAdjust({ warehouses, rawMaterials }) {
    const { data, setData, post, processing, errors } = useForm({
        warehouse_id: "",
        item_type: "raw_material",
        item_id: "",
        type: "in",
        qty: "",
        reference_type: "",
        reference_id: "",
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/inventory/stocks/adjust");
    };

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 mb-6">
                    <h1 className="text-xl font-semibold">Adjust Stock</h1>
                    <p className="text-slate-300 mt-1">
                        Tambah atau kurangi jumlah stok bahan baku
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Warehouse <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.warehouse_id}
                                        onChange={(e) => setData("warehouse_id", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    >
                                        <option value="">Pilih Warehouse</option>
                                        {warehouses.map(warehouse => (
                                            <option key={warehouse.id} value={warehouse.id}>
                                                {warehouse.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.warehouse_id && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.warehouse_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tipe Barang <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value="Bahan Baku"
                                        readOnly
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-slate-50 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Bahan Baku <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.item_id}
                                        onChange={(e) => setData("item_id", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    >
                                        <option value="">Pilih Bahan Baku</option>
                                        {rawMaterials.map(material => (
                                            <option key={material.id} value={material.id}>
                                                {material.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.item_id && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.item_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Jenis Adjustment <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData("type", "in")}
                                            className={`py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                data.type === "in"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            Penambahan (IN)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData("type", "out")}
                                            className={`py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                data.type === "out"
                                                    ? "bg-red-600 text-white"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            Pengurangan (OUT)
                                        </button>
                                    </div>
                                    {errors.type && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.type}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Jumlah <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={data.qty}
                                        onChange={(e) => setData("qty", parseFloat(e.target.value) || "")}
                                        placeholder="Masukkan jumlah"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.qty && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.qty}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tipe Referensi
                                    </label>
                                    <select
                                        value={data.reference_type}
                                        onChange={(e) => setData("reference_type", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    >
                                        <option value="">Tidak Ada</option>
                                        <option value="manual">Manual</option>
                                        <option value="pr">Purchase Request</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        ID Referensi
                                    </label>
                                    <input
                                        type="number"
                                        value={data.reference_id || ""}
                                        onChange={(e) => setData("reference_id", e.target.value ? parseInt(e.target.value) : "")}
                                        placeholder="Masukkan ID referensi (jika ada)"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Catatan
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData("notes", e.target.value)}
                                        placeholder="Catatan tambahan untuk adjustment ini..."
                                        rows="3"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                                <Link
                                    href="/inventory/stocks"
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors duration-200 shadow-sm font-medium"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Adjustment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}