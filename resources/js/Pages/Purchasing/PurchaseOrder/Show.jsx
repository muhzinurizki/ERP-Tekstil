import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function PurchaseOrderShow({ purchaseOrder }) {
    const { flash = {} } = usePage().props;
    const userRole = usePage().props.auth?.user?.role;
    const userId = usePage().props.auth?.user?.id;

    // Function to format currency in Indonesian format
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate total amount
    const totalAmount = purchaseOrder.items.reduce((sum, item) => {
        return sum + (item.qty * item.price);
    }, 0);

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto">
                {/* ALERT */}
                {flash.success && (
                    <div className="
                      px-4 py-3
                      bg-green-50 border border-green-200
                      text-green-800
                      rounded-lg mb-6
                    ">
                        <span className="text-sm">{flash.success}</span>
                    </div>
                )}

                {/* HEADER */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-semibold">Detail Purchase Order</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-slate-300">PO: {purchaseOrder.po_number}</p>
                                <span className={`
                                    px-3 py-1 rounded-full text-sm font-medium
                                    ${purchaseOrder.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${purchaseOrder.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${purchaseOrder.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                    ${purchaseOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                    {purchaseOrder.status === 'draft' && 'Draft'}
                                    {purchaseOrder.status === 'submitted' && 'Submitted'}
                                    {purchaseOrder.status === 'approved' && 'Approved'}
                                    {purchaseOrder.status === 'cancelled' && 'Cancelled'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <p className="text-slate-300 text-sm">Tanggal PO</p>
                            <p className="font-medium">{new Date(purchaseOrder.po_date).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        {/* PO Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Informasi Purchase Order</h3>
                                <div className="space-y-2">
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">PO Number</div>
                                        <div className="flex-1 font-medium">{purchaseOrder.po_number}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">Tanggal PO</div>
                                        <div className="flex-1 font-medium">{new Date(purchaseOrder.po_date).toLocaleDateString('id-ID')}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">Supplier</div>
                                        <div className="flex-1 font-medium">{purchaseOrder.supplier.name}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">Dibuat Oleh</div>
                                        <div className="flex-1 font-medium">{purchaseOrder.created_by.name}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">Status</div>
                                        <div className="flex-1 font-medium">
                                            <span className={`
                                                px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${purchaseOrder.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${purchaseOrder.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${purchaseOrder.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                ${purchaseOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {purchaseOrder.status === 'draft' && 'Draft'}
                                                {purchaseOrder.status === 'submitted' && 'Submitted'}
                                                {purchaseOrder.status === 'approved' && 'Approved'}
                                                {purchaseOrder.status === 'cancelled' && 'Cancelled'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Catatan</h3>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-20">
                                    {purchaseOrder.notes || "Tidak ada catatan"}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-slate-800">Item Purchase Order</h3>
                                <span className="text-sm text-slate-600">
                                    Total Item: {purchaseOrder.items.length}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">No</th>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">Nama Bahan Baku</th>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">Unit</th>
                                            <th className="px-4 py-3 text-center font-medium uppercase tracking-wider">Qty</th>
                                            <th className="px-4 py-3 text-right font-medium uppercase tracking-wider">Harga</th>
                                            <th className="px-4 py-3 text-right font-medium uppercase tracking-wider">Total</th>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {purchaseOrder.items.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{index + 1}</td>
                                                <td className="px-4 py-3 font-medium text-slate-800">{item.raw_material.name}</td>
                                                <td className="px-4 py-3 text-slate-600">{item.raw_material.unitRef?.name || 'N/A'}</td>
                                                <td className="px-4 py-3 text-slate-600 text-center">{item.qty}</td>
                                                <td className="px-4 py-3 text-slate-600 text-right">{formatCurrency(item.price)}</td>
                                                <td className="px-4 py-3 text-slate-600 text-right font-medium">{formatCurrency(item.qty * item.price)}</td>
                                                <td className="px-4 py-3 text-slate-600">{item.notes || '-'}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 font-semibold">
                                            <td colSpan="5" className="px-4 py-4 text-right">Total</td>
                                            <td className="px-4 py-4 text-right">{formatCurrency(totalAmount)}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            <Link
                                href="/purchasing/purchase-orders"
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                            >
                                Kembali
                            </Link>

                            <div className="flex items-center gap-3">
                                {/* Show edit button only for draft status and if user can edit */}
                                {purchaseOrder.status === 'draft' && 
                                    (userRole === 'admin' || userRole === 'manager' || purchaseOrder.created_by.id === userId) && (
                                    <Link
                                        href={`/purchasing/purchase-orders/${purchaseOrder.id}/edit`}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                    >
                                        Edit
                                    </Link>
                                )}

                                {/* Action buttons for manager */}
                                {userRole === 'manager' && purchaseOrder.status === 'submitted' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (confirm("Approve Purchase Order ini?")) {
                                                    router.patch(`/purchasing/purchase-orders/${purchaseOrder.id}/approve`);
                                                }
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Cancel Purchase Order ini?")) {
                                                    router.patch(`/purchasing/purchase-orders/${purchaseOrder.id}/cancel`);
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}

                                {/* Cancel button for draft status (by creator) */}
                                {purchaseOrder.status === 'draft' && purchaseOrder.created_by.id === userId && (
                                    <button
                                        onClick={() => {
                                            if (confirm("Cancel Purchase Order ini?")) {
                                                router.patch(`/purchasing/purchase-orders/${purchaseOrder.id}/cancel`);
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}

                                {/* Submit button for draft status (by creator) */}
                                {purchaseOrder.status === 'draft' && purchaseOrder.created_by.id === userId && (
                                    <button
                                        onClick={() => {
                                            if (confirm("Submit Purchase Order ini untuk approval?")) {
                                                router.patch(`/purchasing/purchase-orders/${purchaseOrder.id}/submit`);
                                            }
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}