'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ address: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) { router.push('/auth/login'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/orders', {
        products: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        address: form.address,
        phone: form.phone,
      });
      clearCart();
      router.push('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 px-6">
        <p className="text-6xl opacity-10 font-display">◈</p>
        <h1 className="font-display font-bold text-3xl tracking-wider text-white/40">CART IS EMPTY</h1>
        <Link href="/products" className="btn-cyber text-sm px-8 py-3">Browse Drops</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display font-bold text-4xl tracking-wider mb-10">YOUR CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Items */}
          <div className="lg:col-span-3 space-y-3">
            {items.map(({ product: p, quantity }) => (
              <div key={p._id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-surface-2 overflow-hidden flex-shrink-0">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-display text-xs">
                      ARLON
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold truncate">{p.title}</p>
                  <p className="text-xs font-mono text-white/30">${p.price.toFixed(2)} each</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-white/10">
                  <button
                    onClick={() => quantity > 1 ? updateQuantity(p._id, quantity - 1) : removeItem(p._id)}
                    className="w-8 h-8 text-white/40 hover:text-cyan transition-colors font-mono"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-sm">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(p._id, Math.min(p.remainingQuantity, quantity + 1))}
                    className="w-8 h-8 text-white/40 hover:text-cyan transition-colors font-mono"
                  >
                    +
                  </button>
                </div>

                <span className="font-display font-bold text-glow-gold w-20 text-right">
                  ${(p.price * quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeItem(p._id)}
                  className="text-white/20 hover:text-red-400 transition-colors ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 space-y-5 sticky top-24">
              <h2 className="font-display font-semibold tracking-wider text-lg">ORDER SUMMARY</h2>

              <div className="space-y-2 border-b border-white/5 pb-4">
                {items.map(({ product: p, quantity }) => (
                  <div key={p._id} className="flex justify-between text-sm">
                    <span className="text-white/50 truncate max-w-[150px] font-display">{p.title}</span>
                    <span className="font-mono text-white/60">${(p.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-display font-semibold tracking-wider">TOTAL</span>
                <span className="font-display font-bold text-2xl text-glow-gold">${total.toFixed(2)}</span>
              </div>

              {error && (
                <p className="text-xs font-mono text-red-400 border border-red-400/20 px-3 py-2">{error}</p>
              )}

              <form onSubmit={handleCheckout} className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-white/30 tracking-widest uppercase block mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    required
                    rows={2}
                    placeholder="Street, City, Country"
                    className="w-full bg-surface-2 border border-white/10 focus:border-cyan text-white px-3 py-2 text-sm font-mono outline-none transition-colors placeholder-white/20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/30 tracking-widest uppercase block mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                    placeholder="+1 234 567 890"
                    className="w-full bg-surface-2 border border-white/10 focus:border-cyan text-white px-3 py-2 text-sm font-mono outline-none transition-colors placeholder-white/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cyber w-full py-3.5 text-sm disabled:opacity-40"
                >
                  {loading ? 'PLACING ORDER...' : user ? 'PLACE ORDER →' : 'LOGIN TO ORDER →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
