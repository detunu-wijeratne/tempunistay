import './MealMenu.css';
import { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../mealNav';
import { useNavigate } from 'react-router-dom';
import { mealAPI } from 'services/api';
import toast from 'react-hot-toast';

const foodImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400',
];

export default function MealMenu() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    mealAPI.getMyPlans()
      .then(r => setItems(r.data.data))
      .catch(() => toast.error('Failed to load menu'))
      .finally(() => setLoading(false));
  }, []);

  const toggleAvail = async (id, current) => {
    try {
      const r = await mealAPI.updatePlan(id, { isActive: !current });
      setItems(prev => prev.map(i => i._id === id ? r.data.data : i));
    } catch { toast.error('Failed to update'); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      await mealAPI.deletePlan(id);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Item removed');
    } catch { toast.error('Failed to delete'); }
  };

  const categories = ['All', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <DashboardLayout navItems={navItems} accentColor="orange">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Menu Management</h1>
        <button onClick={() => navigate('/meal/add-item')} className="px-5 py-2.5 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </div>

      <div className="flex gap-2 mb-8 bg-white/60 p-1.5 rounded-xl w-fit border border-slate-200">
        {categories.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${filter === f ? 'text-white shadow-sm' : 'text-slate-600 hover:bg-orange-50'}`}
            style={filter === f ? { background: 'linear-gradient(135deg,#ea580c,#c2410c)' } : {}}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <p className="text-slate-400 text-center py-12">Loading menu...</p> : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No menu items yet.</p>
          <button onClick={() => navigate('/meal/add-item')} className="px-5 py-2.5 text-white rounded-xl font-bold" style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>Add First Item</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item, idx) => (
            <div key={item._id} className={`glass-panel p-4 flex flex-col group hover:shadow-lg transition`}>
              <div className={`relative h-40 rounded-xl overflow-hidden mb-4 ${!item.isActive ? 'grayscale' : ''}`}>
                <img src={item.image || foodImages[idx % foodImages.length]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={item.name} />
                <span className={`absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm ${item.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                  {item.isActive ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                <p className="font-bold text-orange-600 text-sm flex-shrink-0 ml-2">Rs {item.price?.toLocaleString()}</p>
              </div>
              <p className="text-xs text-slate-400 mb-4">{item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Meal'}</p>
              <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3">
                <button onClick={() => toggleAvail(item._id, item.isActive)}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${item.isActive ? '' : 'bg-slate-300'}`}
                  style={item.isActive ? { background: 'linear-gradient(135deg,#ea580c,#c2410c)' } : {}}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.isActive ? 'left-5' : 'left-0.5'}`} />
                </button>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteItem(item._id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
