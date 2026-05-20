'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import Badge from '../../components/ui/Badge';
import CollectionCard from '../../components/ui/CollectionCard';

export default function ProfilePage() {
  const router = useRouter();
  const { user, fetchMe } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [collection, setCollection] = useState([]);
  const [activeTab, setActiveTab] = useState('collection');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    fetchMe();
    Promise.all([
      api.get(`/orders/user/${user._id}`),
      api.get('/users/collection'),
    ]).then(([ordersRes, collectionRes]) => {
      setOrders(ordersRes.data.orders || []);
      setCollection(collectionRes.data.collection || []);
    }).finally(() => setLoading(false));
  }, [user?._id]);

  if (!user) return null;

  const tabs = [
    { key: 'collection', label: 'Collection', count: collection.length },
    { key: 'orders', label: 'Orders', count: orders.length },
    { key: 'badges', label: 'Badges', count: user.badges?.length || 0 },
  ];

  const statusColors = {
    pending: '#666', confirmed: '#00F5FF', shipped: '#FFD700', delivered: '#22C55E',
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Profile Header */}
        <div className="glass-card p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00F5FF 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-surface-2 border-2 border-cyan/40 overflow-hidden flex-shrink-0"
                style={{ clipPath: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)' }}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-cyan">{user.username?.[0]?.toUpperCase()}</div>}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-surface rounded-full" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display font-bold text-3xl tracking-wider">{user.username}</h1>
                <span className="text-[10px] font-mono text-white/30 border border-white/10 px-2 py-1 tracking-widest uppercase">{user.role}</span>
              </div>
              {user.bio && <p className="text-white/50 mt-1 font-display">{user.bio}</p>}
              <p className="text-xs font-mono text-white/30 mt-1">{user.email}</p>
              {user.badges?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {user.badges.map((b) => <Badge key={b} name={b} size="sm" />)}
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-1">Loyalty Points</p>
              <p className="font-display font-bold text-4xl text-glow-gold">{user.loyaltyPoints || 0}</p>
              <p className="text-[10px] font-mono text-white/20 tracking-widest">pts</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 flex-wrap">
            <Link href="/verify" className="btn-outline-cyber text-[10px] px-4 py-2">◈ Verify Certificate</Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="btn-cyber text-[10px] px-4 py-2">⚙ Admin Panel</Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-white/5">
          {tabs.map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-all ${
                activeTab === key ? 'border-cyan text-cyan' : 'border-transparent text-white/30 hover:text-white/60'
              }`}>
              {label}
              {count > 0 && <span className="ml-2 text-[9px] bg-cyan/10 text-cyan px-1.5 py-0.5">{count}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card h-64 animate-pulse" />)}
          </div>
        ) : (
          <>
            {activeTab === 'collection' && (
              collection.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <p className="text-5xl opacity-10">◈</p>
                  <p className="font-mono text-white/20 tracking-widest text-sm">YOUR COLLECTION IS EMPTY</p>
                  <Link href="/products" className="btn-outline-cyber text-xs px-6 py-2 inline-block mt-4">Explore Drops</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {collection.map((item, i) => <CollectionCard key={i} item={item} />)}
                </div>
              )
            )}

            {activeTab === 'orders' && (
              orders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-mono text-white/20 tracking-widest text-sm">NO ORDERS YET</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[10px] font-mono text-white/30 tracking-widest">ORDER #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[10px] font-mono text-white/20">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 border"
                            style={{ color: statusColors[order.status], borderColor: statusColors[order.status] + '40' }}>
                            {order.status}
                          </span>
                          <span className="font-display font-bold text-lg text-glow-gold">${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {order.products.map((item, i) => (
                          <div key={i} className="flex-shrink-0 flex items-center gap-2">
                            {item.productId?.images?.[0] && (
                              <div className="w-10 h-10 bg-surface-2 overflow-hidden">
                                <img src={item.productId.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="font-display text-xs truncate max-w-[120px]">{item.productId?.title || 'Product'}</p>
                              <p className="text-[10px] font-mono text-white/30">×{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'badges' && (
              <div className="space-y-8">
                {user.badges?.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-mono text-white/20 tracking-widest text-sm">NO BADGES EARNED YET</p>
                    <p className="text-xs font-mono text-white/10 mt-2 tracking-widest">Buy, verify, and follow to earn badges</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {user.badges.map((badge) => (
                      <div key={badge} className="glass-card p-6 flex items-center gap-4">
                        <span className="text-3xl text-glow-gold">★</span>
                        <Badge name={badge} size="lg" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold tracking-wider mb-4 text-white/60 text-sm uppercase">How to Earn</h3>
                  <div className="space-y-3">
                    {[['Share a product', '+10 pts'], ['Purchase an item', '+50 pts'], ['Verify a certificate', '+100 pts']].map(([action, pts]) => (
                      <div key={action} className="flex items-center justify-between">
                        <span className="font-display text-sm text-white/50">{action}</span>
                        <span className="font-mono font-bold text-sm text-glow-gold">{pts}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5 space-y-2 text-xs font-display text-white/40">
                    <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase mb-2">Badge Conditions</p>
                    <p>◆ <span className="text-cyan">Collector</span> — Own 1+ item</p>
                    <p>◈ <span className="text-gold">Art Ambassador</span> — Follow 3+ artists</p>
                    <p>✦ <span className="text-purple-400">Verified Collector</span> — Verify a certificate</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
