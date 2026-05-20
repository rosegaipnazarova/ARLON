'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-card border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold tracking-[0.3em] text-glow-cyan">
            ARLON
          </span>
          <span className="hidden sm:block text-[10px] font-mono text-white/30 tracking-widest border border-white/10 px-2 py-0.5">
            v2.0
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/products', label: 'Drops' },
            { href: '/artists', label: 'Artists' },
            { href: '/feed', label: 'Feed' },
            { href: '/verify', label: 'Verify' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-display font-semibold tracking-widest uppercase text-white/60 hover:text-cyan transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/cart" className="relative text-white/60 hover:text-cyan transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan text-black text-[10px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-none border border-cyan/40 group-hover:border-cyan overflow-hidden transition-colors"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-2 flex items-center justify-center text-cyan font-mono text-xs">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-mono text-white/70 group-hover:text-cyan transition-colors">
                  {user.username}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-xs font-mono text-white/30 hover:text-red-400 transition-colors tracking-widest uppercase"
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="btn-outline-cyber text-xs px-4 py-2">
                Login
              </Link>
              <Link href="/auth/register" className="btn-cyber text-xs px-4 py-2">
                Join
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/60 hover:text-cyan"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-card border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {[
            { href: '/products', label: 'Drops' },
            { href: '/artists', label: 'Artists' },
            { href: '/feed', label: 'Feed' },
            { href: '/verify', label: 'Verify' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-display font-semibold tracking-widest uppercase text-white/60 hover:text-cyan"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
