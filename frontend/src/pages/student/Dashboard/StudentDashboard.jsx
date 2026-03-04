import './StudentDashboard.css';
import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { useAuth } from 'context/AuthContext';

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

const stats = [
  { label: 'Booking Status', value: 'Active', sub: 'Room 4B, Park Towers', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Rent Due', value: '$450', sub: 'Due in 12 days', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Meal Orders', value: '3', sub: 'This week', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Open Requests', value: '1', sub: 'Maintenance pending', color: 'text-red-600', bg: 'bg-red-50' },
];

const recentActivity = [
  { text: 'Rent payment confirmed', time: '2 hours ago', badge: 'badge-green', badgeText: 'Paid' },
  { text: 'Laundry pickup scheduled for tomorrow', time: '5 hours ago', badge: 'badge-blue', badgeText: 'Scheduled' },
  { text: 'Maintenance request submitted', time: '1 day ago', badge: 'badge-orange', badgeText: 'Pending' },
  { text: 'Booking approved by landlord', time: '3 days ago', badge: 'badge-green', badgeText: 'Approved' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <div className={`w-4 h-4 rounded-full ${s.bg === 'bg-green-50' ? 'bg-green-500' : s.bg === 'bg-blue-50' ? 'bg-blue-500' : s.bg === 'bg-orange-50' ? 'bg-orange-500' : 'bg-red-500'}`} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Booking */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-5">Current Accommodation</h3>
          <div className="flex gap-4">
            <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300" className="w-32 h-28 object-cover rounded-xl" alt="Room" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">Park Towers - Room 4B</h4>
                  <p className="text-sm text-slate-500 mt-1">12 University Road, District</p>
                </div>
                <span className="badge badge-green">Active</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 rounded-xl p-2">
                  <p className="text-lg font-extrabold text-slate-900">$450</p>
                  <p className="text-xs text-slate-400">Monthly</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <p className="text-lg font-extrabold text-slate-900">1.2km</p>
                  <p className="text-xs text-slate-400">to Campus</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2">
                  <p className="text-lg font-extrabold text-green-600">12d</p>
                  <p className="text-xs text-slate-400">Rent Due</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-5">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{a.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{a.time}</span>
                    <span className={`badge ${a.badge}`}>{a.badgeText}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 glass-panel p-6">
        <h3 className="font-bold text-lg text-slate-900 mb-5">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pay Rent', path: '/student/payments', bg: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
            { label: 'Order Meal', path: '/student/meals', bg: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
            { label: 'Request Cleaning', path: '/student/cleaning', bg: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
            { label: 'Report Issue', path: '/student/maintenance', bg: 'bg-red-50 text-red-600 hover:bg-red-100' },
          ].map(({ label, path, bg }) => (
            <a key={path} href={path} className={`${bg} font-bold py-4 rounded-2xl text-center text-sm transition`}>{label}</a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
