"use client"
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
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
                <div><h1 className="text-2xl font-bold text-gray-900">Time Slots</h1><p className="text-sm text-gray-500">Manage booking availability</p></div>
                <button onClick={() => { setForm({ dayOfWeek: 0, startTime: '09:00', endTime: '10:00', maxBookings: 5 }); setEditingId(null); setShowForm(true); }}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-all">+ Add Slot</button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {slotsByDay.map(({ day, dayIndex, slots: daySlots }) => (
                        <div key={dayIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-3 bg-gray-50 font-semibold text-sm text-gray-700">{day}</div>
                            {daySlots.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {daySlots.map(s => (
                                        <div key={s._id} className="p-3 flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium text-gray-900 font-mono tracking-tight">{s.startTime} - {s.endTime}</span>
                                                <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs">Max: {s.maxBookings}</span>
                                                <button onClick={() => toggleSlotActive(s)} 
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${s.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                                    {s.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => { setForm({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, maxBookings: s.maxBookings }); setEditingId(s._id); setShowForm(true); }} 
                                                    className="text-primary hover:text-primary/80 font-medium text-xs">Edit</button>
                                                <button onClick={() => deleteSlot(s._id)} 
                                                    className="text-red-500 hover:text-red-600 font-medium text-xs">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="p-3 text-xs text-gray-400 italic">No slots scheduled for this day</p>}
                        </div>
                    ))}
                </div>

                {/* Blocked Dates */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
                    <div className="p-4 border-b border-gray-100 font-bold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Blocked Dates
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add Blocked Date</label>
                            <div className="flex gap-2">
                                <input type="date" value={newBlocked.date} onChange={e => setNewBlocked({ ...newBlocked, date: e.target.value })}
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                <button onClick={addBlocked} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 shadow-sm">Block</button>
                            </div>
                            <input placeholder="Reason (e.g., Holiday, Personal)" value={newBlocked.reason} onChange={e => setNewBlocked({ ...newBlocked, reason: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        
                        <div className="space-y-2 mt-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Currently Blocked</label>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {blockedDates.map(bd => (
                                    <div key={bd._id} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg group">
                                        <div>
                                            <p className="font-bold text-red-700 text-sm">{bd.date}</p>
                                            {bd.reason && <p className="text-red-600/70 text-xs">{bd.reason}</p>}
                                        </div>
                                        <button onClick={() => removeBlocked(bd._id)} 
                                            className="text-red-400 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))}
                                {!blockedDates.length && <p className="text-center py-4 text-xs text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">No blocked dates scheduled</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} Time Slot</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={saveSlot} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Day of Week</label>
                                <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })} 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Start Time</label>
                                    <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} 
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">End Time</label>
                                    <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} 
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Max Parallel Bookings</label>
                                <input type="number" placeholder="e.g., 5" value={form.maxBookings} onChange={e => setForm({ ...form, maxBookings: parseInt(e.target.value) || 1 })} 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} 
                                    className="flex-1 px-4 py-3 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all">Cancel</button>
                                <button type="submit" 
                                    className="flex-2 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                    {editingId ? 'Update' : 'Create'} Slot
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
