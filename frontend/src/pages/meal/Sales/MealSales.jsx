import './MealSales.css';
import { useState } from 'react';
import { DollarSign, ShoppingBag, Star, Users, TrendingUp, Download } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../mealNav';
import toast from 'react-hot-toast';

const weeklyData = [
  { day: 'Mon', amount: 12000, h: 40 },
  { day: 'Tue', amount: 18000, h: 60 },
  { day: 'Wed', amount: 15000, h: 50 },
  { day: 'Thu', amount: 24000, h: 80 },
  { day: 'Fri', amount: 21000, h: 70 },
  { day: 'Sat', amount: 27000, h: 90 },
  { day: 'Sun', amount: 16000, h: 53 },
];

const topItems = [
  { name: 'Chicken Rice', sold: 120, pct: 85, color: 'bg-orange-500' },
  { name: 'Veg Noodles',  sold: 95,  pct: 65, color: 'bg-blue-500' },
  { name: 'Creamy Pasta', sold: 60,  pct: 45, color: 'bg-green-500' },
  { name: 'Egg Hopper',   sold: 40,  pct: 30, color: 'bg-purple-500' },
  { name: 'Kottu Rotti',  sold: 28,  pct: 20, color: 'bg-pink-500' },
];

export default function MealSales() {
  const [period, setPeriod] = useState('week');
  const [hovered, setHovered] = useState(null);

  return (
    <DashboardLayout navItems={navItems} accentColor="orange">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Performance Report</h1>
          <p className="text-slate-500 mt-1">Sales insights and menu analytics.</p>
        </div>
        <button onClick={() => toast.success('Report downloaded!')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 shadow-sm text-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: <DollarSign className="w-5 h-5" />, bg: 'bg-green-100 text-green-600', value: 'LKR 125k', label: 'Total Revenue', trend: '+15%' },
          { icon: <ShoppingBag className="w-5 h-5" />, bg: 'bg-blue-100 text-blue-600', value: '450', label: 'Meals Sold' },
          { icon: <Star className="w-5 h-5" />, bg: 'bg-orange-100 text-orange-600', value: 'Chicken Rice', label: 'Most Popular' },
          { icon: <Users className="w-5 h-5" />, bg: 'bg-purple-100 text-purple-600', value: '28', label: 'New Subscribers' },
        ].map((s, i) => (
          <div key={i} className="glass-panel p-5">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              {s.trend && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{s.trend}</span>}
            </div>
            <div className="text-xl font-bold text-slate-800 leading-tight">{s.value}</div>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar chart */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-slate-800">Weekly Sales Trend</h3>
            <select value={period} onChange={e => setPeriod(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-500 font-bold focus:outline-none">
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
            </select>
          </div>
          {/* CSS bar chart */}
          <div className="flex items-end justify-between gap-2 h-44">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {hovered === i && (
                  <div className="text-[10px] font-bold text-white px-2 py-1 rounded-lg whitespace-nowrap" style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
                    LKR {(d.amount/1000).toFixed(0)}k
                  </div>
                )}
                <div className="w-full rounded-t-lg transition-all duration-300"
                  style={{ height: `${d.h}%`, background: hovered === i ? 'linear-gradient(180deg,#ea580c,#c2410c)' : 'linear-gradient(180deg,#fb923c,#f97316)' }} />
                <span className="text-xs font-bold text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu performance */}
        <div className="glass-panel p-8">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Menu Performance</h3>
          <div className="space-y-5">
            {topItems.map((item, i) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    {i === 0 && <span className="text-xs">🏆</span>}
                    {item.name}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">{item.sold} Sold</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
            View Full Menu Stats
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
