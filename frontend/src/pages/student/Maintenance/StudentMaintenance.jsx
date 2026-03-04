import './StudentMaintenance.css';
import { useState } from 'react';
import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings, Hammer } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { serviceAPI } from 'services/api';
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

const mockRequests = [
  { id: 1, title: 'Leaking Bathroom Sink', category: 'Plumbing', priority: 'high', status: 'in_progress', date: 'Oct 22, 2025', assignedTo: 'John (Plumber)' },
  { id: 2, title: 'Flickering Bedroom Light', category: 'Electrical', priority: 'medium', status: 'assigned', date: 'Oct 18, 2025', assignedTo: 'Pending' },
  { id: 3, title: 'Broken Door Lock', category: 'Furniture / Fittings', priority: 'urgent', status: 'completed', date: 'Oct 05, 2025', assignedTo: 'Mike (Handyman)' },
];

const statusBadge = { pending: 'badge-slate', assigned: 'badge-blue', in_progress: 'badge-orange', completed: 'badge-green', cancelled: 'badge-red' };
const priorityBadge = { low: 'badge-green', medium: 'badge-orange', high: 'badge-red', urgent: 'bg-red-600 text-white' };

export default function StudentMaintenance() {
  const [form, setForm] = useState({ title: '', category: '', priority: 'medium', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await serviceAPI.create({ ...form, type: 'maintenance' });
      toast.success('Maintenance request submitted!');
      setForm({ title: '', category: '', priority: 'medium', description: '' });
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-md"><Hammer className="w-6 h-6 text-white" /></div>
          Maintenance & Repairs
        </h1>
        <p className="text-slate-500 mt-2 ml-1">Report problems in your boarding and get professional assistance quickly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-2 glass-panel p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">New Request</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Issue Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select a category...</option>
                  <option>Electrical (Lights, Power)</option>
                  <option>Plumbing (Leaks, Water)</option>
                  <option>Furniture / Fittings</option>
                  <option>Internet / Wi-Fi</option>
                  <option>Appliance Malfunction</option>
                  <option>Structural (Walls, Ceiling)</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="input-label">Priority Level</label>
                <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low — Not urgent</option>
                  <option value="medium">Medium — Fix soon</option>
                  <option value="high">High — Affects daily life</option>
                  <option value="urgent">Urgent — Emergency</option>
                </select>
              </div>
            </div>
            <div>
              <label className="input-label">Issue Title</label>
              <input type="text" className="input-field" placeholder="e.g. Leaking bathroom faucet" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="input-label">Detailed Description</label>
              <textarea className="input-field h-28 resize-none" placeholder="Describe the problem, when it started, and how bad it is..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label className="input-label">Preferred Time for Visit (Optional)</label>
              <input type="datetime-local" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary text-white rounded-xl font-bold disabled:opacity-60">
              {loading ? 'Submitting...' : 'Submit Maintenance Request'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-5">My Requests</h3>
          <div className="space-y-4">
            {mockRequests.map(r => (
              <div key={r.id} className="p-4 bg-white/60 rounded-xl border border-white">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-800 text-sm">{r.title}</p>
                  <span className={`badge ${statusBadge[r.status]}`}>{r.status.replace('_', ' ')}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{r.category} · {r.date}</p>
                <div className="flex items-center justify-between">
                  <span className={`badge ${priorityBadge[r.priority]}`}>{r.priority}</span>
                  <span className="text-xs text-slate-400">{r.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
