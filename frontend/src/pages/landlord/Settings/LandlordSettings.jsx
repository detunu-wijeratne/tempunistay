import './LandlordSettings.css';
import { useState } from 'react';
import { User, ShieldCheck, Bell, Trash2, Camera } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../landlordNav';
import { useAuth } from 'context/AuthContext';
import { userAPI } from 'services/api';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Business Profile', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Delete Account', icon: Trash2, danger: true },
];

export default function LandlordSettings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', businessName: user?.businessName || '', phone: '', address: '' });
  const [notifs, setNotifs] = useState({ email: true, sms: true, bookings: true, payments: true, messages: true });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const r = await userAPI.updateProfile(form);
      login(r.data.data, localStorage.getItem('unistay_token'));
      toast.success('Profile updated!');
      setEditing(false);
    } catch { toast.error('Failed to update profile'); }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="indigo">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Account Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm sticky top-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm mb-2 transition-all text-left
                  ${tab.danger ? 'text-red-600 border border-red-100 bg-red-50 hover:bg-red-100'
                  : activeTab === tab.id ? 'text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                style={activeTab === tab.id && !tab.danger ? { background: 'linear-gradient(135deg,#4f46e5,#4338ca)' } : {}}>
                <tab.icon className="w-5 h-5" />{tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Business Profile</h3>
                  <p className="text-sm text-slate-500">Your landlord profile shown to tenants.</p>
                </div>
                <button onClick={() => setEditing(!editing)} className="text-sm text-indigo-600 font-bold border border-indigo-200 bg-white px-4 py-2 rounded-lg hover:bg-indigo-50">
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              {!editing ? (
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="shrink-0 text-center relative">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white shadow-md"
                      style={{ background: 'linear-gradient(135deg,#4f46e5,#4338ca)' }}>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span className="mt-3 inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Landlord</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', value: user?.firstName },
                      { label: 'Last Name', value: user?.lastName },
                      { label: 'Business Name', value: user?.businessName || 'Maplewood Residences' },
                      { label: 'Email', value: user?.email },
                      { label: 'Phone', value: form.phone || '+94 77 000 0000' },
                      { label: 'Address', value: form.address || '123 College Ave, CityVille' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{f.label}</label>
                        <p className="text-slate-800 font-semibold">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="input-label">First Name</label><input className="input-field" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
                    <div><label className="input-label">Last Name</label><input className="input-field" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
                  </div>
                  <div><label className="input-label">Business Name</label><input className="input-field" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} /></div>
                  <div><label className="input-label">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                  <div><label className="input-label">Business Address</label><input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-6 py-2.5 text-white rounded-lg text-sm font-bold" style={{ background: 'linear-gradient(135deg,#4f46e5,#4338ca)' }}>Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Change Password</h3>
              <form className="max-w-md space-y-5" onSubmit={async e => {
                e.preventDefault();
                const [cur, nw, conf] = [e.target.currentPw.value, e.target.newPw.value, e.target.confirmPw.value];
                if (nw !== conf) return toast.error('Passwords do not match');
                try { await userAPI.changePassword({ currentPassword: cur, newPassword: nw }); toast.success('Password updated!'); e.target.reset(); }
                catch(err) { toast.error(err.response?.data?.message || 'Failed to update password'); }
              }}>
                <div><label className="input-label">Current Password</label><input name="currentPw" type="password" className="input-field" required /></div>
                <div><label className="input-label">New Password</label><input name="newPw" type="password" className="input-field" required /></div>
                <div><label className="input-label">Confirm New Password</label><input name="confirmPw" type="password" className="input-field" required /></div>
                <button type="submit" className="px-6 py-2.5 text-white rounded-lg text-sm font-bold" style={{ background: 'linear-gradient(135deg,#4f46e5,#4338ca)' }}>Update Password</button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h3>
              <div className="space-y-4 max-w-md">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'sms', label: 'SMS Alerts', desc: 'Urgent texts for payment & bookings' },
                  { key: 'bookings', label: 'New Booking Requests', desc: 'Alert when a student applies' },
                  { key: 'payments', label: 'Payment Submissions', desc: 'When a tenant uploads bank slip' },
                  { key: 'messages', label: 'New Messages', desc: 'Tenant & applicant messages' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{n.label}</p>
                      <p className="text-xs text-slate-500">{n.desc}</p>
                    </div>
                    <button onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifs[n.key] ? '' : 'bg-slate-200'}`}
                      style={notifs[n.key] ? { background: 'linear-gradient(135deg,#4f46e5,#4338ca)' } : {}}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifs[n.key] ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => toast.success('Preferences saved!')} className="w-full py-2.5 text-white rounded-xl font-bold text-sm mt-4" style={{ background: 'linear-gradient(135deg,#4f46e5,#4338ca)' }}>Save Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-red-600 mb-2">Delete Account</h3>
              <p className="text-slate-500 text-sm mb-6">Permanently delete your landlord account. All property listings and tenant records will be removed.</p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-700 mb-1">⚠️ This will permanently:</p>
                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                  <li>Remove all property listings</li>
                  <li>Terminate all active tenant bookings</li>
                  <li>Delete all payment records</li>
                </ul>
              </div>
              <div className="mb-4">
                <label className="input-label">Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm</label>
                <input className="input-field border-red-200" placeholder="DELETE" />
              </div>
              <button onClick={() => toast.error('Please contact support to delete your account.')} className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
                Delete My Account
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
