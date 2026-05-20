import Link from 'next/link';
import api from '../lib/api';
import ProductCard from '../components/ui/ProductCard';
import CountdownTimer from '../components/ui/CountdownTimer';

async function getProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?limit=6&sort=-createdAt`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const featuredDropDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2); // 2 days from now

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #00F5FF 0%, transparent 70%)' }} />
        </div>

        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-12 bg-cyan/50" />
            <span className="text-[11px] font-mono text-cyan tracking-[0.4em] uppercase">
              Digital Culture Platform
            </span>
            <span className="h-px w-12 bg-cyan/50" />
          </div>

          {/* Main heading */}
          <h1 className="font-display font-bold leading-none mb-6 animate-slide-up">
            <span
              className="block text-7xl md:text-9xl text-glow-cyan"
              style={{ animationDelay: '0ms' }}
            >
              ARLON
            </span>
            <span
              className="block text-2xl md:text-3xl font-light tracking-[0.5em] text-white/40 mt-4"
              style={{ animationDelay: '200ms' }}
            >
              COLLECT THE UNCOLLECTABLE
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-white/50 font-display text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: '400ms' }}>
            Limited edition drops. Verified originals. Digital certificates of authenticity.
            Own what matters.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-in"
            style={{ animationDelay: '600ms' }}>
            <Link href="/products" className="btn-cyber text-sm px-8 py-3">
              Explore Drops
            </Link>
            <Link href="/auth/register" className="btn-outline-cyber text-sm px-8 py-3">
              Join the Collective
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex items-center justify-center gap-12 flex-wrap animate-fade-in"
            style={{ animationDelay: '800ms' }}>
            {[
              { label: 'Artists', value: '120+' },
              { label: 'Originals Dropped', value: '3.4K' },
              { label: 'Collectors', value: '18K+' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-display font-bold text-glow-cyan">{value}</p>
                <p className="text-xs font-mono text-white/30 tracking-widest uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[9px] font-mono text-white/20 tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-cyan/40 to-transparent" />
        </div>
      </section>

      {/* NEXT DROP COUNTDOWN */}
      <section className="py-20 px-6 border-y border-white/5 bg-surface-1">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-mono text-gold/60 tracking-[0.4em] uppercase mb-4">
            ◆ Next Limited Drop
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-8 tracking-wider">
            GENESIS COLLECTION II
          </h2>
          <CountdownTimer targetDate={featuredDropDate} />
          <p className="text-white/40 font-display mt-6 text-sm">
            Only 50 originals. Each with a signed certificate.
          </p>
        </div>
      </section>

      {/* TRENDING DROPS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-mono text-cyan/50 tracking-[0.4em] uppercase mb-2">
                ◈ Trending Now
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-wider">
                LATEST DROPS
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-mono text-white/30 hover:text-cyan tracking-widest uppercase transition-colors"
            >
              View All →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/20 font-mono text-sm tracking-widest">
              No drops yet. Be the first.
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-surface-1 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-mono text-cyan/50 tracking-[0.4em] uppercase mb-2">
              ✦ The System
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-wider">
              HOW ARLON WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: '◆',
                title: 'Limited Drops',
                desc: 'Artists release original works in limited quantities. Once sold — gone forever.',
              },
              {
                step: '02',
                icon: '◈',
                title: 'Verified Ownership',
                desc: 'Each original comes with a unique QR-backed certificate proving authenticity.',
              },
              {
                step: '03',
                icon: '✦',
                title: 'Build Your Collection',
                desc: 'Grow your digital shelf, earn loyalty points, and unlock exclusive collector badges.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="glass-card p-6 space-y-3 group hover:border-cyan/20 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-display font-bold text-white/5 group-hover:text-white/10 transition-colors">
                    {step}
                  </span>
                  <span className="text-2xl text-glow-cyan">{icon}</span>
                </div>
                <h3 className="font-display font-semibold text-xl tracking-wide">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed font-display">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold tracking-[0.3em] text-glow-cyan">ARLON</span>
          <p className="text-xs font-mono text-white/20 tracking-widest">
            © 2024 ARLON. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Terms', 'Privacy', 'Contact'].map((l) => (
              <span key={l} className="text-xs font-mono text-white/20 hover:text-white/50 cursor-pointer transition-colors tracking-widest uppercase">
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
