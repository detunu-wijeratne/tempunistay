import './StudentLaundry.css';
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

const serviceOptions = [
  { id: 'wash_fold', label: 'Wash & Fold', desc: 'Machine washed + neatly folded', price: 'LKR 500/kg' },
  { id: 'wash_iron', label: 'Wash & Iron', desc: 'Washed + pressed & hung', price: 'LKR 800/kg' },
  { id: 'dry_clean', label: 'Dry Clean', desc: 'Premium care for delicates', price: 'LKR 1,200/item' },
];

const mockOrders = [
  { id: 'LS-1024', type: 'Wash & Fold', kg: '3 kg', date: 'Oct 22, 2025', status: 'delivered' },
  { id: 'LS-1023', type: 'Wash & Iron', kg: '2 kg', date: 'Oct 15, 2025', status: 'processing' },
  { id: 'LS-1022', type: 'Wash & Fold', kg: '4 kg', date: 'Oct 01, 2025', status: 'delivered' },
];

const steps = ['Scheduled', 'Picked Up', 'Processing', 'Out for Delivery', 'Delivered'];
const activeStep = 3; // for the current active order

const statusBadge = { delivered: 'badge-green', processing: 'badge-orange', scheduled: 'badge-blue', pickedup: 'badge-blue', cancelled: 'badge-red' };

export default function StudentLaundry() {
  const [selected, setSelected] = useState('wash_fold');
  const [form, setForm] = useState({ pickupDate: '', pickupTime: '', weight: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await serviceAPI.create({ type: 'laundry', title: serviceOptions.find(s => s.id === selected)?.label, description: `Weight: ${form.weight}kg. ${form.notes}`, scheduledFor: `${form.pickupDate}T${form.pickupTime}` });
      toast.success('Laundry pickup scheduled!');
      setForm({ pickupDate: '', pickupTime: '', weight: '', notes: '' });
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
          <div className="p-2 bg-blue-600 rounded-lg shadow-md"><Shirt className="w-6 h-6 text-white" /></div>
          Laundry Service
        </h1>
        <p className="text-slate-500 mt-2 ml-1">Fast, reliable pickup and delivery — right from your residence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">New Laundry Order</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type */}
              <div>
                <label className="input-label mb-3 block">Select Service</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {serviceOptions.map(s => (
                    <div key={s.id} onClick={() => setSelected(s.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition ${selected === s.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800 text-sm">{s.label}</span>
                        {selected === s.id && <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"><Check className="w-2.5 h-2.5 text-white" /></div>}
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{s.desc}</p>
                      <p className="text-xs font-extrabold text-blue-600">{s.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Pickup Date</label>
                  <input type="date" className="input-field" value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} required />
                </div>
                <div>
                  <label className="input-label">Pickup Timeslot</label>
                  <select className="input-field" value={form.pickupTime} onChange={e => setForm({ ...form, pickupTime: e.target.value })} required>
                    <option value="">Select slot...</option>
                    <option value="08:00">8:00 AM – 10:00 AM</option>
                    <option value="10:00">10:00 AM – 12:00 PM</option>
                    <option value="14:00">2:00 PM – 4:00 PM</option>
                    <option value="16:00">4:00 PM – 6:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Estimated Weight (kg)</label>
                <input type="number" className="input-field" placeholder="e.g. 3" min="0.5" step="0.5"
                  value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required />
              </div>

              <div>
                <label className="input-label">Special Instructions (Optional)</label>
                <textarea className="input-field h-20 resize-none" placeholder="e.g. Separate whites, use mild detergent..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary text-white rounded-xl font-bold disabled:opacity-60">
                {loading ? 'Scheduling...' : 'Schedule Pickup'}
              </button>
            </form>
          </div>

          {/* Active Order Tracker */}
          <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">Active Order <span className="text-blue-600">#LS-1023</span></h3>
              <span className="badge badge-orange">Processing</span>
            </div>
            <div className="flex items-center mt-6 mb-2">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 border-white z-10 ${i <= activeStep ? 'bg-teal-600' : 'bg-slate-200'}`} />
                    <span className="text-[10px] text-center text-slate-500 mt-1 w-16">{step}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-0.5 -mt-4 ${i < activeStep ? 'bg-teal-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-5">Order History</h3>
          <div className="space-y-4">
            {mockOrders.map((o) => (
              <div key={o.id} className="p-4 bg-white/60 rounded-xl border border-white">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-slate-800 text-sm">{o.type}</p>
                  <span className={`badge ${statusBadge[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-xs text-slate-500">{o.id} · {o.kg} · {o.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
