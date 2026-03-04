import './Login.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { authAPI } from 'services/api';
import toast from 'react-hot-toast';
import logo from 'assets/logo-clean.png';

const DEMO_CREDS = {
  student:       { email: 'student@demo.com',  password: 'demo1234' },
  landlord:      { email: 'landlord@demo.com', password: 'demo1234' },
  meal_provider: { email: 'meal@demo.com',     password: 'demo1234' },
  facility:      { email: 'facility@demo.com', password: 'demo1234' },
};

const dashMap = {
  student:       '/student/dashboard',
  landlord:      '/landlord/dashboard',
  meal_provider: '/meal/dashboard',
  facility:      '/facility/dashboard',
};

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.data, data.data.token);
      toast.success(`Welcome back, ${data.data.firstName}!`);
      navigate(dashMap[data.data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setDemoLoading(role);
    try {
      const { data } = await authAPI.login(DEMO_CREDS[role]);
      login(data.data, data.data.token);
      toast.success(`Logged in as ${data.data.firstName} (${role.replace('_', ' ')})`);
      navigate(dashMap[role]);
    } catch (err) {
      toast.error('Demo login failed. Make sure the backend is running and seeded (npm run seed).');
    } finally {
      setDemoLoading('');
    }
  };

  return (
    <div className="bg-slate-100 relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: `linear-gradient(135deg, rgba(241,245,249,0.85) 0%, rgba(219,234,254,0.65) 100%), url('https://images.unsplash.com/photo-1695204905741-9d099a5989ce')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />

      {/* Nav — logo image replaces the icon+text, everything else unchanged */}
      <nav className="flex items-center justify-between px-6 md:px-24 py-5 sticky top-0 z-50">
        <Link to="/">
          <img src={logo} alt="UniStay" className="h-12 w-auto object-contain" />
        </Link>
        <div className="hidden md:flex gap-8 font-semibold text-blue-800 text-sm">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact Support</Link>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col md:flex-row" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)' }}>

          {/* Left branding */}
          <div className="w-full md:w-5/12 bg-blue-600 relative overflow-hidden hidden md:flex flex-col justify-between p-8 text-white">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000" className="w-full h-full object-cover opacity-40 mix-blend-overlay" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-700/90 to-blue-600/40" />
            </div>
            <div className="relative z-10 font-bold text-lg tracking-wide opacity-80">UniStay</div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 leading-tight">Welcome to your new home.</h2>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">Join thousands of students who have found their perfect accommodation.</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <img key={i} className="w-8 h-8 rounded-full border-2 border-blue-600" src={`https://i.pravatar.cc/100?img=${i}`} alt="" />)}
                </div>
                <span className="text-xs font-bold text-white">10k+ Students</span>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 bg-white/50">
            <div className="max-w-sm mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome Back!</h2>
              <p className="text-slate-500 text-sm mb-8">Please enter your details to sign in.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="input-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" className="input-icon" placeholder="student@university.edu"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="input-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="password" className="input-icon" placeholder="••••••••"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 btn-primary text-white rounded-xl font-bold text-sm shadow-md disabled:opacity-60">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-xs font-bold text-slate-400 uppercase">Quick Access (Demo)</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: '🎓 Student',       role: 'student',       bg: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' },
                  { label: '🏠 Landlord',      role: 'landlord',      bg: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100' },
                  { label: '🍽️ Meal Provider', role: 'meal_provider', bg: 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100' },
                  { label: '🔧 Facility',      role: 'facility',      bg: 'bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100' },
                ].map(({ label, role, bg }) => (
                  <button key={role} onClick={() => handleQuickLogin(role)}
                    disabled={!!demoLoading}
                    className={`flex items-center justify-center py-2.5 rounded-xl text-xs font-bold border transition disabled:opacity-60 ${bg}`}>
                    {demoLoading === role ? 'Logging in...' : label}
                  </button>
                ))}
              </div>

              <p className="text-center text-[10px] text-slate-400 mb-4">
                Demo uses real DB. Run <code className="bg-slate-100 px-1 rounded">npm run seed</code> in backend first.
              </p>

              <div className="text-center text-sm text-slate-500">
                Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-slate-400 text-xs relative z-10">
        © 2025 UniStay. All rights reserved. <span className="mx-2">•</span> Privacy Policy <span className="mx-2">•</span> Terms
      </footer>
    </div>
  );
}