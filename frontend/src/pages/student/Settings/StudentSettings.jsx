import './StudentSettings.css';
import { useState } from 'react';
import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings, User, ShieldCheck, Bell, Trash2, Lock, Camera } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { userAPI } from 'services/api';
import { useAuth } from 'context/AuthContext';
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

const tabs = [
  { id: 'profile', label: 'Public Profile', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Delete Account', icon: Trash2, danger: true },
];

export default function StudentSettings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '', university: user?.university || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifs, setNotifs] = useState({ email: true, sms: false, bookings: true, payments: true, services: true });
  const [loading, setLoading] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(profileForm);
      updateUser(data.data);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await userAPI.changePassword(pwForm);
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs nav */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm sticky top-4">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm mb-2 transition-all text-left
                  ${tab.danger
                    ? 'text-red-600 border border-red-100 bg-red-50 hover:bg-red-100'
                    : activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'}`}>
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Public Profile</h3>
                  <p className="text-sm text-slate-500">Manage your personal information.</p>
                </div>
                <button onClick={() => setEditing(!editing)} className="text-sm text-blue-600 font-bold border border-blue-200 bg-white px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Completion bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Profile Completion</span><span className="text-blue-600">85%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {!editing ? (
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="shrink-0 text-center relative">
                    <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-extrabold border-4 border-white shadow-md">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <span className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer border border-slate-100">
                      <Camera className="w-4 h-4 text-slate-500" />
                    </span>
                    <span className="mt-3 inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Student</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'First Name', value: user?.firstName },
                      { label: 'Last Name', value: user?.lastName },
                      { label: 'Email', value: user?.email, locked: true },
                      { label: 'Phone', value: user?.phone || '—' },
                      { label: 'University', value: user?.university || '—' },
                      { label: 'Student ID', value: user?.studentId || '—' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{f.label}</label>
                        <p className="text-slate-800 font-semibold flex items-center gap-2">
                          {f.value} {f.locked && <Lock className="w-3 h-3 text-slate-400" />}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={saveProfile} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="input-label">First Name</label><input className="input-field" value={profileForm.firstName} onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} /></div>
                    <div><label className="input-label">Last Name</label><input className="input-field" value={profileForm.lastName} onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} /></div>
                  </div>
                  <div><label className="input-label">Phone Number</label><input className="input-field" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
                  <div><label className="input-label">University</label><input className="input-field" value={profileForm.university} onChange={e => setProfileForm({ ...profileForm, university: e.target.value })} /></div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="px-6 py-2.5 btn-primary text-white rounded-lg text-sm font-bold disabled:opacity-60">{loading ? 'Saving...' : 'Save Changes'}</button>
                    <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Security Settings</h3>
              <form onSubmit={changePassword} className="max-w-md space-y-5">
                <div><label className="input-label">Current Password</label><input type="password" className="input-field" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required /></div>
                <div><label className="input-label">New Password</label><input type="password" className="input-field" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required /></div>
                <div><label className="input-label">Confirm New Password</label><input type="password" className="input-field" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required /></div>
                <button type="submit" disabled={loading} className="px-6 py-2.5 btn-primary text-white rounded-lg text-sm font-bold disabled:opacity-60">{loading ? 'Updating...' : 'Update Password'}</button>
              </form>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h3>
              <div className="space-y-4 max-w-md">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Get texts for urgent updates' },
                  { key: 'bookings', label: 'Booking Updates', desc: 'Approval/rejection alerts' },
                  { key: 'payments', label: 'Payment Reminders', desc: 'Rent due date reminders' },
                  { key: 'services', label: 'Service Updates', desc: 'Status changes on requests' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-white">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{n.label}</p>
                      <p className="text-xs text-slate-500">{n.desc}</p>
                    </div>
                    <button onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifs[n.key] ? 'bg-blue-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notifs[n.key] ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => toast.success('Preferences saved!')} className="w-full py-2.5 btn-primary text-white rounded-xl font-bold text-sm mt-4">Save Preferences</button>
              </div>
            </div>
          )}

          {/* Danger */}
          {activeTab === 'danger' && (
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold text-red-600 mb-2">Delete Account</h3>
              <p className="text-slate-500 text-sm mb-6">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-700 mb-1">⚠️ This will permanently:</p>
                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                  <li>Delete all your bookings and history</li>
                  <li>Cancel any active service requests</li>
                  <li>Remove all payment records</li>
                  <li>Deactivate your account immediately</li>
                </ul>
              </div>
              <div className="mb-4">
                <label className="input-label">Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm</label>
                <input type="text" className="input-field border-red-200 focus:ring-red-100" placeholder="DELETE" />
              </div>
              <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition" onClick={() => toast.error('Account deletion requires contacting support.')}>
                Delete My Account
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
