import './PropertyDetail.css';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Wind, Utensils, Shirt, ArrowLeft, Calendar } from 'lucide-react';
import Navbar from 'components/shared/Navbar/Navbar';
import Footer from 'components/shared/Footer/Footer';
import { useAuth } from 'context/AuthContext';
import { propertyAPI, bookingAPI } from 'services/api';
import toast from 'react-hot-toast';

const amenityIcons = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
  'Air Conditioning': <Wind className="w-4 h-4" />,
  'A/C': <Wind className="w-4 h-4" />,
  'Meals Available': <Utensils className="w-4 h-4" />,
  'Laundry': <Shirt className="w-4 h-4" />,
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
];

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ startDate: '', message: '' });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    propertyAPI.getOne(id)
      .then(r => setProperty(r.data.data))
      .catch(() => { toast.error('Property not found'); navigate('/properties'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to book');
    if (user.role !== 'student') return toast.error('Only students can book properties');
    setBooking(true);
    try {
      await bookingAPI.create({ propertyId: property._id, ...bookingForm });
      toast.success('Booking request sent! The landlord will review your request.');
      setShowBooking(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center py-40 text-slate-400">Loading property...</div>
      <Footer />
    </div>
  );

  if (!property) return null;

  const images = property.images?.length ? property.images : FALLBACK_IMAGES;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="px-6 md:px-24 py-8">
        <Link to="/properties" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:gap-3 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images + Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-4 h-80">
              <img src={images[activeImg]} className="w-full h-full object-cover" alt={property.title} />
            </div>
            <div className="flex gap-3 mb-8">
              {images.map((img, i) => (
                <img key={i} src={img} onClick={() => setActiveImg(i)}
                  className={`h-16 w-24 object-cover rounded-lg cursor-pointer transition ${i === activeImg ? 'ring-2 ring-blue-600' : 'hover:opacity-80'}`} alt="" />
              ))}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{property.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 mb-6">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-500" /> {property.address}</span>
              {property.distanceToCampus && <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-500" /> {property.distanceToCampus} from Campus</span>}
              {property.rating > 0 && <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {property.rating} ({property.reviewCount} reviews)</span>}
            </div>

            <div className="glass-panel p-6 mb-6">
              <h3 className="font-bold text-lg text-slate-900 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed">{property.description}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div className="glass-panel p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold text-sm">
                      {amenityIcons[a]} {a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="glass-panel p-6 sticky top-24">
              <div className="text-3xl font-extrabold text-slate-900 mb-1">
                LKR {property.price?.toLocaleString()}<span className="text-base font-normal text-slate-400"> / month</span>
              </div>
              <div className="mb-4">
                <span className={`badge ${property.isAvailable ? 'badge-green' : 'badge-red'}`}>
                  {property.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xl font-extrabold text-slate-900">{property.bedrooms || 1}</div>
                  <div className="text-xs text-slate-500 font-medium">Bedroom{property.bedrooms > 1 ? 's' : ''}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xl font-extrabold text-slate-900">{property.maxOccupants || 1}</div>
                  <div className="text-xs text-slate-500 font-medium">Max Occupants</div>
                </div>
              </div>

              {property.owner && (
                <div className="mb-4 text-sm text-slate-600">
                  <span className="font-bold">Landlord:</span> {property.owner.firstName} {property.owner.lastName}
                </div>
              )}

              {!showBooking ? (
                <button onClick={() => setShowBooking(true)}
                  className="w-full py-3.5 btn-primary text-white rounded-xl font-bold mb-3"
                  disabled={!property.isAvailable}>
                  {property.isAvailable ? 'Request Booking' : 'Not Available'}
                </button>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="input-label">Move-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="date" className="input-icon" required
                        value={bookingForm.startDate} onChange={e => setBookingForm({ ...bookingForm, startDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Message to Landlord</label>
                    <textarea className="input-field h-24 resize-none" placeholder="Introduce yourself..."
                      value={bookingForm.message} onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })} />
                  </div>
                  <button type="submit" disabled={booking} className="w-full py-3 btn-primary text-white rounded-xl font-bold disabled:opacity-60">
                    {booking ? 'Sending...' : 'Send Request'}
                  </button>
                  <button type="button" onClick={() => setShowBooking(false)} className="w-full py-2.5 btn-secondary rounded-xl font-bold text-sm">
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
