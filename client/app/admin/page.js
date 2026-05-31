'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

// import useAuthStore from '../../../store/authStore';
// import api from '../../../lib/api';

const STATUS_COLORS = {
  pending: '#666',
  confirmed: '#00F5FF',
  shipped: '#FFD700',
  delivered: '#22C55E',
};

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', type: 'original',
    category: '', totalQuantity: '', images: '', model3DUrl: '',
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }

    Promise.all([
      api.get(`/orders/user/${user._id}`), // admin sees all via their id
      api.get('/products?limit=50'),
    ]).then(([o, p]) => {
      setOrders(o.data.orders || []);
      setProducts(p.data.products || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? data.order : o));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateMsg('');
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        totalQuantity: parseInt(productForm.totalQuantity),
        images: productForm.images ? productForm.images.split(',').map((s) => s.trim()) : [],
      };
      await api.post('/products', payload);
      setCreateMsg('✓ Product created successfully');
      setProductForm({
        title: '', description: '', price: '', type: 'original',
        category: '', totalQuantity: '', images: '', model3DUrl: '',
      });
    } catch (err) {
      setCreateMsg(`✕ ${err.response?.data?.message || 'Failed to create product'}`);
    } finally {
      setCreating(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  const tabs = [
    { key: 'orders', label: `Orders (${orders.length})` },
    { key: 'products', label: `Products (${products.length})` },
    { key: 'create', label: '+ New Product' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[10px] font-mono text-cyan/50 tracking-[0.4em] uppercase mb-2">
              ◈ Control Panel
            </p>
            <h1 className="font-display font-bold text-4xl tracking-wider">ADMIN</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-white/30 tracking-widest">Logged in as</p>
            <p className="font-display font-semibold text-cyan">{user.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-white/5 mb-8">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-all ${
                tab === key ? 'border-cyan text-cyan' : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-cyan/30 tracking-widest animate-pulse">LOADING...</div>
        ) : (
          <>
            {/* ORDERS TAB */}
            {tab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-20 text-white/20 font-mono tracking-widest text-sm">NO ORDERS</div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="glass-card p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-mono text-white/30 tracking-widest">
                            #{order._id.slice(-10).toUpperCase()}
                          </p>
                          <p className="font-display font-semibold mt-1">
                            {order.products?.length} item{order.products?.length !== 1 ? 's' : ''}
                            &nbsp;— ${order.totalPrice.toFixed(2)}
                          </p>
                          <p className="text-xs font-mono text-white/30 mt-0.5">{order.address}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Status badge */}
                          <span
                            className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 border"
                            style={{
                              color: STATUS_COLORS[order.status],
                              borderColor: STATUS_COLORS[order.status] + '40',
                            }}
                          >
                            {order.status}
                          </span>

                          {/* Status updater */}
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="bg-surface-2 border border-white/10 text-white text-xs font-mono px-3 py-1.5 outline-none focus:border-cyan transition-colors"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* PRODUCTS TAB */}
            {tab === 'products' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-left text-[10px] text-white/30 tracking-widest uppercase border-b border-white/5">
                      <th className="pb-3 pr-4">Title</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Price</th>
                      <th className="pb-3 pr-4">Stock</th>
                      <th className="pb-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 pr-4 font-display font-semibold">{p.title}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-[10px] tracking-widest ${p.type === 'original' ? 'text-gold' : 'text-cyan'}`}>
                            {p.type === 'original' ? '◆ ORIGINAL' : '◈ ECHO'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gold">${p.price.toFixed(2)}</td>
                        <td className="py-3 pr-4">
                          <span className={p.remainingQuantity === 0 ? 'text-red-400' : 'text-white/60'}>
                            {p.remainingQuantity}/{p.totalQuantity}
                          </span>
                        </td>
                        <td className="py-3 text-white/40">{p.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CREATE PRODUCT TAB */}
            {tab === 'create' && (
              <div className="max-w-2xl">
                <div className="glass-card p-8 relative">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan" />

                  <h2 className="font-display font-bold text-2xl tracking-wider mb-6">NEW PRODUCT</h2>

                  {createMsg && (
                    <div className={`text-xs font-mono border px-4 py-3 mb-5 tracking-wider ${
                      createMsg.startsWith('✓')
                        ? 'text-green-400 border-green-400/20 bg-green-400/5'
                        : 'text-red-400 border-red-400/20 bg-red-400/5'
                    }`}>
                      {createMsg}
                    </div>
                  )}

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    {/* Title */}
                    {[
                      { key: 'title', label: 'Title', type: 'text', placeholder: 'Product name' },
                      { key: 'category', label: 'Category', type: 'text', placeholder: 'Art, Apparel, Music…' },
                      { key: 'price', label: 'Price (USD)', type: 'number', placeholder: '99.00' },
                      { key: 'totalQuantity', label: 'Total Quantity', type: 'number', placeholder: '50' },
                      { key: 'images', label: 'Image URLs (comma-separated)', type: 'text', placeholder: 'https://…, https://…' },
                      { key: 'model3DUrl', label: '3D Model URL (.glb)', type: 'text', placeholder: 'https://…/model.glb (optional)' },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                          {label}
                        </label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={productForm[key]}
                          onChange={(e) => setProductForm((f) => ({ ...f, [key]: e.target.value }))}
                          required={!['model3DUrl', 'images'].includes(key)}
                          className="w-full bg-surface-2 border border-white/10 focus:border-cyan text-white px-4 py-2.5 text-sm font-mono outline-none transition-colors placeholder-white/20"
                        />
                      </div>
                    ))}

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                        required
                        rows={3}
                        placeholder="Product description…"
                        className="w-full bg-surface-2 border border-white/10 focus:border-cyan text-white px-4 py-2.5 text-sm font-mono outline-none transition-colors placeholder-white/20 resize-none"
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Type</label>
                      <div className="flex gap-3">
                        {['original', 'echo'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setProductForm((f) => ({ ...f, type: t }))}
                            className={`flex-1 py-2 text-xs font-mono tracking-widest uppercase transition-all ${
                              productForm.type === t
                                ? t === 'original'
                                  ? 'bg-gold/20 border border-gold text-gold'
                                  : 'bg-cyan/20 border border-cyan text-cyan'
                                : 'border border-white/10 text-white/30'
                            }`}
                          >
                            {t === 'original' ? '◆ Original' : '◈ Echo'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={creating}
                      className="btn-cyber w-full py-3.5 text-sm disabled:opacity-40"
                    >
                      {creating ? 'CREATING...' : 'CREATE PRODUCT →'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
