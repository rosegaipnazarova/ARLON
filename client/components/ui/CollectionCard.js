'use client';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

/**
 * CollectionCard — displays an owned product with its certificate details.
 * Shown in the profile collection grid.
 */
export default function CollectionCard({ item }) {
  const [showCert, setShowCert] = useState(false);
  const product = item.productId;
  const cert = item.certificateId;

  if (!product) return null;

  return (
    <div className="glass-card overflow-hidden group relative">
      {/* Certified ribbon */}
      {cert && (
        <div className="absolute top-0 right-0 z-10">
          <div
            className="text-[9px] font-mono font-bold tracking-widest bg-gold text-black px-2 py-0.5"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 6px 100%)' }}
          >
            CERTIFIED
          </div>
        </div>
      )}

      {/* Product image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative h-44 bg-surface-2 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 font-display tracking-widest text-2xl">
              ARLON
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-display font-semibold tracking-wide truncate group-hover:text-cyan transition-colors">
              {product.title}
            </h3>
          </Link>
          <p className="text-[10px] font-mono text-white/30 tracking-widest mt-0.5">
            {product.type === 'original' ? '◆ ORIGINAL' : '◈ ECHO'} · ${product.price?.toFixed(2)}
          </p>
        </div>

        {/* Certificate toggle */}
        {cert && (
          <>
            <button
              onClick={() => setShowCert(!showCert)}
              className="w-full text-[10px] font-mono tracking-widest uppercase py-1.5 border border-gold/30 text-gold/70 hover:border-gold hover:text-gold transition-colors"
              style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
            >
              {showCert ? '↑ Hide Certificate' : '◆ View Certificate'}
            </button>

            {showCert && (
              <div className="bg-surface-1 border border-gold/20 p-4 space-y-3 animate-fade-in">
                {/* QR code */}
                <div className="flex justify-center">
                  <div className="p-2 bg-white">
                    <QRCodeSVG
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?serial=${cert.serialNumber}`}
                      size={96}
                      level="H"
                    />
                  </div>
                </div>

                {/* Serial */}
                <div>
                  <p className="text-[9px] font-mono text-white/20 tracking-widest mb-1">
                    SERIAL NUMBER
                  </p>
                  <p className="text-[10px] font-mono text-gold/80 break-all tracking-wider leading-relaxed">
                    {cert.serialNumber}
                  </p>
                </div>

                <Link
                  href={`/verify?serial=${cert.serialNumber}`}
                  className="block text-center text-[9px] font-mono tracking-widest text-cyan/60 hover:text-cyan transition-colors uppercase"
                >
                  → Verify on ARLON
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
