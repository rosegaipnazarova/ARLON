'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import ProductCard from '../../components/ui/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', category: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter.type) params.set('type', filter.type);
        if (filter.category) params.set('category', filter.category);

        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter]);

  const filterButtons = [
    { key: 'type', val: '', label: 'All' },
    { key: 'type', val: 'original', label: '◆ Originals' },
    { key: 'type', val: 'echo', label: '◈ Echo' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] font-mono text-cyan/50 tracking-[0.4em] uppercase mb-3">
            ◈ Browse
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl tracking-wider">
            ALL DROPS
          </h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {filterButtons.map(({ key, val, label }) => (
            <button
              key={label}
              onClick={() => setFilter((f) => ({ ...f, [key]: val }))}
              className={`text-xs font-mono tracking-widest uppercase px-4 py-2 transition-all ${
                filter[key] === val
                  ? 'bg-cyan text-black font-bold'
                  : 'border border-white/10 text-white/40 hover:border-cyan/40 hover:text-cyan'
              }`}
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-white/20 font-mono tracking-widest">
            NO DROPS FOUND
          </div>
        )}
      </div>
    </div>
  );
}
