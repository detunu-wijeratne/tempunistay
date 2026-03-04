import './FacilityJobs.css';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, MapPin, Clock } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../facilityNav';
import toast from 'react-hot-toast';

const accentStyle = { background: 'linear-gradient(135deg,#0f766e,#0d9488)' };

const staff = [
  { name: 'Nimal P.',  role: 'Plumber',    initials: 'NP' },
  { name: 'Sarah J.',  role: 'Cleaner',    initials: 'SJ' },
  { name: 'Team A',    role: 'Movers',     initials: 'TA' },
];

const hours = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM'];

const schedule = {
  'NP': { '9 AM': { label:'Leaking Tap', loc:'Maplewood #304', type:'maintenance', span:2 }, '3 PM': null },
  'SJ': { '8 AM': { label:'Deep Clean', loc:'Lakeside #12', type:'cleaning', span:2 }, '1 PM': { label:'Std Clean', loc:'City Ctr #05', type:'cleaning', span:2 } },
  'TA': {},
};

const blocked = { 'NP': ['3 PM'], 'TA': ['3 PM'] };

const unassigned = [
  { id: '#REQ-1025', type: 'Maintenance', typeStyle: 'text-orange-600 bg-orange-50', title: 'Broken Window Latch', loc: 'Maplewood #101', est: '2 Hours' },
  { id: '#REQ-1026', type: 'Cleaning', typeStyle: 'text-blue-600 bg-blue-50', title: 'Move-out Clean', loc: 'Lakeside #08', est: '3 Hours' },
  { id: '#REQ-1027', type: 'Maintenance', typeStyle: 'text-orange-600 bg-orange-50', title: 'AC Not Cooling', loc: 'City Ctr #03', est: '1.5 Hours' },
];

const typeStyle = { maintenance: 'bg-orange-100 text-orange-700', cleaning: 'bg-blue-100 text-blue-700' };

export default function FacilityJobs() {
  const [dateOffset, setDateOffset] = useState(0);
  const date = new Date(); date.setDate(date.getDate() + dateOffset);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const assign = (job) => {
    toast.success(`${job.title} assigned!`);
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="teal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Daily Schedule</h1>
          <p className="text-slate-500 mt-1">Manage staff assignments and prevent conflicts.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button onClick={() => setDateOffset(d => d-1)} className="p-2 hover:bg-slate-50 rounded-lg"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
          <div className="flex items-center gap-2 px-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-bold text-slate-800">{dateStr}</span>
          </div>
          <button onClick={() => setDateOffset(d => d+1)} className="p-2 hover:bg-slate-50 rounded-lg"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: '60vh' }}>
        {/* Timeline grid */}
        <div className="flex-1 glass-panel overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white/50 flex-shrink-0">
            <h3 className="font-bold text-slate-800">Staff Timeline</h3>
            <div className="flex gap-3 text-xs font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Maintenance</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Cleaning</span>
            </div>
          </div>
          <div className="overflow-auto flex-1 p-4">
            <div className="min-w-[700px]">
              {/* Header */}
              <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '140px repeat(9, 1fr)' }}>
                <div className="text-xs font-bold text-slate-400 uppercase p-2">Staff</div>
                {hours.map(h => <div key={h} className="text-xs font-bold text-slate-400 text-center p-2">{h}</div>)}
              </div>
              {/* Rows */}
              {staff.map(s => {
                const row = schedule[s.initials] || {};
                const blk  = blocked[s.initials] || [];
                return (
                  <div key={s.initials} className="grid gap-1 mb-1 items-stretch" style={{ gridTemplateColumns: '140px repeat(9, 1fr)', minHeight: '64px' }}>
                    {/* Staff cell */}
                    <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2 border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">{s.initials}</div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.role}</p>
                      </div>
                    </div>
                    {hours.map((h, hi) => {
                      const job = row[h];
                      const isBlocked = blk.includes(h);
                      const isLunch = h === '12 PM';
                      return (
                        <div key={h} className="relative rounded-lg overflow-hidden border border-slate-100" style={{ minHeight: '64px' }}>
                          {isLunch ? (
                            <div className="h-full bg-slate-50 flex items-center justify-center">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lunch</span>
                            </div>
                          ) : isBlocked ? (
                            <div className="h-full bg-red-50 border border-red-200 flex items-center justify-center gap-1">
                              <span className="text-[10px] text-red-400 font-bold">Blocked</span>
                            </div>
                          ) : job ? (
                            <div className={`h-full p-2 flex flex-col justify-center text-[11px] font-bold ${job.type === 'maintenance' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}
                              style={{ gridColumn: `span ${job.span || 1}` }}>
                              <span>{job.label}</span>
                              <span className="opacity-70 font-normal">{job.loc}</span>
                            </div>
                          ) : (
                            <div className="h-full hover:bg-teal-50 transition cursor-pointer" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Unassigned panel */}
        <div className="w-full lg:w-72 glass-panel flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-white/50 flex-shrink-0">
            <h3 className="font-bold text-slate-800">Unassigned Jobs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click a job to assign a staff member.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-600 font-bold leading-tight">System prevents double booking. "Blocked" slots indicate unavailable staff.</p>
            </div>
            {unassigned.map(j => (
              <div key={j.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition cursor-pointer"
                onClick={() => assign(j)}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${j.typeStyle}`}>{j.type}</span>
                  <span className="text-[10px] text-slate-400">{j.id}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{j.title}</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{j.loc}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{j.est} est.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
