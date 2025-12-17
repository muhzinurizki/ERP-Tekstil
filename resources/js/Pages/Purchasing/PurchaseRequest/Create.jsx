import AppLayout from "@/Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function PurchaseRequestCreate({ purchaseRequest, rawMaterials }) {
    const { data, setData, post, put, processing, errors } = useForm({
        request_date: purchaseRequest ? purchaseRequest.request_date : new Date().toISOString().split('T')[0],
        notes: purchaseRequest ? purchaseRequest.notes : "",
        items: purchaseRequest ? purchaseRequest.items.map(item => ({
            raw_material_id: item.raw_material_id,
            qty: item.qty,
            notes: item.notes,
            raw_material: item.raw_material
        })) : [{ raw_material_id: "", qty: "", notes: "" }],
    });

    const [availableRawMaterials] = useState(
        rawMaterials.map(rm => ({
            id: rm.id,
            name: rm.name,
            unit: rm.unit?.name || 'N/A'
        }))
    );

    const addItem = () => {
        setData("items", [
            ...data.items,
            { raw_material_id: "", qty: "", notes: "" }
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const newItems = [...data.items];
            newItems.splice(index, 1);
            setData("items", newItems);
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData("items", newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (purchaseRequest) {
            put(`/purchasing/purchase-requests/${purchaseRequest.id}`);
        } else {
            post("/purchasing/purchase-requests");
        }
    };

    // Get raw material name by ID
    const getRawMaterialName = (id) => {
        const rm = availableRawMaterials.find(rm => rm.id === parseInt(id));
        return rm ? rm.name : 'Pilih Bahan Baku';
    };

    // Get unit by raw material ID
    const getUnitByMaterialId = (id) => {
        const rm = availableRawMaterials.find(rm => rm.id === parseInt(id));
        return rm ? rm.unit : '';
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 mb-6">
                    <h1 className="text-xl font-semibold">
                        {purchaseRequest ? 'Edit Purchase Request' : 'Buat Purchase Request Baru'}
                    </h1>
                    <p className="text-slate-300 mt-1">
                        {purchaseRequest 
                            ? 'Ubah informasi Purchase Request sesuai kebutuhan'
                            : 'Silakan isi informasi Purchase Request dengan lengkap'}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tanggal Request <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.request_date}
                                        onChange={(e) => setData("request_date", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.request_date && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.request_date}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Catatan
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData("notes", e.target.value)}
                                        placeholder="Catatan tambahan untuk Purchase Request ini..."
                                        rows="2"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.notes && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.notes}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="border-t border-slate-100 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-slate-800">Item Request</h2>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors duration-200"
                                    >
                                        + Tambah Item
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 items-end">
                                            <div className="col-span-5">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Bahan Baku <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={item.raw_material_id}
                                                    onChange={(e) => updateItem(index, "raw_material_id", parseInt(e.target.value))}
                                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                                >
                                                    <option value="">Pilih Bahan Baku</option>
                                                    {availableRawMaterials.map(rm => (
                                                        <option key={rm.id} value={rm.id}>
                                                            {rm.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`items.${index}.raw_material_id`] && (
                                                    <div className="text-sm text-red-600 mt-1">
                                                        {errors[`items.${index}.raw_material_id`]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Qty <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={item.qty}
                                                    onChange={(e) => updateItem(index, "qty", parseFloat(e.target.value) || "")}
                                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                                />
                                                {errors[`items.${index}.qty`] && (
                                                    <div className="text-sm text-red-600 mt-1">
                                                        {errors[`items.${index}.qty`]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Unit
                                                </label>
                                                <input
                                                    type="text"
                                                    value={getUnitByMaterialId(item.raw_material_id) || ""}
                                                    readOnly
                                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-slate-50 cursor-not-allowed"
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Catatan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.notes || ""}
                                                    onChange={(e) => updateItem(index, "notes", e.target.value)}
                                                    placeholder="Catatan..."
                                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                                />
                                            </div>

                                            <div className="col-span-1 flex justify-center">
                                                {data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                                <Link
                                    href="/purchasing/purchase-requests"
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors duration-200 shadow-sm font-medium"
                                >
                                    {processing ? 'Menyimpan...' : (purchaseRequest ? 'Update' : 'Simpan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}