import './MealOrders.css';
import { useState, useEffect } from 'react';
import { AlarmClock, Check, X, CheckCircle } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../mealNav';
import { mealAPI } from 'services/api';
import toast from 'react-hot-toast';

const statusStyles = {
  pending:   { badge: 'bg-yellow-100 text-yellow-700', row: 'bg-yellow-50/40' },
  confirmed: { badge: 'bg-blue-100 text-blue-700',    row: '' },
  preparing: { badge: 'bg-blue-100 text-blue-700',    row: '' },
  delivered: { badge: 'bg-slate-100 text-slate-500',  row: 'opacity-60 bg-slate-50/50' },
  cancelled: { badge: 'bg-red-100 text-red-600',      row: 'opacity-60' },
};

const transitions = {
  pending:   { label: 'Accept',      next: 'confirmed' },
  confirmed: { label: 'Preparing',   next: 'preparing' },
  preparing: { label: 'Mark Ready',  next: 'delivered' },
};

export default function MealOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  useEffect(() => {
    mealAPI.getProviderOrders()
      .then(r => setOrders(r.data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const advance = async (id, nextStatus) => {
    try {
      await mealAPI.updateOrderStatus(id, nextStatus);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: nextStatus } : o));
      toast.success(`Order → ${nextStatus}`);
    } catch { toast.error('Failed to update order'); }
  };

  const reject = async (id) => {
    try {
      await mealAPI.updateOrderStatus(id, 'cancelled');
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
      toast.error('Order rejected');
    } catch { toast.error('Failed to reject order'); }
  };

  const visible = orders.filter(o => tab === 'active' ? o.status !== 'delivered' && o.status !== 'cancelled' : o.status === 'delivered' || o.status === 'cancelled');

  return (
    <DashboardLayout navItems={navItems} accentColor="orange">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full text-red-600"><AlarmClock className="w-5 h-5" /></div>
          <div>
            <h4 className="text-red-700 font-bold text-sm uppercase tracking-wide">Orders Dashboard</h4>
            <p className="text-red-600 text-xs">Manage and track all incoming meal orders in real time.</p>
          </div>
        </div>
        <div className="text-lg font-mono font-bold text-red-600">{orders.filter(o=>o.status==='pending').length} Pending</div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Incoming Requests</h1>
        <div className="flex gap-2">
          {['active', 'history'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition ${tab === t ? 'text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              style={tab === t ? { background: 'linear-gradient(135deg,#ea580c,#c2410c)' } : {}}>
              {t === 'active' ? 'Active Orders' : 'History'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <p className="text-center py-12 text-slate-400">Loading orders...</p> : (
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  {['Order ID', 'Student', 'Amount', 'Date', 'Status', 'Action'].map(h => (
                    <th key={h} className={`text-left text-xs font-bold text-slate-400 uppercase px-6 py-4 ${h === 'Action' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map(o => {
                  const s = statusStyles[o.status] || statusStyles.pending;
                  const t = transitions[o.status];
                  return (
                    <tr key={o._id} className={`hover:bg-white/50 transition ${s.row}`}>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-slate-500">#{o._id?.slice(-6)}</div>
                        <div className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{o.student?.firstName} {o.student?.lastName}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">LKR {o.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(o.createdAt).toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'})}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${s.badge}`}>{o.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {o.status === 'delivered' || o.status === 'cancelled' ? (
                          <span className="text-xs text-slate-400 italic flex items-center justify-end gap-1"><CheckCircle className="w-3 h-3" /> Done</span>
                        ) : t ? (
                          <div className="flex items-center justify-end gap-2">
                            {o.status === 'pending' && (
                              <button onClick={() => reject(o._id)} className="p-2 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => advance(o._id, t.next)}
                              className="px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition text-white"
                              style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
                              <Check className="w-3 h-3" /> {t.label}
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && visible.length === 0 && <p className="text-center py-12 text-slate-400 font-semibold">No orders to show</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
