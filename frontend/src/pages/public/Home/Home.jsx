import './Home.css';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Utensils, Wrench, Star, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import Navbar from 'components/shared/Navbar/Navbar';
import Footer from 'components/shared/Footer/Footer';

const featuredProperties = [
  { id: 1, title: 'Modern Studio', price: 400, distance: '1.2km', rating: 4.7, reviews: 100, img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600' },
  { id: 2, title: 'Spacious Shared House', price: 350, distance: '800m', rating: 4.6, reviews: 150, img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600' },
  { id: 3, title: 'Elegant Apartment', price: 500, distance: '800m', rating: 4.9, reviews: 130, img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600' },
];

const mealPlans = [
  { title: 'Balanced Weekly Plan', desc: '7 meals/week, mix of meat & veg.', price: 50, img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600' },
  { title: 'Vegetarian Delight', desc: 'Fresh, plant-based daily meals.', price: 45, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600' },
  { title: 'High Protein Power', desc: 'Perfect for active students.', price: 55, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' },
];

const steps = [
  { n: 1, title: 'Find a Property', desc: 'Browse verified listings that match your preferences.' },
  { n: 2, title: 'Book Your Room', desc: 'Submit a booking request to secure your space.' },
  { n: 3, title: 'Order Meals & Services', desc: 'Manage meals and request cleaning or laundry.' },
  { n: 4, title: 'Enjoy Student Living', desc: 'Everything managed so you can focus on studies.' },
];

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="hero-bg px-6 md:px-24 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="lg:w-1/2 z-10">
          <h1 className="text-5xl lg:text-[3.5rem] font-extrabold leading-[1.15] text-slate-900 mb-6">
            Find Your Perfect <br />
            <span className="text-blue-600">Student Accommodation</span>
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
            Discover and book verified boarding places, order meals, and manage your student living — all in one platform.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/properties" className="px-8 py-3.5 btn-primary text-white rounded-lg font-bold text-lg">
              Browse Properties
            </Link>
            <Link to="/about" className="px-8 py-3.5 btn-secondary rounded-lg font-bold text-lg">
              Learn More
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 w-full z-10">
          <div className="glass-card p-6 rounded-[2rem] max-w-lg ml-auto">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-5 mb-5">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">Cozy Apartment</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900">$450</span>
                    <span className="text-sm font-medium text-slate-400">/ month</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-slate-500 text-sm font-medium">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    500m from Campus
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm font-bold text-slate-700">
                    <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                    <span>4.8 <span className="text-slate-400 font-normal ml-1">★ 1120 Reviews</span></span>
                  </div>
                  <Link to="/properties" className="mt-5 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm border border-blue-100 flex items-center justify-center gap-1 hover:bg-blue-100 transition">
                    View Details <ChevronDown className="w-4 h-4" />
                  </Link>
                </div>
                <div className="w-full sm:w-44 h-44">
                  <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400" className="w-full h-full object-cover rounded-lg shadow-sm" alt="Apartment" />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['photo-1502672260266-1c1ef2d93688','photo-1554995207-c18c203602cb','photo-1493809842364-78817add7ffb','photo-1522771739844-6a9f6d5f14af','photo-1505691938895-1758d7feb511'].map((p) => (
                  <img key={p} src={`https://images.unsplash.com/${p}?w=100`} className="h-12 w-full object-cover rounded hover:opacity-80 cursor-pointer" alt="" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons */}
      <section className="px-6 md:px-24 relative z-20 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <HomeIcon className="w-7 h-7" />, title: 'Verified Boarding', desc: 'Find safe, verified rooms near your campus' },
            { icon: <Utensils className="w-7 h-7" />, title: 'Integrated Meal Service', desc: 'Order and manage your daily meals easily' },
            { icon: <Wrench className="w-7 h-7" />, title: 'Maintenance Requests', desc: 'Request laundry and cleaning services' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white p-8 rounded-2xl shadow-soft border border-slate-50 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5">{icon}</div>
              <h4 className="text-xl font-bold mb-2">{title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="px-6 md:px-24 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Featured Properties</h2>
          <Link to="/properties" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProperties.map((p) => (
            <div key={p.id} className="property-card group">
              <div className="h-56 overflow-hidden">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={p.title} />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-lg text-slate-900">{p.title}</h4>
                  <div className="text-lg font-bold text-slate-900">${p.price}<span className="text-xs font-normal text-slate-400">/mo</span></div>
                </div>
                <div className="flex gap-4 text-xs font-medium text-slate-500 mb-5 mt-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> {p.distance} from Campus</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {p.rating} ({p.reviews})</span>
                </div>
                <Link to={`/properties/${p.id}`} className="block w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm text-center hover:bg-blue-700 transition">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meal Plans */}
      <section className="px-6 md:px-24 py-20 bg-white border-y border-slate-200">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Fresh Meal Plans</h2>
            <p className="text-slate-500 mt-2">Healthy, affordable meals delivered to you.</p>
          </div>
          <Link to="/meals" className="text-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">View Menu <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mealPlans.map((m) => (
            <div key={m.title} className="bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:-translate-y-1 transition duration-300">
              <div className="h-48 overflow-hidden">
                <img src={m.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={m.title} />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg text-slate-900 mb-1">{m.title}</h4>
                <p className="text-sm text-slate-500 mb-4">{m.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-900">${m.price}<span className="text-xs font-normal text-slate-400">/wk</span></span>
                  <Link to="/meals" className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg font-bold text-sm hover:bg-blue-50 transition">View Plan</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-24">
        <div className="flex items-center justify-center mb-16 relative">
          <div className="h-px bg-slate-200 w-full absolute top-1/2 z-0" />
          <h2 className="text-3xl font-extrabold text-slate-900 bg-slate-50 px-6 relative z-10">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full step-circle text-white text-2xl font-bold flex items-center justify-center mb-5">{s.n}</div>
              <h5 className="font-bold text-lg mb-2">{s.title}</h5>
              <p className="text-sm text-slate-500 leading-relaxed px-4">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-wave-bg py-32 px-6 text-center mt-10">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-[2.5rem] font-bold text-slate-900 mb-6 leading-tight">
            Make Student Living Simple & Stress-Free.
          </h2>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg">
            Join hundreds of university students using UniStay to find their perfect boarding place and manage their living with ease.
          </p>
          <Link to="/register" className="inline-block px-10 py-3.5 btn-primary text-white rounded-lg font-bold text-lg shadow-xl">
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
