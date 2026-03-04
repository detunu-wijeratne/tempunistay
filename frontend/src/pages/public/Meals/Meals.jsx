import './Meals.css';
import { useState, useEffect } from 'react';
import Navbar from 'components/shared/Navbar/Navbar';
import Footer from 'components/shared/Footer/Footer';
import { mealAPI } from 'services/api';
import { useAuth } from 'context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Utensils, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  breakfast: 'bg-yellow-100 text-yellow-700',
  lunch:     'bg-green-100 text-green-700',
  dinner:    'bg-indigo-100 text-indigo-700',
  snack:     'bg-orange-100 text-orange-700',
};

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
];

export default function Meals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('all');
  const [cart, setCart]             = useState([]);
  const [showCart, setShowCart]     = useState(false);
  const [ordering, setOrdering]     = useState(false);
  const [ordered, setOrdered]       = useState(false);

  useEffect(() => {
    mealAPI.getPlans()
      .then(r => setPlans(r.data.data || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(plans.map(p => p.category).filter(Boolean))];

  const filtered = plans.filter(p => {
    if (category !== 'all' && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const addToCart = (plan) => {
    setCart(prev => {
      const ex = prev.find(c => c.plan._id === plan._id);
      if (ex) return prev.map(c => c.plan._id === plan._id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { plan, qty: 1 }];
    });
    toast.success(`${plan.name} added to cart`);
  };

  const changeQty = (planId, delta) => {
    setCart(prev => prev.map(c => c.plan._id === planId ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.plan.price * c.qty, 0);

  const placeOrder = async () => {
    if (!user) { toast.error('Please login to order'); navigate('/login'); return; }
    if (user.role !== 'student') { toast.error('Only students can order meals'); return; }
    setOrdering(true);
    try {
      // Group by provider — one order per provider
      const byProvider = {};
      cart.forEach(({ plan, qty }) => {
        const pid = plan.provider?._id || plan.provider;
        if (!byProvider[pid]) byProvider[pid] = { provider: pid, items: [], total: 0 };
        byProvider[pid].items.push({ mealItem: plan.name, quantity: qty, price: plan.price });
        byProvider[pid].total += plan.price * qty;
      });
      await Promise.all(
        Object.values(byProvider).map(({ provider, items, total }) =>
          mealAPI.createOrder({ provider, items, totalAmount: total })
        )
      );
      setCart([]);
      setShowCart(false);
      setOrdered(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="px-6 md:px-24 py-14 bg-white border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Meal Plans</h1>
            <p className="text-slate-500">Fresh, affordable meals from verified campus providers.</p>
          </div>
          <button onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 px-5 py-3 text-white font-bold rounded-xl shadow transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
            <ShoppingCart className="w-5 h-5" /> My Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-orange-600 text-xs font-extrabold rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Search meals..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition ${cat === category ? 'text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                style={cat === category ? { background: 'linear-gradient(135deg,#ea580c,#c2410c)' } : {}}>
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Order success */}
      {ordered && (
        <div className="mx-6 md:mx-24 mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">Order placed!</p>
            <p className="text-sm text-green-600">Track it in <a href="/student/meals" className="underline font-bold">My Meals</a>.</p>
          </div>
          <button onClick={() => setOrdered(false)} className="ml-auto text-green-400 hover:text-green-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Meal grid */}
      <section className="px-6 md:px-24 py-12">
        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading meals...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Utensils className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No meals available right now.</p>
            <p className="text-sm mt-1">The meal provider hasn't added items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((plan, idx) => {
              const cartItem = cart.find(c => c.plan._id === plan._id);
              return (
                <div key={plan._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition duration-300 flex flex-col group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={plan.image && plan.image.startsWith("data:") ? plan.image : (plan.image || FALLBACK_IMGS[idx % FALLBACK_IMGS.length])}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={plan.name} />
                    <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg ${CATEGORY_COLORS[plan.category] || 'bg-slate-100 text-slate-600'}`}>
                      {plan.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="font-bold text-slate-900 mb-1">{plan.name}</h4>
                    {plan.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{plan.description}</p>}
                    <p className="text-xs text-slate-400 mb-4">
                      by <span className="font-semibold text-slate-600">{plan.provider?.firstName} {plan.provider?.lastName}</span>
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-extrabold text-slate-900">LKR {plan.price?.toLocaleString()}</span>
                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQty(plan._id, -1)}
                            className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-extrabold w-5 text-center">{cartItem.qty}</span>
                          <button onClick={() => changeQty(plan._id, 1)}
                            className="w-8 h-8 rounded-lg text-white flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(plan)}
                          className="px-4 py-2 text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
                          style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Cart drawer */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowCart(false)} />
          <aside className="fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Your Cart</h2>
                <p className="text-xs text-slate-400">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Cart is empty</p>
                  <p className="text-sm mt-1">Add items from the menu</p>
                </div>
              ) : cart.map(({ plan, qty }) => (
                <div key={plan._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{plan.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{plan.category}</p>
                    <p className="text-sm font-bold text-orange-600 mt-1">LKR {(plan.price * qty).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => changeQty(plan._id, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-sm">{qty}</span>
                    <button onClick={() => changeQty(plan._id, 1)}
                      className="w-7 h-7 rounded-lg text-white flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-700">Total</span>
                  <span className="text-2xl font-extrabold text-slate-900">LKR {cartTotal.toLocaleString()}</span>
                </div>
                <button onClick={placeOrder} disabled={ordering}
                  className="w-full py-4 text-white font-bold rounded-xl shadow disabled:opacity-60 transition"
                  style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
                  {ordering ? 'Placing Order...' : !user ? 'Login to Order' : 'Place Order'}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      <Footer />
    </div>
  );
}
