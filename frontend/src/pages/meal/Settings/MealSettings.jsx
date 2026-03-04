import './MealSettings.css';
import { useState } from 'react';
import { User, ShieldCheck, Bell, Clock, Trash2 } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../mealNav';
import { useAuth } from 'context/AuthContext';
import { userAPI } from 'services/api';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile',       label: 'Business Profile', icon: User },
  { id: 'hours',         label: 'Service Hours',    icon: Clock },
  { id: 'security',      label: 'Security',         icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
  { id: 'danger',        label: 'Delete Account',   icon: Trash2, danger: true },
];

const defaultHours = {
  breakfast: { from: '07:00', to: '10:00', enabled: true },
  lunch:     { from: '11:00', to: '14:00', enabled: true },
  dinner:    { from: '18:00', to: '21:00', enabled: false },
};

export default function MealSettings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', businessName: user?.businessName || '', phone: '', location: '' });
  const [hours, setHours] = useState(defaultHours);
  const [notifs, setNotifs] = useState({ email: true, sms: true, newOrders: true, lowStock: true, reviews: false });

  const accentStyle = { background: 'linear-gradient(135deg,#ea580c,#c2410c)' };

  return (
    <DashboardLayout navItems={navItems} accentColor="orange">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Account Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Tab sidebar */}
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
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6">
                <div><h3 className="text-xl font-bold text-slate-800">Business Profile</h3><p className="text-sm text-slate-500">Your meal provider profile visible to students.</p></div>
                <button onClick={() => setEditing(!editing)} className="text-sm text-orange-600 font-bold border border-orange-200 bg-white px-4 py-2 rounded-lg hover:bg-orange-50">{editing ? 'Cancel' : 'Edit'}</button>
              </div>
              {!editing ? (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="shrink-0 text-center">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl border-4 border-white shadow-md" style={accentStyle}>🍽️</div>
                    <span className="mt-3 inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Meal Provider</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-6">
                    {[
                      { label: 'First Name',     value: user?.firstName },
                      { label: 'Last Name',      value: user?.lastName },
                      { label: 'Business Name',  value: user?.businessName || 'Campus Bites' },
                      { label: 'Email',          value: user?.email },
                      { label: 'Phone',          value: form.phone || '+94 77 000 0000' },
                      { label: 'Location',       value: form.location || 'Near Main Gate, University' },
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
                  <div><label className="input-label">Business Name</label><input className="input-field" value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} /></div>
                  <div><label className="input-label">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                  <div><label className="input-label">Location / Address</label><input className="input-field" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="px-6 py-2.5 text-white rounded-lg text-sm font-bold" style={accentStyle}>Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Hours */}
          {activeTab === 'hours' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Service Hours</h3>
              <p className="text-sm text-slate-500 mb-6">Set your kitchen operating hours for each meal period.</p>
              <div className="space-y-4 max-w-lg">
                {Object.entries(hours).map(([meal, h]) => (
                  <div key={meal} className={`p-5 rounded-xl border-2 transition ${h.enabled ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200 bg-slate-50 opacity-70'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-slate-800 capitalize">{meal}</p>
                      <button onClick={() => setHours(prev => ({ ...prev, [meal]: { ...prev[meal], enabled: !h.enabled } }))}
                        className={`relative w-11 h-6 rounded-full transition-colors`}
                        style={h.enabled ? accentStyle : { background: '#cbd5e1' }}>
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${h.enabled ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="time" value={h.from} disabled={!h.enabled} onChange={e => setHours(prev => ({ ...prev, [meal]: { ...prev[meal], from: e.target.value } }))}
                        className="input-field py-2 text-sm disabled:opacity-50" />
                      <span className="text-slate-400 font-bold">to</span>
                      <input type="time" value={h.to} disabled={!h.enabled} onChange={e => setHours(prev => ({ ...prev, [meal]: { ...prev[meal], to: e.target.value } }))}
                        className="input-field py-2 text-sm disabled:opacity-50" />
                    </div>
                  </div>
                ))}
                <button onClick={() => toast.success('Hours saved!')} className="w-full py-2.5 text-white rounded-xl font-bold text-sm mt-2" style={accentStyle}>Save Hours</button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Change Password</h3>
              <form className="max-w-md space-y-5" onSubmit={e => { e.preventDefault(); toast.success('Password updated!'); }}>
                <div><label className="input-label">Current Password</label><input type="password" className="input-field" required /></div>
                <div><label className="input-label">New Password</label><input type="password" className="input-field" required /></div>
                <div><label className="input-label">Confirm New Password</label><input type="password" className="input-field" required /></div>
                <button type="submit" className="px-6 py-2.5 text-white rounded-lg text-sm font-bold" style={accentStyle}>Update Password</button>
              </form>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h3>
              <div className="space-y-4 max-w-md">
                {[
                  { key: 'email',     label: 'Email Notifications', desc: 'Daily summary and alerts' },
                  { key: 'sms',       label: 'SMS Alerts',          desc: 'Critical kitchen alerts via SMS' },
                  { key: 'newOrders', label: 'New Orders',          desc: 'Alert for every incoming order' },
                  { key: 'lowStock',  label: 'Low Stock Warnings',  desc: 'When an item drops below 20%' },
                  { key: 'reviews',   label: 'Customer Reviews',    desc: 'When students leave feedback' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white">
                    <div><p className="font-bold text-slate-800 text-sm">{n.label}</p><p className="text-xs text-slate-500">{n.desc}</p></div>
                    <button onClick={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))}
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

          {/* Danger */}
          {activeTab === 'danger' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-red-600 mb-2">Delete Account</h3>
              <p className="text-slate-500 text-sm mb-6">Permanently remove your meal provider account and all menu listings.</p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-700 mb-1">⚠️ This will permanently:</p>
                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                  <li>Remove all menu items</li>
                  <li>Cancel all pending orders</li>
                  <li>Delete all sales history</li>
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
