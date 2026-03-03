"use client";

import { useState, useEffect } from "react";

export default function RequestsAdminPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/requests`);
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdating(id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/requests/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating status.");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Completed": return "bg-green-100 text-green-800 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Repair Requests</h1>
                <p className="text-sm text-gray-500">View and manage customer repair bookings.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {requests.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No repair requests found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                    <th className="p-4">ID / Date</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Device & Issue</th>
                                    <th className="p-4">Service Details</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 align-top">
                                            <div className="font-medium text-gray-900">#{req.id.toString().slice(-6)}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top max-w-[200px]">
                                            <div className="font-semibold text-gray-900 truncate">{req.customerName || "N/A"}</div>
                                            <div className="text-gray-500 mt-0.5">{req.phone || "N/A"}</div>
                                        </td>
                                        <td className="p-4 align-top max-w-[250px]">
                                            <div className="font-medium text-gray-900 truncate">{req.brand} {req.model}</div>
                                            <div className="text-red-600 text-xs font-semibold mt-1 bg-red-50 inline-block px-2 py-0.5 rounded">
                                                {req.issue}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top max-w-[250px]">
                                            <div className="font-medium text-gray-900 capitalize flex items-center gap-1.5">
                                                {req.serviceType === 'home' ? '🏠 Home Service' : '🏪 Shop Visit'}
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                {req.preferredDate} at {req.preferredTime}
                                            </div>
                                            {req.serviceType === 'home' && (
                                                <div className="text-gray-400 text-xs mt-1 truncate" title={req.address}>
                                                    {req.address} - {req.pincode}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top text-right space-x-2">
                                            <select
                                                className="border border-gray-300 rounded text-xs px-2 py-1.5 bg-white focus:ring-1 focus:ring-primary outline-none inline-block disabled:opacity-50"
                                                value={req.status}
                                                onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                                disabled={updating === req.id}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
