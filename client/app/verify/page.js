'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '../../lib/api';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [serial, setSerial] = useState(searchParams.get('serial') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!serial.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const { data } = await api.post('/certificate/verify', { serialNumber: serial.trim().toUpperCase() });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const isValid = result?.status === 'VALID';

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 grid-bg">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-mono text-cyan/50 tracking-[0.4em] uppercase mb-3">
            ◈ Authentication
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl tracking-wider mb-4">
            VERIFY
          </h1>
          <p className="text-white/40 font-display text-sm leading-relaxed">
            Enter your certificate serial number to confirm authenticity.
          </p>
        </div>

        {/* Form */}
        <div className="glass-card p-8 relative">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan" />

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                Serial Number
              </label>
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                className="w-full bg-surface-2 border border-white/10 focus:border-cyan text-white px-4 py-3 font-mono text-sm outline-none transition-colors placeholder-white/15 tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !serial.trim()}
              className="btn-cyber w-full py-3.5 text-sm disabled:opacity-40"
            >
              {loading ? 'VERIFYING...' : 'AUTHENTICATE →'}
            </button>
          </form>

          {error && (
            <div className="mt-6 text-xs font-mono text-red-400 border border-red-400/20 bg-red-400/5 px-4 py-3 tracking-wider">
              ✕ {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 p-6 glass-card relative overflow-hidden ${
              isValid ? 'border-green-400/30' : 'border-red-400/30'
            }`}
          >
            {/* Status glow */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: isValid ? '#22C55E' : '#EF4444' }}
            />

            {/* Status badge */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-4xl ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                {isValid ? '✦' : '✕'}
              </span>
              <div>
                <p
                  className={`font-display font-bold text-2xl tracking-widest ${
                    isValid ? 'text-green-400' : 'text-red-400'
                  }`}
                  style={{
                    textShadow: isValid
                      ? '0 0 20px #22C55E88'
                      : '0 0 20px #EF444488',
                  }}
                >
                  {isValid ? 'AUTHENTIC' : 'NOT AUTHENTIC'}
                </p>
                <p className="text-xs font-mono text-white/30 tracking-widest">
                  {isValid ? 'Certificate verified in registry' : 'Serial not found in registry'}
                </p>
              </div>
            </div>

            {isValid && result.certificate && (
              <div className="space-y-3 border-t border-white/5 pt-5">
                {/* Product */}
                {result.certificate.product && (
                  <div className="flex items-center gap-3">
                    {result.certificate.product.images?.[0] && (
                      <div className="w-14 h-14 overflow-hidden flex-shrink-0 bg-surface-2">
                        <img
                          src={result.certificate.product.images[0]}
                          alt={result.certificate.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-display font-semibold">
                        {result.certificate.product.title}
                      </p>
                      <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-0.5">
                        ◆ ORIGINAL — VERIFIED
                      </p>
                    </div>
                  </div>
                )}

                {/* Meta rows */}
                {[
                  {
                    label: 'Serial Number',
                    value: result.certificate.serialNumber,
                    mono: true,
                  },
                  {
                    label: 'Registered Owner',
                    value: result.certificate.owner?.username || '—',
                  },
                  {
                    label: 'Issued On',
                    value: new Date(result.certificate.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase flex-shrink-0">
                      {label}
                    </span>
                    <span
                      className={`text-right text-white/80 ${
                        mono ? 'font-mono text-xs tracking-wider break-all' : 'font-display'
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info panel */}
        <div className="mt-8 p-5 border border-white/5 bg-surface-1 space-y-3">
          <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
            ◈ About Verification
          </p>
          <p className="text-sm text-white/40 font-display leading-relaxed">
            Each ARLON original ships with a unique certificate containing a serial number and
            QR code. Scan the QR or enter the serial here to confirm authenticity and see
            ownership history.
          </p>
          <p className="text-[10px] font-mono text-gold/30 tracking-widest">
            ◆ Verifying earns you +100 loyalty points
          </p>
        </div>
      </div>
    </div>
  );
}
