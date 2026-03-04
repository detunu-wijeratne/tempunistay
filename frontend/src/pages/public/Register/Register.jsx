import './Register.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, Star } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import { authAPI } from 'services/api';
import toast from 'react-hot-toast';
import logo from 'assets/logo-clean.png';

const roles = ['student', 'landlord', 'meal_provider', 'facility'];
const roleLabels = { student: 'Student', landlord: 'Landlord', meal_provider: 'Meal Provider', facility: 'Facility' };

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const dashMap = { student: '/student/dashboard', landlord: '/landlord/dashboard', meal_provider: '/meal/dashboard', facility: '/facility/dashboard' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.data, data.data.token);
      toast.success('Account created successfully!');
      navigate(dashMap[data.data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 relative min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: `linear-gradient(135deg, rgba(241,245,249,0.8) 0%, rgba(219,234,254,0.6) 100%), url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />

      <nav className="flex items-center justify-between px-6 md:px-24 py-5 sticky top-0 z-50">
        <Link to="/">
          <img src={logo} alt="UniStay" className="h-12 w-auto object-contain" />
        </Link>
        <div className="hidden md:flex gap-8 font-semibold text-blue-800 text-sm">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,1)', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)' }}>

          {/* Left */}
          <div className="w-full md:w-5/12 bg-blue-600 relative overflow-hidden hidden md:flex flex-col justify-between p-8 text-white">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000" className="w-full h-full object-cover opacity-100 mix-blend-overlay" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800/90 to-blue-600/40" />
            </div>
            <div className="relative z-10 font-bold text-lg opacity-80">UniStay</div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 leading-tight">Start your journey today.</h2>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">Create an account to browse verified listings, manage your meals, and connect with the student community.</p>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-xs font-medium italic">"UniStay made finding my apartment so easy. Highly recommend!"</p>
                <p className="text-xs font-bold mt-2">- Jessica, Boston Univ.</p>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 bg-white/50">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
              <p className="text-slate-500 text-sm mb-6">Join us to simplify your student living.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="input-label">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((r) => (
                      <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                        className={`py-2.5 rounded-lg border font-bold text-sm transition-all ${form.role === r ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                        {roleLabels[r]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['firstName', 'lastName'].map((field) => (
                    <div key={field}>
                      <label className="input-label">{field === 'firstName' ? 'First Name' : 'Last Name'}</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" className="input-icon" placeholder={field === 'firstName' ? 'John' : 'Doe'}
                          value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="input-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" className="input-icon" placeholder="student@university.edu"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>

                {['password', 'confirmPassword'].map((field) => (
                  <div key={field}>
                    <label className="input-label">{field === 'password' ? 'Password' : 'Confirm Password'}</label>
                    <div className="relative">
                      {field === 'password' ? <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /> : <CheckCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
                      <input type="password" className="input-icon" placeholder={field === 'password' ? 'Create password' : 'Confirm password'}
                        value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required />
                    </div>
                  </div>
                ))}

                <button type="submit" disabled={loading} className="w-full py-3.5 btn-primary text-white rounded-xl font-bold text-sm shadow-md mt-4 disabled:opacity-60">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="text-center mt-8 text-sm text-slate-500">
                Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}