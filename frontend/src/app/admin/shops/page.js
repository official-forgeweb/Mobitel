"use client";

import { useState, useEffect } from "react";

export default function ShopsAdminPage() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contact: "",
    });

    const fetchShops = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/shops");
            const data = await res.json();
            setShops(data);
        } catch (err) {
            console.error("Failed to fetch shops:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleAddShop = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await fetch("http://localhost:5000/api/shops", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ name: "", address: "", contact: "" });
                await fetchShops();
            } else {
                alert("Failed to add shop.");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding shop.");
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteShop = async (id) => {
        if (!confirm("Are you sure you want to delete this shop?")) return;
        setDeleting(id);
        try {
            const res = await fetch(`http://localhost:5000/api/shops/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setShops(shops.filter((s) => s.id !== id));
            } else {
                alert("Failed to delete shop.");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting shop.");
        } finally {
            setDeleting(null);
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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Shops Management</h1>
                <p className="text-sm text-gray-500">Add or remove shop locations for repair bookings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ADD SHOP FORM */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Shop</h2>
                        <form onSubmit={handleAddShop} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    placeholder="e.g. Mobitel - Connaught Place"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                                    placeholder="Block A, Inner Circle..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Details</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                    placeholder="+91-XXXXX-XXXXX / 10 AM - 8 PM"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {adding ? "Adding..." : "Add Shop"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* SHOPS LIST */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="text-lg font-bold text-gray-800">Current Shops ({shops.length})</h2>
                        </div>

                        {shops.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No shops configured yet. Add one from the sidebar.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {shops.map((shop) => (
                                    <li key={shop.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4 items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{shop.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2 flex items-start gap-1.5">
                                                <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {shop.address}
                                            </p>
                                            {shop.contact && (
                                                <p className="text-sm text-gray-500 inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {shop.contact}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteShop(shop.id)}
                                            disabled={deleting === shop.id}
                                            className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            {deleting === shop.id ? "Deleting..." : "Delete"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
