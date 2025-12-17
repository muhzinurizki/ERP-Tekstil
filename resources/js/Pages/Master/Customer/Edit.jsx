import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";

export default function CustomerEdit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || "",
        contact: customer.contact || "",
        address: customer.address || "",
    });

    function submit(e) {
        e.preventDefault();
        put(`/master/customers/${customer.id}`);
    }

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 mb-6">
                    <h1 className="text-xl font-semibold">Edit Customer</h1>
                    <p className="text-slate-300 mt-1">Ubah informasi customer sesuai kebutuhan</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nama Customer <span className="text-red-500">*</span>
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
                                        Kontak
                                    </label>
                                    <input
                                        value={data.contact}
                                        onChange={(e) => setData("contact", e.target.value)}
                                        placeholder="Masukkan nomor telepon atau email customer"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.contact && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.contact}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Alamat
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                        placeholder="Alamat lengkap customer (opsional)"
                                        rows="3"
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-200"
                                    />
                                    {errors.address && (
                                        <div className="text-sm text-red-600 mt-1">
                                            {errors.address}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Link
                                    href="/master/customers"
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
