import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import toast from 'react-hot-toast';
import logo from 'assets/logo.png';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/meals', label: 'Meals' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashMap = {
    student: '/student/dashboard',
    landlord: '/landlord/dashboard',
    meal_provider: '/meal/dashboard',
    facility: '/facility/dashboard',
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-24 py-5 bg-white sticky top-0 z-50 border-b border-slate-100">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="UniStay" className="h-12 w-auto object-contain" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-10 font-semibold text-slate-500 text-[15px]">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`hover:text-blue-600 transition-colors ${pathname === to ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex gap-4 items-center">
        {user ? (
          <>
            <Link
              to={dashMap[user.role] || '/'}
              className="px-6 py-2 font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 btn-primary text-white rounded-lg font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-6 py-2 font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition">
              Login
            </Link>
            <Link to="/register" className="px-8 py-2 btn-primary text-white rounded-lg font-bold">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg z-50 md:hidden">
          <div className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="font-semibold text-slate-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to={dashMap[user.role] || '/'} className="font-bold text-blue-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-left font-bold text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-bold text-slate-700" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="font-bold text-blue-600" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
