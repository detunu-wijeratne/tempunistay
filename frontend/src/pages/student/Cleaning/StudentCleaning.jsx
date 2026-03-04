import './StudentCleaning.css';
import { useState } from 'react';
import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings, Check } from 'lucide-react';
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

const serviceTypes = [
  { id: 'standard', label: 'Standard Clean', desc: 'Sweep, mop, dusting', price: 'LKR 1,500' },
  { id: 'deep', label: 'Deep Clean', desc: 'Full room + bathroom scrub', price: 'LKR 3,000' },
  { id: 'express', label: 'Express Tidy', desc: 'Quick 30-min tidy-up', price: 'LKR 800' },
];

const mockHistory = [
  { title: 'Standard Clean', date: 'Oct 20, 2025', status: 'completed', worker: 'Amali S.' },
  { title: 'Deep Clean', date: 'Oct 05, 2025', status: 'completed', worker: 'Ravi K.' },
  { title: 'Express Tidy', date: 'Sep 28, 2025', status: 'cancelled', worker: '—' },
];

const statusBadge = { completed: 'badge-green', pending: 'badge-orange', assigned: 'badge-blue', in_progress: 'badge-orange', cancelled: 'badge-red', scheduled: 'badge-orange' };

export default function StudentCleaning() {
  const [selected, setSelected] = useState('standard');
  const [form, setForm] = useState({ date: '', time: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await serviceAPI.create({ type: 'cleaning', title: serviceTypes.find(s => s.id === selected)?.label, description: form.notes || 'Cleaning service', scheduledFor: `${form.date}T${form.time}` });
      toast.success('Cleaning scheduled successfully!');
      setForm({ date: '', time: '', notes: '' });
    } catch {
      toast.error('Failed to schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-md"><Sparkles className="w-6 h-6 text-white" /></div>
          Room Cleaning Service
        </h1>
        <p className="text-slate-500 mt-2 ml-1">Schedule professional cleaning at your convenience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-2 glass-panel p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">Schedule Service</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type */}
            <div>
              <label className="input-label mb-3 block">Select Service Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {serviceTypes.map(s => (
                  <div key={s.id} onClick={() => setSelected(s.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${selected === s.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 text-sm">{s.label}</span>
                      {selected === s.id && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{s.desc}</p>
                    <p className="text-sm font-extrabold text-blue-600">{s.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Preferred Date</label>
                <input type="date" className="input-field" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Preferred Time</label>
                <select className="input-field" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required>
                  <option value="">Select slot...</option>
                  <option value="08:00">8:00 AM – 10:00 AM</option>
                  <option value="10:00">10:00 AM – 12:00 PM</option>
                  <option value="13:00">1:00 PM – 3:00 PM</option>
                  <option value="15:00">3:00 PM – 5:00 PM</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="input-label">Special Instructions (Optional)</label>
              <textarea className="input-field h-24 resize-none" placeholder="e.g. Focus on bathroom, please avoid desk area..."
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            {/* Recurring */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-slate-800 text-sm">Recurring Weekly</p>
                <p className="text-xs text-slate-500">Auto-schedule same slot every week</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" id="recurring" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 transition-all" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary text-white rounded-xl font-bold disabled:opacity-60">
              {loading ? 'Scheduling...' : 'Confirm Cleaning Booking'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-5">Cleaning History</h3>
          <div className="space-y-4">
            {mockHistory.map((h, i) => (
              <div key={i} className="p-4 bg-white/60 rounded-xl border border-white">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-slate-800 text-sm">{h.title}</p>
                  <span className={`badge ${statusBadge[h.status]}`}>{h.status}</span>
                </div>
                <p className="text-xs text-slate-500">{h.date}</p>
                {h.worker !== '—' && <p className="text-xs text-blue-600 font-semibold mt-1">Worker: {h.worker}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
