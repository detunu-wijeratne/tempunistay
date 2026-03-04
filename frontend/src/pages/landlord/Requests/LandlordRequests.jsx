import './LandlordRequests.css';
import { useState, useEffect } from 'react';
import { Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../landlordNav';
import { serviceAPI } from 'services/api';
import toast from 'react-hot-toast';

const statusBadge = { pending: 'badge-orange', in_progress: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red' };
const priorityColors = { low: 'text-green-600 bg-green-50', normal: 'text-orange-600 bg-orange-50', medium: 'text-orange-600 bg-orange-50', high: 'text-red-600 bg-red-50', urgent: 'text-red-700 bg-red-100 font-extrabold' };

export default function LandlordRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    serviceAPI.getAll()
      .then(r => setRequests(r.data.data))
      .catch(() => toast.error('Failed to load requests'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await serviceAPI.update(id, { status });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success(`Request marked as ${status}`);
    } catch { toast.error('Failed to update request'); }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="indigo">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <div className="p-2 rounded-lg shadow-md" style={{ background: 'linear-gradient(135deg,#4f46e5,#4338ca)' }}>
            <Wrench className="w-6 h-6 text-white" />
          </div>
          Service Requests
        </h1>
        <p className="text-slate-500 mt-2 ml-1">Manage maintenance and repair requests from your tenants.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', count: counts.all, icon: <Wrench className="w-5 h-5" />, bg: 'bg-slate-100 text-slate-600' },
          { label: 'Pending', count: counts.pending, icon: <Clock className="w-5 h-5" />, bg: 'bg-orange-100 text-orange-600' },
          { label: 'In Progress', count: counts.in_progress, icon: <AlertTriangle className="w-5 h-5" />, bg: 'bg-blue-100 text-blue-600' },
          { label: 'Completed', count: counts.completed, icon: <CheckCircle className="w-5 h-5" />, bg: 'bg-green-100 text-green-600' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.bg}`}>{s.icon}</div>
            <div><p className="text-xl font-extrabold text-slate-900">{s.count}</p><p className="text-xs text-slate-500 font-bold">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'in_progress', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition ${filter === f ? 'text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            style={filter === f ? { background: 'linear-gradient(135deg,#4f46e5,#4338ca)' } : {}}>
            {f.replace('_', ' ')} {filter !== f && `(${counts[f] || 0})`}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center py-12 text-slate-400">Loading requests...</p> : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r._id} className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="font-bold text-slate-900">{r.title}</h3>
                  <span className={`badge ${statusBadge[r.status] || 'badge-orange'}`}>{r.status?.replace('_', ' ')}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityColors[r.priority] || priorityColors.normal}`}>{r.priority}</span>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-bold">{r.student?.firstName} {r.student?.lastName}</span> · {r.type}
                </p>
                <p className="text-xs text-slate-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {r.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(r._id, 'in_progress')} className="px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">Assign</button>
                    <button onClick={() => updateStatus(r._id, 'completed')} className="px-3 py-2 text-xs font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100">Mark Done</button>
                  </>
                )}
                {r.status === 'in_progress' && (
                  <button onClick={() => updateStatus(r._id, 'completed')} className="px-3 py-2 text-xs font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100">Mark Complete</button>
                )}
                {r.status === 'completed' && <span className="px-3 py-2 text-xs font-bold text-slate-400 bg-slate-50 rounded-lg">Resolved</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center py-12 text-slate-400 font-semibold">No requests found</p>}
        </div>
      )}
    </DashboardLayout>
  );
}
