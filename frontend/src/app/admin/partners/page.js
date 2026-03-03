"use client";

import { useState, useEffect } from "react";

export default function DeliveryPartnersPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const fetchPartners = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/partners`);
            const data = await res.json();
            setPartners(data);
        } catch (err) {
            console.error("Failed to fetch partners:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleAddPartner = async (e) => {
        e.preventDefault();
        setAdding(true);
        setErrorMsg("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/partners`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setFormData({ name: "", email: "" });
                setIsModalOpen(false);
                await fetchPartners();
                if (data.warning) {
                    alert("Partner added, but email failed: " + data.warning);
                } else {
                    alert("Partner added and credentials emailed successfully!");
                }
            } else {
                setErrorMsg(data.error || "Failed to add partner");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Server error adding partner");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Partners</h1>
                    <p className="text-sm text-gray-500">Manage delivery boys and their account access.</p>
                </div>
                <button
                    onClick={() => { setErrorMsg(""); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Partner
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {partners.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No delivery partners configured yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                    <th className="p-4">Partner Name</th>
                                    <th className="p-4">Email Address</th>
                                    <th className="p-4">Created On</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {partners.map(partner => (
                                    <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                {partner.name.charAt(0)}
                                            </div>
                                            {partner.name}
                                        </td>
                                        <td className="p-4 text-gray-600">{partner.email}</td>
                                        <td className="p-4 text-gray-500">{new Date(partner.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${partner.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                {partner.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD PARTNER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !adding && setIsModalOpen(false)}></div>
                    <div className="relative bg-white border border-gray-200 w-full max-w-md rounded-2xl shadow-2xl flex flex-col z-10 animate-fade-in-up">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Add Delivery Partner</h3>
                            <button
                                onClick={() => !adding && setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6">
                                Enter the partner's details. A temporary password will be auto-generated and sent directly to their email.
                            </p>

                            {errorMsg && (
                                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-medium border border-red-100 mb-4">
                                    {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleAddPartner} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="e.g. Ramesh Kumar"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="delivery@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        disabled={adding}
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={adding}
                                        className="flex-1 px-4 py-2.5 bg-primary text-white hover:bg-primary-dark font-medium rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {adding ? "Creating..." : "Add & Send Email"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
