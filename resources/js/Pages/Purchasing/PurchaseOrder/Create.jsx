import AppLayout from "@/Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function PurchaseOrderCreate({ purchaseOrder, suppliers, rawMaterials, purchaseRequest }) {
    const { data, setData, post, put, processing, errors } = useForm({
        po_date: purchaseOrder ? purchaseOrder.po_date : new Date().toISOString().split('T')[0],
        supplier_id: purchaseOrder ? purchaseOrder.supplier_id : "",
        purchase_request_id: purchaseRequest ? purchaseRequest.id : "",
        notes: purchaseOrder ? purchaseOrder.notes : "",
        items: purchaseOrder 
            ? purchaseOrder.items.map(item => ({
                raw_material_id: item.raw_material_id,
                qty: item.qty,
                price: item.price,
                notes: item.notes,
                raw_material: item.raw_material
            })) 
            : (purchaseRequest 
                ? purchaseRequest.items.map(item => ({
                    raw_material_id: item.raw_material_id,
                    qty: item.qty,
                    price: "",
                    notes: "",
                    raw_material: item.raw_material
                }))
                : [{ raw_material_id: "", qty: "", price: "", notes: "" }]),
    });

    const [availableRawMaterials] = useState(
        rawMaterials.map(rm => ({
            id: rm.id,
            name: rm.name,
            unit: rm.unitRef?.name || 'N/A'
        }))
    );

    const addItem = () => {
        setData("items", [
            ...data.items,
            { raw_material_id: "", qty: "", price: "", notes: "" }
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
        if (purchaseOrder) {
            put(`/purchasing/purchase-orders/${purchaseOrder.id}`);
        } else {
            post("/purchasing/purchase-orders");
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
                        {purchaseOrder 
                            ? 'Edit Purchase Order' 
                            : purchaseRequest
                                ? 'Buat Purchase Order dari PR'
                                : 'Buat Purchase Order Baru'}
                    </h1>
                    <p className="text-slate-300 mt-1">
                        {purchaseOrder
                            ? 'Ubah informasi Purchase Order sesuai kebutuhan'
                            : purchaseRequest
                                ? 'Buat PO berdasarkan Purchase Request yang disetujui'
                                : 'Silakan isi informasi Purchase Order dengan lengkap'}
                    </p>
                </div>

                {purchaseRequest && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-blue-800">
                                Berdasarkan PR: <strong>{purchaseRequest.pr_number}</strong> - 
                                Supplier: <strong>{purchaseRequest.requested_by.name}</strong>
                            </span>
                        </div>
                    </div>
                )}

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tanggal PO <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.po_date}
                                        onChange={(e) => setData("po_date", e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.po_date && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.po_date}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Supplier <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.supplier_id}
                                        onChange={(e) => setData("supplier_id", e.target.value)}
                                        disabled={!!purchaseRequest}
                                        className={`w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200 ${
                                            purchaseRequest ? 'bg-slate-100 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        <option value="">Pilih Supplier</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.supplier_id}
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Catatan
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData("notes", e.target.value)}
                                        placeholder="Catatan tambahan untuk Purchase Order ini..."
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
                                    <h2 className="text-lg font-medium text-slate-800">Item Purchase Order</h2>
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
                                            <div className="col-span-4">
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
                                                    Harga <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.price || ""}
                                                    onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || "")}
                                                    placeholder="Harga per unit"
                                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                                />
                                                {errors[`items.${index}.price`] && (
                                                    <div className="text-sm text-red-600 mt-1">
                                                        {errors[`items.${index}.price`]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-span-1">
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
                                    href="/purchasing/purchase-orders"
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors duration-200 shadow-sm font-medium"
                                >
                                    {processing ? 'Menyimpan...' : (purchaseOrder ? 'Update' : 'Simpan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}