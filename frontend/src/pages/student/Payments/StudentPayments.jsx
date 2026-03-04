import './StudentPayments.css';
import { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings, Wallet, Clock, Check, X, Copy, UploadCloud, Filter } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { paymentAPI } from 'services/api';
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

const statusBadge = { completed: 'badge-green', pending: 'badge-orange', failed: 'badge-red' };
const statusIcon  = { completed: <Check className="w-5 h-5"/>, pending: <Clock className="w-5 h-5"/>, failed: <X className="w-5 h-5"/> };
const statusIconBg = { completed: 'bg-green-100 text-green-600', pending: 'bg-orange-100 text-orange-600', failed: 'bg-red-100 text-red-600' };

export default function StudentPayments() {
  const [history, setHistory] = useState([]);
  const [paymentType, setPaymentType] = useState('Monthly Rent (October)');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    paymentAPI.getMy()
      .then(r => setHistory(r.data.data))
      .catch(() => {});
  }, []);

  const [slipFile, setSlipFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCopy = () => { navigator.clipboard.writeText('800123456789'); toast.success('Account number copied!'); };
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setSlipFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slipFile) return toast.error('Please upload a bank slip');
    setSubmitting(true);
    try {
      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(slipFile);
      });
      await paymentAPI.create({
        amount: 35000,
        type: 'rent',
        method: 'bank_transfer',
        description: paymentType,
        status: 'pending',
        slipImage: base64,
      });
      toast.success('Payment slip submitted for verification!');
      setFileName('');
      setSlipFile(null);
      // Refresh history
      const r = await paymentAPI.getMy();
      setHistory(r.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-md"><Wallet className="w-6 h-6 text-white" /></div>
          Payments
        </h1>
        <p className="text-slate-500 mt-2 ml-1">Upload receipts and track your payment history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-panel p-6 border-l-4 border-l-blue-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">Total Amount Due</h3>
              <span className="badge badge-orange">Due Oct 25</span>
            </div>
            <div className="text-4xl font-extrabold text-slate-900 mb-1">LKR 35,000</div>
            <p className="text-sm text-slate-500">Includes October Rent & Service Fee</p>
          </div>

          <div className="p-6 rounded-2xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div><p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Bank Name</p><p className="font-bold text-lg">Commercial Bank</p></div>
              <CreditCard className="w-8 h-8 text-slate-400" />
            </div>
            <div className="mb-6 relative z-10">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
              <div className="flex items-center gap-3">
                <p className="font-mono text-2xl tracking-widest">8001 2345 6789</p>
                <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded-lg transition"><Copy className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <div><p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Account Name</p><p className="font-bold">Maplewood Residences</p></div>
              <div><p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Branch</p><p className="font-bold">City Center</p></div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Submit Payment Proof</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Payment Type</label>
                <select className="input-field" value={paymentType} onChange={e => setPaymentType(e.target.value)}>
                  <option>Monthly Rent (October)</option>
                  <option>Service Fee</option>
                  <option>Meal Plan Renewal</option>
                </select>
              </div>
              <div>
                <label className="input-label">Upload Bank Slip</label>
                <label className="block rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition bg-white relative">
                  <input type="file" className="hidden" accept=".jpg,.png,.pdf" onChange={handleFileChange} />
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"><UploadCloud className="w-6 h-6" /></div>
                  {fileName ? <p className="text-sm font-bold text-blue-600">{fileName}</p> : <><p className="text-sm font-bold text-slate-700">Click or Drag slip here</p><p className="text-xs text-slate-400 mt-1">JPG, PNG or PDF (Max 5MB)</p></>}
                </label>
              </div>
              <button type="submit" className="w-full py-3 btn-primary text-white rounded-xl font-bold text-sm shadow-md">Submit Verification</button>
            </form>
          </div>
        </div>

        <div className="glass-panel p-6 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Payment History</h3>
            <button className="p-2 hover:bg-white rounded-lg text-slate-500 transition"><Filter className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No payment history yet.</p>
            ) : history.map(p => (
              <div key={p._id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusIconBg[p.status] || 'bg-slate-100 text-slate-500'}`}>
                    {statusIcon[p.status] || <Check className="w-5 h-5"/>}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{p.description || p.type || 'Payment'}</p>
                    <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">LKR {p.amount?.toLocaleString()}</p>
                  <span className={`badge ${statusBadge[p.status] || 'badge-green'} mt-1`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
