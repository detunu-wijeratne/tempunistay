import './LandlordBookings.css';
import { useState, useEffect } from 'react';
import { Check, X, Eye, Search, AlertCircle } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../landlordNav';
import { bookingAPI } from 'services/api';
import toast from 'react-hot-toast';

const statusBadge = { pending: 'badge-orange', approved: 'badge-green', cancelled: 'badge-red', rejected: 'badge-red' };

export default function LandlordBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    bookingAPI.getLandlord()
      .then(r => setBookings(r.data.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch { toast.error('Failed to update booking'); }
  };

  const filtered = bookings.filter(b =>
    (filter === 'all' || b.status === filter) &&
    `${b.tenant?.firstName} ${b.tenant?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} accentColor="indigo">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Booking Requests</h1>
      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/50">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition ${filter === f ? 'text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                style={filter === f ? { background: 'linear-gradient(135deg, #4f46e5, #4338ca)' } : {}}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-12 text-slate-400">Loading bookings...</p>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Student', 'Property', 'Monthly Rent', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`text-left text-xs uppercase tracking-wide text-slate-400 font-bold px-4 py-4 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b._id} className={`border-t border-slate-100 hover:bg-white/60 transition ${b.status === 'cancelled' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {b.tenant?.firstName?.[0]}{b.tenant?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{b.tenant?.firstName} {b.tenant?.lastName}</p>
                          <p className="text-xs text-slate-500">{b.tenant?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-800">{b.property?.title}</p>
                      <p className="text-xs text-slate-500">{b.property?.address}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800">LKR {b.monthlyRent?.toLocaleString()}</td>
                    <td className="px-4 py-4"><span className={`badge ${statusBadge[b.status] || 'badge-slate'}`}>{b.status}</span></td>
                    <td className="px-4 py-4 text-right">
                      {b.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => updateStatus(b._id, 'approved')}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateStatus(b._id, 'rejected')}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : b.status === 'approved' ? (
                        <button className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg">View Details</button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && <p className="text-center py-12 text-slate-400 font-semibold">No bookings found</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
