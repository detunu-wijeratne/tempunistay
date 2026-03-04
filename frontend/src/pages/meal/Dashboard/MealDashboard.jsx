import './MealDashboard.css';
import { useState } from 'react';
import { ShoppingBag, Utensils, DollarSign, List, Bell, Flame, Clock, CheckCircle, Check, X, PlusCircle } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../mealNav';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const initialOrders = [
  { id: '#ORD-9921', student: 'Kamal Silva', item: 'Chicken Fried Rice', status: 'new' },
  { id: '#ORD-9920', student: 'Sarah J.', item: 'Veg Noodles (No Spice)', status: 'cooking' },
  { id: '#ORD-9919', student: 'John Doe', item: 'Chicken Köttu', status: 'ready' },
];

const statusStyle = {
  new: 'bg-yellow-100 text-yellow-700',
  cooking: 'bg-blue-100 text-blue-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-500',
};

const nextAction = { new: { label: 'Prepare', next: 'cooking' }, cooking: { label: 'Mark Ready', next: 'ready' }, ready: { label: 'Complete', next: 'completed' } };

export default function MealDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrders);
  const [kitchenOpen, setKitchenOpen] = useState(true);

  const advance = (id) => setOrders(prev => prev.map(o => o.id === id && nextAction[o.status] ? { ...o, status: nextAction[o.status].next } : o));

  return (
    <DashboardLayout navItems={navItems} accentColor="orange">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Today's Overview</h1>
        <button onClick={() => { setKitchenOpen(k => !k); toast.success(kitchenOpen ? 'Kitchen closed' : 'Kitchen is open!'); }}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition ${kitchenOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          <span className={`w-2 h-2 rounded-full ${kitchenOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {kitchenOpen ? 'Kitchen Open' : 'Kitchen Closed'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: <ShoppingBag className="w-5 h-5" />, bg: 'bg-blue-100 text-blue-600', value: '145', label: "Today's Orders", trend: '+12%' },
          { icon: <Utensils className="w-5 h-5" />, bg: 'bg-green-100 text-green-600', value: '120', label: 'Meals Served' },
          { icon: <DollarSign className="w-5 h-5" />, bg: 'bg-emerald-100 text-emerald-600', value: 'LKR 45k', label: 'Revenue Today' },
          { icon: <List className="w-5 h-5" />, bg: 'bg-orange-100 text-orange-600', value: '4', label: 'Active Menu Items' },
        ].map((s, i) => (
          <div key={i} className="glass-panel p-5">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              {s.trend && <span className="text-xs font-bold text-green-600">{s.trend}</span>}
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Live Alerts */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            Live Alerts
          </h3>
          <div className="space-y-4">
            {[
              { color: 'yellow', icon: <Bell className="w-5 h-5 text-yellow-500" />, title: '5 New Orders Received', desc: 'Check special instructions.', action: null },
              { color: 'red', icon: <Flame className="w-5 h-5 text-red-500" />, title: 'Creamy Pasta Almost Sold Out', desc: 'Only 3 portions remaining.', action: { label: 'Manage Stock', fn: () => navigate('/meal/menu') } },
              { color: 'blue', icon: <Clock className="w-5 h-5 text-blue-500" />, title: 'Lunch Cutoff: 10:30 AM', desc: '45 minutes remaining for new orders.', action: null },
            ].map((a, i) => (
              <div key={i} className={`border-l-4 p-4 rounded-r-xl flex items-center justify-between border-${a.color}-400 bg-${a.color}-50`}
                style={{ borderLeftColor: a.color === 'yellow' ? '#facc15' : a.color === 'red' ? '#ef4444' : '#3b82f6', backgroundColor: a.color === 'yellow' ? '#fefce8' : a.color === 'red' ? '#fef2f2' : '#eff6ff' }}>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-full shadow-sm">{a.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-500">{a.desc}</p>
                  </div>
                </div>
                {a.action && (
                  <button onClick={a.action.fn} className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-50 flex-shrink-0">
                    {a.action.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-6 flex flex-col gap-4 justify-center">
          <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
          <button onClick={() => navigate('/meal/add-item')} className="w-full py-4 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-3 transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
            <PlusCircle className="w-5 h-5" /> Add Today's Menu
          </button>
          <button onClick={() => navigate('/meal/orders')} className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-3">
            <List className="w-5 h-5 text-slate-500" /> View All Orders
          </button>
          <button onClick={() => toast.success('Sold-out items marked!')} className="w-full py-4 bg-red-50 border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center gap-3">
            <X className="w-5 h-5" /> Mark Items Sold Out
          </button>
        </div>
      </div>

      {/* Incoming Orders */}
      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white/50">
          <h3 className="font-bold text-lg text-slate-800">Incoming Orders</h3>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Feed
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-xs text-slate-400 uppercase">
              <tr>
                {['Order ID', 'Student', 'Item', 'Status', 'Action'].map(h => (
                  <th key={h} className={`px-6 py-3 font-bold text-left ${h === 'Action' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-white/50 transition">
                  <td className="px-6 py-4 font-mono text-slate-500">{o.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{o.student}</td>
                  <td className="px-6 py-4 text-slate-600">{o.item}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyle[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {nextAction[o.status] ? (
                      <button onClick={() => advance(o.id)} className="text-xs font-bold text-orange-600 hover:underline">
                        {nextAction[o.status].label}
                      </button>
                    ) : <span className="text-xs text-slate-400 italic">Done</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
