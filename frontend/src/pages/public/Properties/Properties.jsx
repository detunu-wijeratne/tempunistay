import './Properties.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Home } from 'lucide-react';
import Navbar from 'components/shared/Navbar/Navbar';
import Footer from 'components/shared/Footer/Footer';
import { propertyAPI } from 'services/api';

const typeLabels = { studio: 'Studio', shared_house: 'Shared House', apartment: 'Apartment', room: 'Room' };

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
];

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', maxPrice: '' });

  useEffect(() => {
    propertyAPI.getAll()
      .then(r => setProperties(r.data.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.address.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <section className="px-6 md:px-24 py-14 bg-white border-b border-slate-100">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Browse Properties</h1>
        <p className="text-slate-500 mb-8">Find verified student accommodation near your campus.</p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input className="input-icon w-full" placeholder="Search by name or location..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field md:w-48" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select className="input-field md:w-48" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}>
            <option value="">Any Price</option>
            <option value="20000">Under LKR 20,000</option>
            <option value="35000">Under LKR 35,000</option>
            <option value="50000">Under LKR 50,000</option>
            <option value="70000">Under LKR 70,000</option>
          </select>
        </div>
      </section>

      <section className="px-6 md:px-24 py-12">
        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading properties...</p>
        ) : (
          <>
            <p className="text-slate-500 mb-6 font-medium">{filtered.length} properties found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p, idx) => (
                <div key={p._id} className="property-card group">
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={p.images?.[0] || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      alt={p.title}
                    />
                    {!p.isAvailable && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <span className="badge badge-red text-sm">Not Available</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-blue">{typeLabels[p.type] || p.type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-lg text-slate-900">{p.title}</h4>
                      <div className="text-lg font-bold text-slate-900">LKR {p.price?.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                    </div>
                    <div className="flex gap-4 text-xs font-medium text-slate-500 mb-5 mt-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> {p.address}</span>
                      {p.distanceToCampus && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> {p.distanceToCampus} from campus</span>}
                    </div>
                    <Link to={`/properties/${p._id}`} className="block w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm text-center hover:bg-blue-700 transition">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <Home className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold">No properties found.</p>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
