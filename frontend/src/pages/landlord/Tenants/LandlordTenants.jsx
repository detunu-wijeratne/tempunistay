import './LandlordTenants.css';
import { useState, useEffect } from 'react';
import { Search, MessageCircle, User } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../landlordNav';
import { bookingAPI } from 'services/api';

export default function LandlordTenants() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    bookingAPI.getLandlord()
      .then(r => {
        // Only show approved/active bookings as tenants
        const approved = (r.data.data || []).filter(b => b.status === 'approved' || b.status === 'active');
        setBookings(approved);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter(b => {
    const name = `${b.tenant?.firstName} ${b.tenant?.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <DashboardLayout navItems={navItems} accentColor="indigo">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Tenant Directory</h1>
          <p className="text-slate-500 mt-1">Students with approved bookings at your properties.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-extrabold text-slate-900">{bookings.length}</p>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1">Total Tenants</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-extrabold text-green-600">{bookings.filter(b => b.status === 'active').length}</p>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1">Active</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-extrabold text-indigo-600">{bookings.filter(b => b.status === 'approved').length}</p>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1">Approved</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-white/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80">
              <tr>
                {['Tenant', 'Contact', 'Property', 'Move-in Date', 'Rent', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`text-left text-xs uppercase tracking-wide text-slate-400 font-bold px-4 py-4 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400">No approved tenants yet. Approve bookings to see tenants here.</td></tr>
              )}
              {filtered.map(b => (
                <tr key={b._id} className="border-t border-slate-100 hover:bg-white/60 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {b.tenant?.firstName?.[0]}{b.tenant?.lastName?.[0]}
                      </div>
                      <p className="font-bold text-slate-800">{b.tenant?.firstName} {b.tenant?.lastName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 text-sm">{b.tenant?.email}</td>
                  <td className="px-4 py-4 font-medium text-slate-800">{b.property?.title || 'N/A'}</td>
                  <td className="px-4 py-4 text-slate-600">{b.startDate ? new Date(b.startDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">LKR {b.monthlyRent?.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`badge ${b.status === 'active' ? 'badge-green' : 'badge-blue'}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100" title="View">
                      <User className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
