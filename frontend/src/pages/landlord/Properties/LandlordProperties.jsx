import './LandlordProperties.css';
import { useState, useEffect } from 'react';
import { MapPin, Plus, Eye, Edit3, Trash2 } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../landlordNav';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from 'services/api';
import toast from 'react-hot-toast';

export default function LandlordProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyAPI.getMy()
      .then(r => setProperties(r.data.data))
      .catch(() => toast.error('Failed to load properties'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this property?')) return;
    try {
      await propertyAPI.delete(id);
      setProperties(p => p.filter(x => x._id !== id));
      toast.success('Property removed');
    } catch { toast.error('Failed to delete property'); }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="indigo">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Properties</h1>
          <p className="text-slate-500 mt-1">Manage listings, update details, and check occupancy.</p>
        </div>
        <button onClick={() => navigate('/landlord/add-property')}
          className="px-5 py-2.5 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}>
          <Plus className="w-5 h-5" /> Add Property
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading properties...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => (
            <div key={p._id} className="glass-panel p-5 flex flex-col group hover:shadow-lg transition duration-300">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={p.title} />
                <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-md border ${p.isAvailable ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                  {p.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {p.address}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-white/50 p-2 rounded-lg border border-slate-100">
                  <span className="block text-xs text-slate-400 font-bold uppercase">Rent</span>
                  <span className="font-bold text-slate-800">LKR {p.price?.toLocaleString()}</span>
                </div>
                <div className="bg-white/50 p-2 rounded-lg border border-slate-100">
                  <span className="block text-xs text-slate-400 font-bold uppercase">Type</span>
                  <span className="font-bold text-slate-800 capitalize">{p.type}</span>
                </div>
              </div>
              <div className="mt-auto flex gap-2 border-t border-slate-200 pt-4">
                <button onClick={() => navigate(`/properties/${p._id}`)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button className="flex-1 py-2 bg-white border border-slate-200 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-2 bg-white border border-slate-200 text-red-500 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <div onClick={() => navigate('/landlord/add-property')}
            className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition min-h-[300px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Plus className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Add New Property</h3>
            <p className="text-slate-400 text-sm mt-1">List a room or house</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
