import './StudentBooking.css';
import { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { bookingAPI } from 'services/api';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/booking', label: 'My Booking', icon: BookOpen },
  { to: '/student/meals', label: 'Meal Orders', icon: Utensils },
  { to: '/student/payments', label: 'Payments', icon: CreditCard },
  { to: '/student/cleaning', label: 'Cleaning', icon: Sparkles },
  { to: '/student/laundry', label: 'Laundry', icon: Shirt },
  { to: '/student/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/student/messages', label: 'Messages', icon: MessageSquare },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

const statusBadge = { pending: 'badge-orange', approved: 'badge-green', active: 'badge-green', rejected: 'badge-red', cancelled: 'badge-slate' };

export default function StudentBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getMy()
      .then(r => setBookings(r.data.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      setBookings(b => b.map(x => x._id === id ? { ...x, status: 'cancelled' } : x));
      toast.success('Booking cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  const active = bookings.find(b => b.status === 'approved' || b.status === 'active');
  const past   = bookings.filter(b => b.status !== 'approved' && b.status !== 'active');

  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-6">My Bookings</h2>

      {loading ? (
        <div className="glass-panel p-6 text-center text-slate-400">Loading bookings...</div>
      ) : !active && bookings.length === 0 ? (
        <div className="glass-panel p-6 text-center">
          <p className="text-slate-400 mb-4">No bookings yet.</p>
          <a href="/properties" className="px-5 py-2 btn-primary text-white rounded-lg font-bold text-sm">Browse Properties</a>
        </div>
      ) : (
        <>
          {active && (
            <div className="glass-panel p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900">{active.property?.title}</h4>
                  <p className="text-sm text-slate-500">{active.property?.address}</p>
                </div>
                <span className={`badge ${statusBadge[active.status]}`}>{active.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-slate-50 p-3 rounded-xl"><p className="font-bold text-slate-900">LKR {active.monthlyRent?.toLocaleString()}/mo</p><p className="text-slate-400">Rent</p></div>
                <div className="bg-slate-50 p-3 rounded-xl"><p className="font-bold text-slate-900">{active.startDate ? new Date(active.startDate).toLocaleDateString() : '—'}</p><p className="text-slate-400">Start Date</p></div>
                <div className="bg-slate-50 p-3 rounded-xl"><p className="font-bold text-slate-900">{active.endDate ? new Date(active.endDate).toLocaleDateString() : '—'}</p><p className="text-slate-400">End Date</p></div>
              </div>
              <button onClick={() => cancel(active._id)} className="mt-4 text-sm text-red-500 hover:underline">Cancel Booking</button>
            </div>
          )}

          <div className="glass-panel p-6">
            <h3 className="font-bold text-slate-900 mb-4">All Requests</h3>
            {bookings.length === 0 ? (
              <p className="text-slate-400 text-sm">No booking history.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b._id} className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{b.property?.title}</p>
                      <p className="text-xs text-slate-400">{b.property?.address} · LKR {b.monthlyRent?.toLocaleString()}/mo</p>
                    </div>
                    <span className={`badge ${statusBadge[b.status] || 'badge-slate'}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
