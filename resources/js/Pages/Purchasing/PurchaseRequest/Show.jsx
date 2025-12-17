import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";

export default function PurchaseRequestShow({ purchaseRequest }) {
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
                            <h1 className="text-xl font-semibold">Detail Purchase Request</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-slate-300">PR: {purchaseRequest.pr_number}</p>
                                <span className={`
                                    px-3 py-1 rounded-full text-sm font-medium
                                    ${purchaseRequest.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${purchaseRequest.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${purchaseRequest.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                    ${purchaseRequest.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                    {purchaseRequest.status === 'draft' && 'Draft'}
                                    {purchaseRequest.status === 'submitted' && 'Submitted'}
                                    {purchaseRequest.status === 'approved' && 'Approved'}
                                    {purchaseRequest.status === 'rejected' && 'Rejected'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <p className="text-slate-300 text-sm">Tanggal Request</p>
                            <p className="font-medium">{new Date(purchaseRequest.request_date).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        {/* PR Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Informasi Purchase Request</h3>
                                <div className="space-y-2">
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">PR Number</div>
                                        <div className="flex-1 font-medium">{purchaseRequest.pr_number}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">Tanggal Request</div>
                                        <div className="flex-1 font-medium">{new Date(purchaseRequest.request_date).toLocaleDateString('id-ID')}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">Diajukan Oleh</div>
                                        <div className="flex-1 font-medium">{purchaseRequest.requested_by.name}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-40 text-sm text-slate-600">Status</div>
                                        <div className="flex-1 font-medium">
                                            <span className={`
                                                px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${purchaseRequest.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${purchaseRequest.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${purchaseRequest.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                ${purchaseRequest.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {purchaseRequest.status === 'draft' && 'Draft'}
                                                {purchaseRequest.status === 'submitted' && 'Submitted'}
                                                {purchaseRequest.status === 'approved' && 'Approved'}
                                                {purchaseRequest.status === 'rejected' && 'Rejected'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-slate-800 mb-3">Catatan</h3>
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-20">
                                    {purchaseRequest.notes || "Tidak ada catatan"}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-slate-800">Item Request</h3>
                                <span className="text-sm text-slate-600">
                                    Total Item: {purchaseRequest.items.length}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">No</th>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">Nama Bahan Baku</th>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">Unit</th>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">Qty</th>
                                            <th className="px-4 py-3 text-left font-medium uppercase tracking-wider">Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {purchaseRequest.items.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{index + 1}</td>
                                                <td className="px-4 py-3 font-medium text-slate-800">{item.raw_material.name}</td>
                                                <td className="px-4 py-3 text-slate-600">{item.raw_material.unit?.name || 'N/A'}</td>
                                                <td className="px-4 py-3 text-slate-600">{item.qty}</td>
                                                <td className="px-4 py-3 text-slate-600">{item.notes || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            <Link
                                href="/purchasing/purchase-requests"
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                            >
                                Kembali
                            </Link>

                            <div className="flex items-center gap-3">
                                {/* Show edit button only for draft status and if user can edit */}
                                {purchaseRequest.status === 'draft' && 
                                    (userRole === 'admin' || userRole === 'manager' || purchaseRequest.requested_by.id === userId) && (
                                    <Link
                                        href={`/purchasing/purchase-requests/${purchaseRequest.id}/edit`}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                    >
                                        Edit
                                    </Link>
                                )}

                                {/* Action buttons for manager */}
                                {userRole === 'manager' && purchaseRequest.status === 'submitted' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (confirm("Approve Purchase Request ini?")) {
                                                    router.patch(`/purchasing/purchase-requests/${purchaseRequest.id}/approve`);
                                                }
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Reject Purchase Request ini?")) {
                                                    router.patch(`/purchasing/purchase-requests/${purchaseRequest.id}/reject`);
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {/* Submit button for draft status (by creator) */}
                                {purchaseRequest.status === 'draft' && purchaseRequest.requested_by.id === userId && (
                                    <button
                                        onClick={() => {
                                            if (confirm("Submit Purchase Request ini untuk approval?")) {
                                                router.patch(`/purchasing/purchase-requests/${purchaseRequest.id}/submit`);
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