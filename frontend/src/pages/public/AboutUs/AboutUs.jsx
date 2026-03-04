import './AboutUs.css';
import Navbar from 'components/shared/Navbar/Navbar';
import Footer from 'components/shared/Footer/Footer';

export function AboutUs() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <section className="px-6 md:px-24 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">About UniStay</h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            UniStay was founded with one mission: to make student living simple, safe, and stress-free. We connect students with verified landlords, meal providers, and facility workers — all in one seamless platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { stat: '10,000+', label: 'Happy Students' },
            { stat: '500+', label: 'Verified Properties' },
            { stat: '50+', label: 'Cities Covered' },
          ].map(({ stat, label }) => (
            <div key={label} className="glass-panel p-8 text-center">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">{stat}</div>
              <div className="text-slate-600 font-semibold">{label}</div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export function ContactUs() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <section className="px-6 md:px-24 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 text-center">Contact Us</h1>
          <p className="text-slate-500 text-center mb-12">Have a question? We'd love to hear from you.</p>
          <div className="glass-panel p-8">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="input-label">First Name</label><input type="text" className="input-field" placeholder="John" /></div>
                <div><label className="input-label">Last Name</label><input type="text" className="input-field" placeholder="Doe" /></div>
              </div>
              <div><label className="input-label">Email</label><input type="email" className="input-field" placeholder="you@example.com" /></div>
              <div><label className="input-label">Subject</label><input type="text" className="input-field" placeholder="How can we help?" /></div>
              <div><label className="input-label">Message</label><textarea className="input-field h-32 resize-none" placeholder="Your message..." /></div>
              <button className="w-full py-3.5 btn-primary text-white rounded-xl font-bold">Send Message</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AboutUs;
