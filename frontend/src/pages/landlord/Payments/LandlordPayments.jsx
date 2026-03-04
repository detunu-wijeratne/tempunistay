import './LandlordPayments.css';
import { useState, useEffect } from 'react';
import { Check, X, CheckCircle, Clock, Image } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../landlordNav';
import { paymentAPI } from 'services/api';
import toast from 'react-hot-toast';

export default function LandlordPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // { payment }

  useEffect(() => {
    paymentAPI.getMy()
      .then(r => setPayments(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await paymentAPI.updateStatus(id, { status });
      setPayments(prev => prev.map(p => p._id === id ? { ...p, status } : p));
      toast.success(`Payment ${status}`);
      if (preview?._id === id) setPreview(prev => ({ ...prev, status }));
    } catch { toast.error('Failed to update'); }
  };

  const verified = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pending  = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout navItems={navItems} accentColor="indigo">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Payment Verification</h1>
          <p className="text-slate-500 mt-1">Review bank slips uploaded by tenants.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-5 py-3 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-600"><CheckCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Verified</p>
              <p className="text-lg font-bold text-slate-800">LKR {(verified/1000).toFixed(0)}k</p>
            </div>
          </div>
          <div className="glass-panel px-5 py-3 flex items-center gap-3 border-l-4 border-indigo-500">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
              <p className="text-lg font-bold text-slate-800">LKR {(pending/1000).toFixed(0)}k</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-white/50">
          <h3 className="font-bold text-lg text-slate-800">Payment Submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80">
              <tr>
                {['Student', 'Description', 'Amount', 'Date', 'Slip', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`text-left text-xs uppercase tracking-wide text-slate-400 font-bold px-4 py-4 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="text-center py-10 text-slate-400">Loading...</td></tr>}
              {!loading && payments.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">No payment submissions yet.</td></tr>
              )}
              {payments.map(p => (
                <tr key={p._id} className={`border-t border-slate-100 hover:bg-white/60 transition ${p.status === 'pending' ? 'bg-indigo-50/20' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {p.paidBy?.firstName?.[0]}{p.paidBy?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{p.paidBy?.firstName} {p.paidBy?.lastName}</p>
                        <p className="text-xs text-slate-500">{p.paidBy?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 text-sm">{p.description || p.type}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">LKR {p.amount?.toLocaleString()}</td>
                  <td className="px-4 py-4 text-slate-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    {p.slipImage ? (
                      <button onClick={() => setPreview(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition">
                        <Image className="w-3 h-3" /> View Slip
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">No slip uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {p.status === 'pending'   && <span className="badge badge-blue">Review Needed</span>}
                    {p.status === 'completed' && <span className="badge badge-green">Verified</span>}
                    {p.status === 'failed'    && <span className="badge badge-red">Rejected</span>}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {p.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => updateStatus(p._id, 'completed')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Verify">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(p._id, 'failed')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">{p.status === 'completed' ? 'Verified' : 'Rejected'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPreview(null)}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl z-10 w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800">Payment Slip</h3>
                <p className="text-xs text-slate-500">{preview.paidBy?.firstName} {preview.paidBy?.lastName} — LKR {preview.amount?.toLocaleString()}</p>
              </div>
              <button onClick={() => setPreview(null)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 bg-slate-100 flex justify-center">
              <img src={preview.slipImage} className="rounded-lg shadow max-h-80 object-contain" alt="Payment slip" />
            </div>
            {preview.status === 'pending' && (
              <div className="p-4 flex justify-end gap-3">
                <button onClick={() => { updateStatus(preview._id, 'failed'); setPreview(null); }}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200">Reject</button>
                <button onClick={() => { updateStatus(preview._id, 'completed'); setPreview(null); }}
                  className="px-4 py-2 text-white rounded-lg text-sm font-bold" style={{ background: 'linear-gradient(135deg,#4f46e5,#4338ca)' }}>Verify Payment</button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
