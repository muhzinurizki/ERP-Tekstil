import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function PurchaseRequestIndex({ purchaseRequests, filters }) {
    const { flash = {} } = usePage().props;

    const [search, setSearch] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");
    const [showAlert, setShowAlert] = useState(true);

    function handleSearch(e) {
        e.preventDefault();

        router.get(
            "/purchasing/purchase-requests",
            { search, status: statusFilter },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    function handleDelete(id) {
        if (!confirm("Hapus Purchase Request ini?")) return;
        router.delete(`/purchasing/purchase-requests/${id}`);
    }

    // Get user role to determine actions
    const userRole = usePage().props.auth?.user?.role;

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
                            Purchase Request Management
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Kelola permintaan pembelian bahan baku untuk produksi tekstil
                        </p>
                    </div>

                    <Link
                        href="/purchasing/purchase-requests/create"
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
                        + Buat Purchase Request
                    </Link>
                </div>

                {/* FILTERS */}
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
                                Cari PR Number
                            </label>
                            <div className="relative">
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari PR number..."
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
                        </div>

                        <div className="w-full md:w-48">
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="
                                  w-full
                                  border border-slate-300 rounded-lg
                                  px-4 py-2 text-sm
                                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                  shadow-sm
                                "
                            >
                                <option value="">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="submitted">Submitted</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="
                                  w-full md:w-auto
                                  px-4 py-2
                                  bg-slate-100 text-slate-700
                                  text-sm font-medium
                                  rounded-lg
                                  hover:bg-slate-200
                                  transition-colors duration-200
                                "
                            >
                                Filter
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">PR Number</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Diajukan Oleh</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Jumlah Item</th>
                                    <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                                {purchaseRequests.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-8 text-center text-slate-500"
                                        >
                                            Data Purchase Request tidak ditemukan
                                        </td>
                                    </tr>
                                )}

                                {purchaseRequests.data.map((pr, index) => (
                                    <tr
                                        key={pr.id}
                                        className="hover:bg-slate-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {pr.pr_number}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(pr.request_date).toLocaleDateString('id-ID')}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {pr.requested_by.name}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`
                                                px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${pr.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${pr.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${pr.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                ${pr.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {pr.status === 'draft' && 'Draft'}
                                                {pr.status === 'submitted' && 'Submitted'}
                                                {pr.status === 'approved' && 'Approved'}
                                                {pr.status === 'rejected' && 'Rejected'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {pr.items.length}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/purchasing/purchase-requests/${pr.id}`}
                                                    className="
                                                      text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded transition-colors duration-150
                                                    "
                                                >
                                                    Detail
                                                </Link>

                                                {/* Show edit button only for draft status and if user can edit */}
                                                {pr.status === 'draft' && 
                                                    (userRole === 'admin' || userRole === 'manager' || pr.requested_by.id === usePage().props.auth.user.id) && (
                                                    <Link
                                                        href={`/purchasing/purchase-requests/${pr.id}/edit`}
                                                        className="
                                                          text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded transition-colors duration-150
                                                        "
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                                {/* Action buttons for manager */}
                                                {userRole === 'manager' && pr.status === 'submitted' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("Approve Purchase Request ini?")) {
                                                                    router.patch(`/purchasing/purchase-requests/${pr.id}/approve`);
                                                                }
                                                            }}
                                                            className="
                                                              text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded transition-colors duration-150
                                                            "
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("Reject Purchase Request ini?")) {
                                                                    router.patch(`/purchasing/purchase-requests/${pr.id}/reject`);
                                                                }
                                                            }}
                                                            className="
                                                              text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded transition-colors duration-150
                                                            "
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {/* Submit button for draft status (by creator) */}
                                                {pr.status === 'draft' && pr.requested_by.id === usePage().props.auth.user.id && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("Submit Purchase Request ini untuk approval?")) {
                                                                router.patch(`/purchasing/purchase-requests/${pr.id}/submit`);
                                                            }
                                                        }}
                                                        className="
                                                          text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded transition-colors duration-150
                                                        "
                                                    >
                                                        Submit
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {purchaseRequests.links && purchaseRequests.links.length > 2 && (
                    <div className="bg-white p-4 border rounded-xl shadow-sm">
                        <nav className="flex items-center justify-between">
                            <div className="text-sm text-slate-700">
                                Menampilkan {purchaseRequests.from ?? 1} sampai {purchaseRequests.to ?? 0} dari {purchaseRequests.total ?? 0} data
                            </div>
                            <div className="flex space-x-2">
                                {purchaseRequests.links.map((link, index) => {
                                    if (index === 0 || index === purchaseRequests.links.length - 1) return null; // Skip first and last (Prev/Next buttons handled separately)

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