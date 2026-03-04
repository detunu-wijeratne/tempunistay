import './Footer.css';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#e9eff6] px-6 md:px-24 py-16 border-t border-slate-200">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <Home className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">UniStay</span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            The premier platform for university student living and property management.
          </p>
        </div>

        <div>
          <h6 className="font-bold text-slate-900 mb-4">Platform</h6>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link to="/properties" className="hover:text-blue-600">Properties</Link></li>
            <li><Link to="/meals" className="hover:text-blue-600">Meals</Link></li>
            <li><Link to="/services" className="hover:text-blue-600">Services</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-bold text-slate-900 mb-4">Company</h6>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-bold text-slate-900 mb-4">Legal</h6>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="cursor-pointer hover:text-blue-600">Privacy Policy</li>
            <li className="cursor-pointer hover:text-blue-600">Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-slate-300/50 text-slate-400 text-sm">
        © 2025 UniStay. All rights reserved.
      </div>
    </footer>
  );
}
