import './DashboardLayout.css';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Home, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import toast from 'react-hot-toast';
import uniStayLogo from 'assets/logo.png';

export default function DashboardLayout({ children, navItems, accentColor = 'blue', logo }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const colorMap = {
    blue:   { active: 'bg-blue-600',   hover: 'hover:bg-slate-100 hover:text-blue-600',   dot: 'bg-blue-600' },
    indigo: { active: 'bg-indigo-600', hover: 'hover:bg-indigo-50 hover:text-indigo-600', dot: 'bg-indigo-600' },
    orange: { active: 'bg-orange-600', hover: 'hover:bg-orange-50 hover:text-orange-600', dot: 'bg-orange-600' },
    teal:   { active: 'bg-teal-700',   hover: 'hover:bg-teal-50 hover:text-teal-700',     dot: 'bg-teal-700' },
  };
  const colors = colorMap[accentColor] || colorMap.blue;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handle = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const homeRoute = {
    student:       '/student/dashboard',
    landlord:      '/landlord/dashboard',
    meal_provider: '/meal/dashboard',
    facility:      '/facility/dashboard',
  }[user?.role] || '/';

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#f1f5f9' }}>
      <div className="fixed inset-0 -z-10" style={{
        background: 'linear-gradient(135deg, rgba(219,234,254,0.6) 0%, rgba(241,245,249,0.4) 100%)',
      }} />

      {/* Sidebar */}
      <aside className="w-64 h-full flex flex-col sidebar-panel z-50 hidden lg:flex flex-shrink-0">
        {/* Logo */}
        <div className="h-20 flex items-center px-4 border-b border-slate-100">
          <Link to="/">
            <img src={uniStayLogo} alt="UniStay" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to || pathname.startsWith(to + '/');
            return (
              <Link key={to} to={to}
                className={`sidebar-link ${isActive ? `${colors.active} text-white` : `text-slate-500 ${colors.hover}`}`}
                style={isActive ? { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } : {}}>
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* User card in sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-3">
            <div className={`w-9 h-9 rounded-full ${colors.active} flex items-center justify-center text-white font-bold text-sm`}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-semibold text-sm transition">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur border-b border-slate-100 flex-shrink-0">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Welcome back, {user?.firstName} 👋</h1>
            <p className="text-xs text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
              <Bell className="w-5 h-5" />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${colors.dot}`} />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(prev => !prev)}
                className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition`}>
                <div className={`w-8 h-8 rounded-full ${colors.active} flex items-center justify-center text-white font-bold text-sm`}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.active} text-white capitalize`}>
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Menu items */}
                  <Link to="/" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                    <Home className="w-4 h-4 text-slate-400" />
                    Go to Home
                  </Link>

                  <Link to={`/${user?.role === 'meal_provider' ? 'meal' : user?.role === 'facility' ? 'facility' : user?.role}/settings`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </Link>

                  <div className="border-t border-slate-100 mt-1" />

                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
