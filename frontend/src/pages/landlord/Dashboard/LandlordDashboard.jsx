import './LandlordDashboard.css';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Building2, BookOpen, Users, CreditCard, MessageSquare, Settings, Plus } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems as landlordNav } from '../landlordNav';
import { Link } from 'react-router-dom';
import { propertyAPI, bookingAPI } from 'services/api';

export default function LandlordDashboard() {
  const [stats, setStats] = useState({ properties: 0, activeTenants: 0, pendingRequests: 0, monthlyRevenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    Promise.all([
      propertyAPI.getMy().catch(() => ({ data: { data: [] } })),
      bookingAPI.getLandlord().catch(() => ({ data: { data: [] } })),
    ]).then(([propRes, bookRes]) => {
      const properties = propRes.data.data || [];
      const bookings   = bookRes.data.data || [];

      const activeTenants   = bookings.filter(b => b.status === 'approved' || b.status === 'active').length;
      const pendingRequests  = bookings.filter(b => b.status === 'pending').length;
      const monthlyRevenue  = bookings
        .filter(b => b.status === 'approved' || b.status === 'active')
        .reduce((sum, b) => sum + (b.monthlyRent || 0), 0);

      setStats({ properties: properties.length, activeTenants, pendingRequests, monthlyRevenue });
      setRecentBookings(bookings.slice(0, 5));
    });
  }, []);

  const statCards = [
    { label: 'Total Properties', value: stats.properties, sub: 'Listed properties', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Tenants',   value: stats.activeTenants, sub: 'Approved bookings', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Monthly Revenue',  value: `LKR ${(stats.monthlyRevenue/1000).toFixed(0)}k`, sub: 'From active tenants', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Requests', value: stats.pendingRequests, sub: 'Awaiting your review', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <DashboardLayout navItems={landlordNav} accentColor="indigo">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">Landlord Overview</h2>
        <Link to="/landlord/properties/add" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-900">Recent Booking Requests</h3>
          <Link to="/landlord/bookings" className="text-indigo-600 text-sm font-bold">View All</Link>
        </div>
        <div className="space-y-3">
          {recentBookings.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No bookings yet</p>}
          {recentBookings.map((b, i) => (
            <div key={b._id || i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-900 text-sm">{b.tenant?.firstName} {b.tenant?.lastName}</p>
                <p className="text-xs text-slate-400">{b.property?.title} · {new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`badge ${b.status === 'approved' || b.status === 'active' ? 'badge-green' : b.status === 'rejected' || b.status === 'cancelled' ? 'badge-red' : 'badge-orange'}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
