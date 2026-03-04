import './FacilityDashboard.css';
import { useState } from 'react';
import { Inbox, UserCheck, CheckCircle2, Clock, AlertTriangle, ZapOff, SprayCan, Wrench, UserPlus, Calendar } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../facilityNav';
import { useNavigate } from 'react-router-dom';

const accentStyle = { background: 'linear-gradient(135deg,#0f766e,#0d9488)' };
const priorityBadge = { high: 'badge-red', normal: 'badge-blue', low: 'badge-green' };
const statusColor   = { pending: 'text-orange-600', in_progress: 'text-teal-600', completed: 'text-slate-400' };

const jobs = [
  { id: '#REQ-1024', type: 'Electrical', location: 'Maplewood #304', priority: 'high',   status: 'pending' },
  { id: '#REQ-1023', type: 'Cleaning',   location: 'Lakeside #12',   priority: 'normal', status: 'in_progress' },
  { id: '#REQ-1020', type: 'Laundry',    location: 'City Ctr #05',   priority: 'normal', status: 'completed' },
];

export default function FacilityDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout navItems={navItems} accentColor="teal">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Operations Overview</h1>
        <div className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" /> 3 Technicians Active
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { iconEl: <Inbox className="w-5 h-5" />,          bg: 'bg-blue-100 text-blue-600',    value: '12', label: 'New Requests' },
          { iconEl: <UserCheck className="w-5 h-5" />,       bg: 'bg-purple-100 text-purple-600',value: '8',  label: 'Assigned Today' },
          { iconEl: <CheckCircle2 className="w-5 h-5" />,    bg: 'bg-green-100 text-green-600',  value: '5',  label: 'Completed Jobs' },
          { iconEl: <Clock className="w-5 h-5" />,           bg: 'bg-orange-100 text-orange-600',value: '3',  label: 'Pending Tasks' },
          { iconEl: <AlertTriangle className="w-5 h-5" />,   bg: 'bg-red-100 text-red-600',      value: '3',  label: 'Urgent', urgent: true },
        ].map((s, i) => (
          <div key={i} className={`glass-panel p-5 ${s.urgent ? 'bg-red-50 border border-red-100' : ''}`}>
            <div className={`p-2 rounded-lg w-fit mb-2 ${s.bg}`}>{s.iconEl}</div>
            <div className={`text-2xl font-bold ${s.urgent ? 'text-red-600' : 'text-slate-800'}`}>{s.value}</div>
            <p className={`text-xs font-bold ${s.urgent ? 'text-red-500' : 'text-slate-500'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Alerts */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Priority Alerts</h3>
          <div className="space-y-4">
            {[
              { lColor: '#ef4444', bg: '#fef2f2', icon: <ZapOff className="w-5 h-5 text-red-500" />, title: '3 Urgent Repairs Pending', desc: 'Electrical issue at Maplewood (Room 304).', action: { label: 'Action Required', style: { color:'#dc2626',background:'white',border:'1px solid #fca5a5' }, fn: () => navigate('/facility/requests') } },
              { lColor: '#3b82f6', bg: '#eff6ff', icon: <SprayCan className="w-5 h-5 text-blue-500" />, title: '5 Cleaning Jobs Scheduled', desc: 'Teams A and B are deployed.', action: null },
              { lColor: '#22c55e', bg: '#f0fdf4', icon: <UserCheck className="w-5 h-5 text-green-600" />, title: 'Technician Available', desc: 'Nimal Perera (Plumber) has finished his tasks.', action: { label: 'Assign', style: { color:'#15803d',background:'white',border:'1px solid #86efac' }, fn: () => navigate('/facility/jobs') } },
            ].map((a, i) => (
              <div key={i} className="border-l-4 p-4 rounded-r-xl flex items-center justify-between"
                style={{ borderLeftColor: a.lColor, backgroundColor: a.bg }}>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-full shadow-sm">{a.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-500">{a.desc}</p>
                  </div>
                </div>
                {a.action && (
                  <button onClick={a.action.fn} className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 ml-4" style={a.action.style}>
                    {a.action.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick workflow */}
        <div className="glass-panel p-6 flex flex-col gap-4 justify-center">
          <h3 className="text-lg font-bold text-slate-800">Quick Workflow</h3>
          <button onClick={() => navigate('/facility/requests')} className="w-full py-4 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-3 transition hover:opacity-90" style={accentStyle}>
            <Inbox className="w-5 h-5" /> View New Requests
          </button>
          <button onClick={() => navigate('/facility/jobs')} className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center gap-3">
            <UserPlus className="w-5 h-5 text-slate-500" /> Assign Staff
          </button>
          <button onClick={() => navigate('/facility/jobs')} className="w-full py-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition flex items-center justify-center gap-3">
            <Calendar className="w-5 h-5" /> Check Schedule
          </button>
        </div>
      </div>

      {/* Job monitor */}
      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white/50">
          <h3 className="font-bold text-lg text-slate-800">Job Monitor</h3>
          <span className="text-xs text-slate-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-xs text-slate-400 uppercase">
              <tr>{['Job ID','Type','Location','Priority','Status','Action'].map(h => (
                <th key={h} className={`px-6 py-3 font-bold text-left ${h==='Action'?'text-right':''}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map(j => (
                <tr key={j.id} className={`hover:bg-white/50 transition ${j.status==='completed'?'opacity-70':''}`}>
                  <td className="px-6 py-4 font-mono text-slate-500">{j.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{j.type}</td>
                  <td className="px-6 py-4 text-slate-600">{j.location}</td>
                  <td className="px-6 py-4"><span className={`badge ${priorityBadge[j.priority]}`}>{j.priority}</span></td>
                  <td className="px-6 py-4"><span className={`text-xs font-bold capitalize ${statusColor[j.status]}`}>{j.status.replace('_',' ')}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => navigate('/facility/requests')} className="text-xs font-bold text-teal-600 hover:underline">
                      {j.status === 'pending' ? 'Assign' : j.status === 'in_progress' ? 'Track' : 'View'}
                    </button>
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
