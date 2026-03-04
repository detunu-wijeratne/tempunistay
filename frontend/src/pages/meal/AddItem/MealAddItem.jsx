import './MealAddItem.css';
import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../mealNav';
import { useNavigate } from 'react-router-dom';
import { mealAPI } from 'services/api';
import toast from 'react-hot-toast';

// Map category display values to what the model enum expects (lowercase)
const CATEGORY_MAP = {
  'Breakfast': 'breakfast',
  'Lunch':     'lunch',
  'Dinner':    'dinner',
  'Short Eats':'snack',
  'Drinks':    'snack',
};

export default function MealAddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: 'Lunch', price: '', description: '', isActive: true, veg: false, spicy: false });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show preview
    setImagePreview(URL.createObjectURL(file));
    // Convert to base64 to store in DB
    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setImagePreview(null); setImageBase64(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mealAPI.createPlan({
        name:        form.name,
        category:    CATEGORY_MAP[form.category] || 'snack',
        price:       Number(form.price),
        description: form.description,
        isActive:    form.isActive,
        image:       imageBase64 || '',
      });
      toast.success(`"${form.name}" added to menu!`);
      navigate('/meal/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="orange">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Add Menu Item</h1>
        <p className="text-slate-500 mt-1">Add a new dish to your daily menu.</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Photo upload */}
          <div className="glass-panel p-8">
            <label className="input-label mb-3 block">Food Photo</label>
            {imagePreview ? (
              <div className="relative w-full h-52 rounded-xl overflow-hidden group">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <button type="button" onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition">
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-3 text-xs font-bold bg-black/50 text-white px-2 py-1 rounded-full">
                  Click X to change photo
                </span>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:bg-slate-50 hover:border-orange-400 transition">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <ImagePlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-orange-600">Upload Food Photo</span>
                <p className="text-xs text-slate-400 mt-1">JPG or PNG (Max 2MB)</p>
              </label>
            )}
          </div>

          {/* Item details */}
          <div className="glass-panel p-8 space-y-5">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-200 pb-3">Item Details</h3>
            <div>
              <label className="input-label">Meal Name</label>
              <input className="input-field" placeholder="e.g. Chicken Kottu" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {['Breakfast', 'Lunch', 'Dinner', 'Short Eats', 'Drinks'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Price (LKR)</label>
                <input type="number" className="input-field" placeholder="450" value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="input-label">Description / Ingredients</label>
              <textarea className="input-field h-24 resize-none" placeholder="Ingredients, spice level, allergens..."
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div>
              <label className="input-label">Tags</label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { key: 'isActive', label: '✅ Available Now' },
                  { key: 'veg',      label: '🥦 Vegetarian' },
                  { key: 'spicy',    label: '🌶️ Spicy' },
                ].map(tag => (
                  <button key={tag.key} type="button" onClick={() => setForm({...form, [tag.key]: !form[tag.key]})}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition ${form[tag.key] ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-60 transition"
              style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
              {loading ? 'Adding...' : 'Add to Menu'}
            </button>
            <button type="button" onClick={() => navigate('/meal/menu')} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
