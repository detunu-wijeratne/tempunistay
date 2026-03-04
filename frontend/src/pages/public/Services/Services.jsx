import './Services.css';
import Navbar from 'components/shared/Navbar/Navbar';
import Footer from 'components/shared/Footer/Footer';
import { Link } from 'react-router-dom';
import { Sparkles, Wrench, Shirt } from 'lucide-react';

const services = [
  { icon: <Sparkles className="w-6 h-6" />, title: 'Professional Cleaning', desc: 'Book a deep clean or regular tidying for your room.', img: 'https://images.unsplash.com/photo-1686178827149-6d55c72d81df', from: 'From $25' },
  { icon: <Wrench className="w-6 h-6" />, title: 'Maintenance Repairs', desc: 'Fix plumbing, electrical, or appliance issues quickly.', img: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307', from: 'From $30' },
  { icon: <Shirt className="w-6 h-6" />, title: 'Laundry Pickup', desc: 'Schedule pickup and delivery for wash & fold services.', img: 'https://images.unsplash.com/photo-1696546761269-a8f9d2b80512', from: 'From $15' },
];

export default function Services() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <section className="px-6 md:px-24 py-16 bg-white border-b border-slate-100">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Essential Services</h1>
        <p className="text-slate-500">Everything you need to run your student home.</p>
      </section>
      <section className="px-6 md:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map(s => (
            <div key={s.title} className="group cursor-pointer">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition z-10" />
                <img src={s.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={s.title} />
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="bg-white p-2 rounded-lg inline-block text-blue-600 mb-2 shadow-sm">{s.icon}</div>
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900">{s.title}</h4>
              <p className="text-sm text-slate-500 mt-1 mb-3">{s.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">{s.from}</span>
                <Link to="/register" className="px-4 py-2 btn-primary text-white rounded-lg font-bold text-sm">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
