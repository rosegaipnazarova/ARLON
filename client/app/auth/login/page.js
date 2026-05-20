'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) router.push('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 grid-bg">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display font-bold text-3xl tracking-[0.3em] text-glow-cyan block mb-2">
            ARLON
          </Link>
          <p className="text-xs font-mono text-white/30 tracking-widest">AUTHENTICATE TO CONTINUE</p>
        </div>

        {/* Form card */}
        <div className="glass-card p-8 space-y-6 relative">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan" />

          <h1 className="font-display font-bold text-2xl tracking-wider">LOGIN</h1>

          {error && (
            <div className="text-xs font-mono text-red-400 border border-red-400/20 bg-red-400/5 px-4 py-3 tracking-wider">
              ✕ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@domain.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required
                  className="w-full bg-surface-2 border border-white/10 focus:border-cyan text-white px-4 py-3 text-sm font-mono outline-none transition-colors placeholder-white/20"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-cyber w-full py-3.5 text-sm mt-2 disabled:opacity-50"
            >
              {isLoading ? 'AUTHENTICATING...' : 'LOGIN →'}
            </button>
          </form>

          <p className="text-center text-xs font-mono text-white/30">
            No account?{' '}
            <Link href="/auth/register" className="text-cyan hover:underline">
              Join the collective
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
