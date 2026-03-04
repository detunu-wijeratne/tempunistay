import './LandlordAddProperty.css';
import { useState } from 'react';
import { ImagePlus, Check, X } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { navItems } from '../landlordNav';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from 'services/api';
import toast from 'react-hot-toast';

const amenityOptions = ['WiFi', 'A/C', 'Attached Bath', 'Kitchen', 'Study Desk', 'Parking', 'Security', 'Laundry'];
const typeMap = { room: 'room', apartment: 'apartment', house: 'shared_house' };

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export default function LandlordAddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', distance: '', rent: '', maxOccupants: '', description: '', propertyType: 'room' });
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const processed = await Promise.all(files.map(async (file) => ({
      file,
      preview: URL.createObjectURL(file),
      base64: await fileToBase64(file),
    })));
    setImages(prev => [...prev, ...processed].slice(0, 5));
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await propertyAPI.create({
        title: form.name,
        address: form.address,
        distanceToCampus: form.distance,
        price: Number(form.rent),
        maxOccupants: Number(form.maxOccupants) || 1,
        type: typeMap[form.propertyType] || form.propertyType,
        description: form.description || 'No description provided.',
        amenities,
        isAvailable: true,
        images: images.map(img => img.base64),
      });
      toast.success('Property published successfully!');
      navigate('/landlord/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} accentColor="indigo">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Add New Property</h1>
        <p className="text-slate-500 mt-1">Fill in the details to list your property for students.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-3">Basic Information</h3>
          <div className="space-y-5">
            <div>
              <label className="input-label">Property Name</label>
              <input className="input-field" placeholder="e.g. Sunny Side Annex" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Address</label>
                <input className="input-field" placeholder="Street Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
              </div>
              <div>
                <label className="input-label">Distance to Campus</label>
                <input className="input-field" placeholder="e.g. 500m or 1.2km" value={form.distance} onChange={e => setForm({...form, distance: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="input-label">Property Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['room', 'apartment', 'house'].map(type => (
                  <div key={type} onClick={() => setForm({...form, propertyType: type})}
                    className={`p-3 rounded-xl border-2 cursor-pointer capitalize text-sm font-bold text-center transition ${form.propertyType === type ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-3">Pricing &amp; Specs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="input-label">Monthly Rent (LKR)</label>
              <input type="number" className="input-field" placeholder="35000" value={form.rent} onChange={e => setForm({...form, rent: e.target.value})} required />
            </div>
            <div>
              <label className="input-label">Max Occupancy</label>
              <input type="number" className="input-field" placeholder="4" min="1" value={form.maxOccupants} onChange={e => setForm({...form, maxOccupants: e.target.value})} required />
            </div>
          </div>
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-3">Amenities</h3>
          <div className="flex gap-3 flex-wrap">
            {amenityOptions.map(a => (
              <label key={a} onClick={() => toggleAmenity(a)}
                className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition select-none ${amenities.includes(a) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {amenities.includes(a) && <Check className="w-4 h-4" />}
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-3">Photos</h3>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden h-28 group">
                  <img src={img.preview} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                    <X className="w-4 h-4" />
                  </button>
                  {idx === 0 && <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">Main</span>}
                </div>
              ))}
              {images.length < 5 && (
                <label className="h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition">
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                  <ImagePlus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-400 font-bold">Add More</span>
                </label>
              )}
            </div>
          )}
          {images.length === 0 && (
            <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition">
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
              <ImagePlus className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <span className="text-sm font-bold text-indigo-600">Click to Upload Photos</span>
              <p className="text-xs text-slate-400 mt-1">JPG or PNG - Max 5 photos - First photo is the cover</p>
            </label>
          )}
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-3">Description</h3>
          <textarea className="input-field h-32 resize-none" placeholder="Describe the property, nearby facilities, house rules..."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-8 py-3 text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-60 transition"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}>
            {loading ? 'Publishing...' : 'Publish Property'}
          </button>
          <button type="button" onClick={() => navigate('/landlord/properties')} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
