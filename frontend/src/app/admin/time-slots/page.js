"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimeSlotsPage() {
    const [slots, setSlots] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ dayOfWeek: 0, startTime: '09:00', endTime: '10:00', maxBookings: 5 });
    const [editingId, setEditingId] = useState(null);
    const [newBlocked, setNewBlocked] = useState({ date: '', reason: '' });

    const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

    const fetchSlots = async () => {
        try {
            const [s, b] = await Promise.all([
                fetch(`${API}/api/time-slots`, { headers: headers() }).then(r => r.json()),
                fetch(`${API}/api/time-slots/blocked`, { headers: headers() }).then(r => r.json()),
            ]);
            setSlots(s); setBlockedDates(b);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchSlots(); }, []);

    const saveSlot = async (e) => {
        e.preventDefault();
        const url = editingId ? `${API}/api/time-slots/${editingId}` : `${API}/api/time-slots`;
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(form) });
        const data = await res.json();
        if (data.success || data.data) { setShowForm(false); setEditingId(null); fetchSlots(); } else alert(data.error || 'Failed');
    };

    const deleteSlot = async (id) => { if (!confirm('Delete?')) return; await fetch(`${API}/api/time-slots/${id}`, { method: 'DELETE', headers: headers() }); fetchSlots(); };

    const addBlocked = async () => {
        if (!newBlocked.date) return;
        await fetch(`${API}/api/time-slots/blocked`, { method: 'POST', headers: headers(), body: JSON.stringify(newBlocked) });
        setNewBlocked({ date: '', reason: '' });
        fetchSlots();
    };

    const removeBlocked = async (id) => {
        await fetch(`${API}/api/time-slots/blocked/${id}`, { method: 'DELETE', headers: headers() });
        fetchSlots();
    };

    const toggleSlotActive = async (slot) => {
        await fetch(`${API}/api/time-slots/${slot._id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ isActive: !slot.isActive }) });
        fetchSlots();
    };

    // Group slots by day
    const slotsByDay = DAYS.map((day, i) => ({ day, dayIndex: i, slots: slots.filter(s => s.dayOfWeek === i) }));

    return (
        <div className="animate-in fade-in">
            <header className="mb-6 flex justify-between items-center">
                <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Time Slots</h1><p className="text-sm text-gray-500">Manage booking availability</p></div>
                <button onClick={() => { setForm({ dayOfWeek: 0, startTime: '09:00', endTime: '10:00', maxBookings: 5 }); setEditingId(null); setShowForm(true); }}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">+ Add Slot</button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {slotsByDay.map(({ day, dayIndex, slots: daySlots }) => (
                        <div key={dayIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 font-semibold text-sm text-gray-700 dark:text-gray-300">{day}</div>
                            {daySlots.length > 0 ? (
                                <div className="divide-y dark:divide-gray-700">
                                    {daySlots.map(s => (
                                        <div key={s._id} className="p-3 flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium text-gray-900 dark:text-white">{s.startTime} - {s.endTime}</span>
                                                <span className="text-gray-500">Max: {s.maxBookings}</span>
                                                <button onClick={() => toggleSlotActive(s)} className={`px-2 py-0.5 rounded-full text-xs ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.isActive ? 'Active' : 'Inactive'}</button>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setForm({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, maxBookings: s.maxBookings }); setEditingId(s._id); setShowForm(true); }} className="text-blue-500 text-xs">Edit</button>
                                                <button onClick={() => deleteSlot(s._id)} className="text-red-500 text-xs">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="p-3 text-xs text-gray-400">No slots</p>}
                        </div>
                    ))}
                </div>

                {/* Blocked Dates */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden h-fit">
                    <div className="p-4 border-b dark:border-gray-700 font-semibold text-gray-900 dark:text-white">Blocked Dates</div>
                    <div className="p-4 space-y-3">
                        <div className="flex gap-2">
                            <input type="date" value={newBlocked.date} onChange={e => setNewBlocked({ ...newBlocked, date: e.target.value })}
                                className="flex-1 border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <button onClick={addBlocked} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Block</button>
                        </div>
                        <input placeholder="Reason (optional)" value={newBlocked.reason} onChange={e => setNewBlocked({ ...newBlocked, reason: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <div className="space-y-2 mt-3">
                            {blockedDates.map(bd => (
                                <div key={bd._id} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                                    <div>
                                        <span className="font-medium text-red-700 dark:text-red-400">{bd.date}</span>
                                        {bd.reason && <span className="text-gray-500 ml-2 text-xs">({bd.reason})</span>}
                                    </div>
                                    <button onClick={() => removeBlocked(bd._id)} className="text-red-500 text-xs hover:underline">Remove</button>
                                </div>
                            ))}
                            {!blockedDates.length && <p className="text-xs text-gray-400">No blocked dates</p>}
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 dark:text-white">{editingId ? 'Edit' : 'Add'} Time Slot</h3>
                        <form onSubmit={saveSlot} className="space-y-3">
                            <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <input type="number" placeholder="Max bookings" value={form.maxBookings} onChange={e => setForm({ ...form, maxBookings: parseInt(e.target.value) || 1 })} className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            <div className="flex justify-end gap-3"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded-lg dark:border-gray-600">Cancel</button><button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg">Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
