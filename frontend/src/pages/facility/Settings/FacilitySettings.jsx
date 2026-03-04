import './FacilitySettings.css';
import { useState } from 'react';
import { User, ShieldCheck, Bell, Users, Trash2 } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../facilityNav';
import { useAuth } from 'context/AuthContext';
import { userAPI } from 'services/api';
import toast from 'react-hot-toast';

const accentStyle = { background: 'linear-gradient(135deg,#0f766e,#0d9488)' };

const tabs = [
  { id: 'profile',   label: 'Company Profile', icon: User },
  { id: 'staff',     label: 'Staff Members',   icon: Users },
  { id: 'security',  label: 'Security',        icon: ShieldCheck },
  { id: 'notifs',    label: 'Notifications',   icon: Bell },
  { id: 'danger',    label: 'Delete Account',  icon: Trash2, danger: true },
];

const initialStaff = [
  { id: 1, name: 'Nimal Perera', role: 'Plumber',     status: 'active', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 2, name: 'Sarah Jayawardena', role: 'Cleaner', status: 'active', avatar: 'https://i.pravatar.cc/150?img=23' },
  { id: 3, name: 'Mike Fernando', role: 'Electrician', status: 'active', avatar: 'https://i.pravatar.cc/150?img=52' },
  { id: 4, name: 'Raju Perera', role: 'Multi-skill',  status: 'on_leave', avatar: 'https://i.pravatar.cc/150?img=14' },
];

export default function FacilitySettings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', businessName: user?.businessName || '', phone: '', services: 'Maintenance, Cleaning, Laundry' });
  const [staff, setStaff] = useState(initialStaff);
  const [notifs, setNotifs] = useState({ email: true, sms: true, urgentJobs: true, staffUpdates: true, reports: false });

  return (
    <DashboardLayout navItems={navItems} accentColor="teal">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Account Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm sticky top-4">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm mb-2 transition-all text-left
                  ${t.danger ? 'text-red-600 border border-red-100 bg-red-50 hover:bg-red-100' : activeTab === t.id ? 'text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                style={activeTab === t.id && !t.danger ? accentStyle : {}}>
                <t.icon className="w-5 h-5" />{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6">
                <div><h3 className="text-xl font-bold text-slate-800">Company Profile</h3><p className="text-sm text-slate-500">Your facility service provider profile.</p></div>
                <button onClick={() => setEditing(!editing)} className="text-sm text-teal-600 font-bold border border-teal-200 bg-white px-4 py-2 rounded-lg hover:bg-teal-50">{editing ? 'Cancel' : 'Edit'}</button>
              </div>
              {!editing ? (
                <div className="flex gap-8">
                  <div className="shrink-0 text-center">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl border-4 border-white shadow-md" style={accentStyle}>🔧</div>
                    <span className="mt-3 inline-block bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">Facility Provider</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-5">
                    {[
                      { label:'First Name', value: user?.firstName },
                      { label:'Last Name',  value: user?.lastName },
                      { label:'Company',    value: user?.businessName || 'CleanPro Services' },
                      { label:'Email',      value: user?.email },
                      { label:'Phone',      value: form.phone || '+94 77 000 0000' },
                      { label:'Services',   value: form.services },
                    ].map(f => (
                      <div key={f.label}><label className="block text-xs font-bold text-slate-400 uppercase mb-1">{f.label}</label><p className="font-semibold text-slate-800">{f.value}</p></div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); toast.success('Profile updated!'); setEditing(false); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="input-label">First Name</label><input className="input-field" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
                    <div><label className="input-label">Last Name</label><input className="input-field" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
                  </div>
                  <div><label className="input-label">Company Name</label><input className="input-field" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} /></div>
                  <div><label className="input-label">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                  <div><label className="input-label">Services Offered</label><input className="input-field" value={form.services} onChange={e => setForm({...form, services: e.target.value})} /></div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-6 py-2.5 text-white rounded-lg text-sm font-bold" style={accentStyle}>Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="glass-panel p-8">
              <div className="flex justify-between items-center mb-6">
                <div><h3 className="text-xl font-bold text-slate-800">Staff Members</h3><p className="text-sm text-slate-500">Manage your field team.</p></div>
                <button onClick={() => toast.success('Staff invite sent!')} className="px-4 py-2 text-white rounded-lg text-sm font-bold" style={accentStyle}>+ Add Staff</button>
              </div>
              <div className="space-y-3">
                {staff.map(s => (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-white">
                    <img src={s.avatar} className="w-11 h-11 rounded-full border-2 border-white shadow-sm" alt="" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.role}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {s.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                    <button onClick={() => { setStaff(prev => prev.filter(m => m.id !== s.id)); toast.success('Staff removed'); }}
                      className="text-xs text-red-500 hover:underline font-bold">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Change Password</h3>
              <form className="max-w-md space-y-5" onSubmit={e => { e.preventDefault(); toast.success('Password updated!'); }}>
                <div><label className="input-label">Current Password</label><input type="password" className="input-field" required /></div>
                <div><label className="input-label">New Password</label><input type="password" className="input-field" required /></div>
                <div><label className="input-label">Confirm Password</label><input type="password" className="input-field" required /></div>
                <button type="submit" className="px-6 py-2.5 text-white rounded-lg text-sm font-bold" style={accentStyle}>Update Password</button>
              </form>
            </div>
          )}

          {activeTab === 'notifs' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h3>
              <div className="space-y-4 max-w-md">
                {[
                  { key: 'email',        label: 'Email Notifications',  desc: 'Daily summaries and alerts' },
                  { key: 'sms',          label: 'SMS Alerts',           desc: 'Urgent job notifications' },
                  { key: 'urgentJobs',   label: 'Urgent Job Alerts',    desc: 'Immediate alert for high-priority requests' },
                  { key: 'staffUpdates', label: 'Staff Status Updates', desc: 'When staff complete or accept jobs' },
                  { key: 'reports',      label: 'Weekly Reports',       desc: 'Auto-send performance summary' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white">
                    <div><p className="font-bold text-slate-800 text-sm">{n.label}</p><p className="text-xs text-slate-500">{n.desc}</p></div>
                    <button onClick={() => setNotifs(p => ({...p, [n.key]: !p[n.key]}))}
                      className="relative w-11 h-6 rounded-full transition-colors"
                      style={notifs[n.key] ? accentStyle : { background: '#cbd5e1' }}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifs[n.key] ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => toast.success('Preferences saved!')} className="w-full py-2.5 text-white rounded-xl font-bold text-sm mt-4" style={accentStyle}>Save Preferences</button>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-red-600 mb-2">Delete Account</h3>
              <p className="text-slate-500 text-sm mb-6">Permanently remove your facility provider account.</p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-700 mb-1">⚠️ This will permanently:</p>
                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                  <li>Remove all staff assignments</li>
                  <li>Cancel all active service requests</li>
                  <li>Delete all job history and reports</li>
                </ul>
              </div>
              <div className="mb-4"><label className="input-label">Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm</label><input className="input-field border-red-200" placeholder="DELETE" /></div>
              <button onClick={() => toast.error('Please contact support to delete your account.')} className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Delete My Account</button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
