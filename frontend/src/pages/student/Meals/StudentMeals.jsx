import './StudentMeals.css';
import { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { mealAPI } from 'services/api';
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

const statusBadge = { delivered: 'badge-green', preparing: 'badge-orange', pending: 'badge-blue', confirmed: 'badge-blue', cancelled: 'badge-red' };

export default function StudentMeals() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mealAPI.getMyOrders()
      .then(r => setOrders(r.data.data))
      .catch(() => toast.error('Failed to load meal orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Meal Orders</h2>
        <a href="/meals" className="px-5 py-2 btn-primary text-white rounded-lg font-bold text-sm">Browse Meal Plans</a>
      </div>
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No meal orders yet. Browse meal plans to get started.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Meal Plan', 'Provider', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-5 py-4 font-semibold text-slate-900">Order #{o._id?.slice(-6)}</td>
                  <td className="px-5 py-4 text-slate-500">{o.provider?.firstName} {o.provider?.lastName}</td>
                  <td className="px-5 py-4 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-bold text-slate-900">LKR {o.totalAmount?.toLocaleString()}</td>
                  <td className="px-5 py-4"><span className={`badge ${statusBadge[o.status] || 'badge-blue'}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
