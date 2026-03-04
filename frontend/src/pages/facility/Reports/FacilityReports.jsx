import './FacilityReports.css';
import { useState } from 'react';
import { CheckCircle2, Clock, Star, TrendingUp, Download } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../facilityNav';
import toast from 'react-hot-toast';

const accentStyle = { background: 'linear-gradient(135deg,#0f766e,#0d9488)' };

const weeklyData = [
  { day: 'Mon', jobs: 8,  h: 53 },
  { day: 'Tue', jobs: 14, h: 80 },
  { day: 'Wed', jobs: 10, h: 65 },
  { day: 'Thu', jobs: 6,  h: 40 },
  { day: 'Fri', jobs: 12, h: 75 },
  { day: 'Sat', jobs: 5,  h: 33 },
  { day: 'Sun', jobs: 3,  h: 20 },
];

const topServices = [
  { name: 'Plumbing Repair', completed: 48, pct: 80, color: 'bg-orange-500' },
  { name: 'Deep Cleaning',   completed: 35, pct: 60, color: 'bg-blue-500' },
  { name: 'Laundry',         completed: 28, pct: 47, color: 'bg-purple-500' },
  { name: 'Electrical',      completed: 18, pct: 30, color: 'bg-yellow-500' },
  { name: 'Furniture Repair',completed: 10, pct: 18, color: 'bg-green-500' },
];

export default function FacilityReports() {
  const [hovered, setHovered] = useState(null);

  return (
    <DashboardLayout navItems={navItems} accentColor="teal">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Performance Report</h1>
          <p className="text-slate-500 mt-1">Service analytics and staff performance for the last 30 days.</p>
        </div>
        <button onClick={() => toast.success('Report downloaded!')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 shadow-sm text-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { icon: <CheckCircle2 className="w-5 h-5" />, bg: 'bg-green-100 text-green-600',  value: '139',   label: 'Jobs Completed',   trend: '+22%' },
          { icon: <Clock className="w-5 h-5" />,        bg: 'bg-blue-100 text-blue-600',    value: '2.4 hr', label: 'Avg Response Time' },
          { icon: <Star className="w-5 h-5" />,         bg: 'bg-orange-100 text-orange-600',value: '4.7★',   label: 'Avg Rating' },
          { icon: <TrendingUp className="w-5 h-5" />,   bg: 'bg-teal-100 text-teal-600',    value: '98%',    label: 'SLA Compliance' },
        ].map((s, i) => (
          <div key={i} className="glass-panel p-5">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
              {s.trend && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{s.trend}</span>}
            </div>
            <div className="text-xl font-bold text-slate-800">{s.value}</div>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar chart */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-lg text-slate-800">Weekly Job Volume</h3>
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-500 font-bold focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-44">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {hovered === i && (
                  <div className="text-[10px] font-bold text-white px-2 py-1 rounded-lg whitespace-nowrap" style={accentStyle}>{d.jobs} jobs</div>
                )}
                <div className="w-full rounded-t-lg transition-all duration-300"
                  style={{ height: `${d.h}%`, background: hovered === i ? 'linear-gradient(180deg,#0f766e,#0d9488)' : 'linear-gradient(180deg,#14b8a6,#2dd4bf)' }} />
                <span className="text-xs font-bold text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service breakdown */}
        <div className="glass-panel p-8">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Service Breakdown</h3>
          <div className="space-y-5">
            {topServices.map((s, i) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    {i === 0 && <span className="text-xs">🏆</span>}{s.name}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">{s.completed} jobs</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
            Full Analytics
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
