import './FacilityRequests.css';
import { useState, useEffect } from 'react';
import { Wrench, SprayCan, ShirtIcon, X, MapPin, Clock, UserCheck, MessageCircle } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../facilityNav';
import { serviceAPI } from 'services/api';
import toast from 'react-hot-toast';

const accentStyle = { background: 'linear-gradient(135deg,#0f766e,#0d9488)' };
const typeIcon  = { maintenance: <Wrench className="w-4 h-4" />, cleaning: <SprayCan className="w-4 h-4" />, laundry: <ShirtIcon className="w-4 h-4" /> };
const typeColor = { maintenance: 'bg-orange-50 text-orange-600', cleaning: 'bg-blue-50 text-blue-600', laundry: 'bg-purple-50 text-purple-600' };
const priorityBadge = { high: 'badge-red', normal: 'badge-orange', low: 'badge-green' };
const statusBadge   = { pending: 'badge-blue', in_progress: 'badge-orange', completed: 'badge-green', cancelled: 'badge-red' };
const staff = ['Nimal Perera (Plumber)', 'Sarah (Cleaner)', 'Team A (General)', 'Mike (Electrician)', 'Raju (Multi-skill)'];

export default function FacilityRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [drawer, setDrawer] = useState(null);
  const [assignStaff, setAssignStaff] = useState('');

  useEffect(() => {
    serviceAPI.getAll()
      .then(r => setRequests(r.data.data))
      .catch(() => toast.error('Failed to load requests'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const updateStatus = async (id, status, extra = {}) => {
    try {
      await serviceAPI.update(id, { status, ...extra });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status, ...extra } : r));
      toast.success(`Status updated to ${status}`);
      setDrawer(null);
      setAssignStaff('');
    } catch { toast.error('Failed to update'); }
  };

  const handleAssign = () => {
    if (!assignStaff) { toast.error('Select a staff member'); return; }
    updateStatus(drawer._id, 'in_progress', { assignedStaff: assignStaff });
    toast.success(`Assigned to ${assignStaff}`);
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="teal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Incoming Requests</h1>
          <p className="text-slate-500 mt-1">Manage, assign, and track service tickets.</p>
        </div>
        <div className="flex gap-2 bg-white/60 p-1.5 rounded-xl border border-slate-200">
          {['all', 'pending', 'in_progress', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition ${filter === f ? 'text-white shadow-sm' : 'text-slate-600 hover:bg-teal-50'}`}
              style={filter === f ? accentStyle : {}}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <p className="text-center py-12 text-slate-400">Loading requests...</p> : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs text-slate-400 uppercase">
                <tr>
                  {['Request', 'Student', 'Type', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 font-bold text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(r => (
                  <tr key={r._id} className={`hover:bg-white/50 transition ${r.priority === 'high' && r.status === 'pending' ? 'bg-red-50/30' : ''} ${r.status === 'completed' ? 'opacity-70' : ''}`}>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">#{r._id?.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{r.student?.firstName} {r.student?.lastName}</p>
                        <p className="text-xs text-slate-400">{r.student?.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold ${typeColor[r.type] || 'bg-slate-50 text-slate-600'}`}>
                        {typeIcon[r.type] || <Wrench className="w-4 h-4" />} {r.type}
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`badge ${priorityBadge[r.priority] || 'badge-orange'}`}>{r.priority}</span></td>
                    <td className="px-6 py-4"><span className={`badge ${statusBadge[r.status] || 'badge-blue'}`}>{r.status?.replace('_',' ')}</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {r.status === 'pending' ? (
                        <button onClick={() => { setDrawer(r); setAssignStaff(''); }} className="px-3 py-1.5 text-white rounded-lg text-xs font-bold shadow-sm transition hover:opacity-90" style={accentStyle}>
                          Assign Staff
                        </button>
                      ) : r.status === 'in_progress' ? (
                        <button onClick={() => updateStatus(r._id, 'completed')} className="text-xs font-bold text-teal-700 hover:underline">Mark Complete</button>
                      ) : (
                        <button onClick={() => setDrawer(r)} className="text-xs font-bold text-slate-400 hover:text-slate-600">View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && <p className="text-center py-12 text-slate-400 font-semibold">No requests found</p>}
        </div>
      </div>

      {/* Drawer */}
      {drawer && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => setDrawer(null)} />
          <aside className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Request Details</span>
                <h2 className="text-2xl font-bold text-slate-800 mt-1">#{drawer._id?.slice(-6)}</h2>
                <div className="flex gap-2 mt-2">
                  <span className={`badge ${statusBadge[drawer.status] || 'badge-blue'}`}>{drawer.status?.replace('_',' ')}</span>
                  <span className={`badge ${priorityBadge[drawer.priority] || 'badge-orange'}`}>{drawer.priority} priority</span>
                </div>
              </div>
              <button onClick={() => setDrawer(null)} className="p-2 hover:bg-white rounded-full text-slate-500"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center">
                  {drawer.student?.firstName?.[0]}{drawer.student?.lastName?.[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{drawer.student?.firstName} {drawer.student?.lastName}</h4>
                  <p className="text-xs text-slate-500">{drawer.student?.phone}</p>
                </div>
              </div>

              {drawer.description && (
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Description</h5>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">"{drawer.description}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-3 rounded-lg">
                  <span className="text-xs text-slate-400 block">Service Type</span>
                  <div className={`inline-flex items-center gap-1.5 mt-1 font-bold text-sm ${typeColor[drawer.type] || ''}`}>
                    {typeIcon[drawer.type] || <Wrench className="w-4 h-4" />} {drawer.type}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-lg">
                  <span className="text-xs text-slate-400 block">Submitted</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-slate-700 text-sm">{new Date(drawer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {drawer.status === 'pending' && (
                <div>
                  <label className="input-label">Assign To</label>
                  <select className="input-field" value={assignStaff} onChange={e => setAssignStaff(e.target.value)}>
                    <option value="">Select staff member...</option>
                    {staff.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
              {drawer.status === 'pending' ? (
                <>
                  <button onClick={handleAssign} className="w-full py-3 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition" style={accentStyle}>
                    <UserCheck className="w-4 h-4" /> Assign & Start
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setDrawer(null)} className="py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-100">Close</button>
                    <button onClick={() => updateStatus(drawer._id, 'cancelled')} className="py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-lg text-sm hover:bg-red-50">Cancel</button>
                  </div>
                </>
              ) : (
                <button onClick={() => setDrawer(null)} className="w-full py-3 text-white rounded-xl font-bold" style={accentStyle}>Close</button>
              )}
            </div>
          </aside>
        </>
      )}
    </DashboardLayout>
  );
}
