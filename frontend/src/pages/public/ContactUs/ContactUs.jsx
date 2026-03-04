import './ContactUs.css';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from 'components/shared/Navbar/Navbar';
import Footer from 'components/shared/Footer/Footer';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="px-6 md:px-24 py-16 bg-white border-b border-slate-100">
        <div className="max-w-2xl">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">GET IN TOUCH</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Contact Us</h1>
          <p className="text-slate-500 text-lg">Have a question or need help? Our team is here for you.</p>
        </div>
      </section>

      <section className="px-6 md:px-24 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Info cards */}
          <div className="space-y-6">
            {[
              { icon: <Mail className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', title: 'Email Us', lines: ['support@unistay.lk', 'info@unistay.lk'] },
              { icon: <Phone className="w-5 h-5 text-green-600" />, bg: 'bg-green-50', title: 'Call Us', lines: ['+94 11 234 5678', 'Mon–Fri, 8am–6pm'] },
              { icon: <MapPin className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', title: 'Visit Us', lines: ['45 Galle Road', 'Colombo 03, Sri Lanka'] },
              { icon: <Clock className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50', title: 'Support Hours', lines: ['Mon–Fri: 8am – 6pm', 'Sat: 9am – 1pm'] },
            ].map((c, i) => (
              <div key={i} className="contact-card glass-panel p-5 flex gap-4">
                <div className={`p-3 rounded-xl ${c.bg} flex-shrink-0 h-fit`}>{c.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">{c.title}</h4>
                  {c.lines.map((l, j) => <p key={j} className="text-sm text-slate-500">{l}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 glass-panel p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send a Message</h2>
            <form className="contact-form space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="input-label">Your Name</label>
                  <input className="input-field" placeholder="Kamal Perera" required
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input type="email" className="input-field" placeholder="you@example.com" required
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="input-label">Subject</label>
                <select className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required>
                  <option value="">Select a topic...</option>
                  <option>Booking Inquiry</option>
                  <option>Payment Issue</option>
                  <option>Maintenance Request</option>
                  <option>Account Help</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="input-label">Message</label>
                <textarea className="input-field" rows={6} placeholder="Tell us how we can help..."
                  value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Send className="w-5 h-5" />}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
