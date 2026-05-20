'use client';
import Link from 'next/link';
import Image from 'next/image';
import useCartStore from '../../store/cartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const scarcityPct = Math.round((product.remainingQuantity / product.totalQuantity) * 100);
  const isOriginal = product.type === 'original';
  const isSoldOut = product.remainingQuantity === 0;

  const scarcityColor =
    scarcityPct <= 10 ? '#FF4444' : scarcityPct <= 30 ? '#FFD700' : '#00F5FF';

  return (
    <article className="group relative glass-card overflow-hidden transition-all duration-300 hover:border-cyan/30 hover:shadow-[0_0_30px_#00F5FF15]">
      {/* Type badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`badge-pill text-[10px] ${
            isOriginal
              ? 'bg-gold/20 text-gold border border-gold/40'
              : 'bg-cyan/10 text-cyan border border-cyan/30'
          }`}
        >
          {isOriginal ? '◆ ORIGINAL' : '◈ ECHO'}
        </span>
      </div>

      {/* Image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative h-52 bg-surface-2 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl text-white/10 font-display tracking-widest">ARLON</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent opacity-60" />
          <div className="absolute inset-0 bg-cyan/0 group-hover:bg-cyan/5 transition-colors duration-300" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Artist */}
        {product.artistId && (
          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
            {product.artistId.name}
          </p>
        )}

        <Link href={`/products/${product._id}`}>
          <h3 className="font-display font-semibold text-lg tracking-wide group-hover:text-cyan transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Scarcity (only for originals) */}
        {isOriginal && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span style={{ color: scarcityColor }}>
                {isSoldOut ? 'SOLD OUT' : `${product.remainingQuantity} LEFT`}
              </span>
              <span className="text-white/30">{product.totalQuantity} TOTAL</span>
            </div>
            <div className="scarcity-bar">
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${scarcityPct}%`, background: scarcityColor }}
              />
            </div>
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-display font-bold text-xl text-glow-gold">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={isSoldOut}
            className={`text-[10px] font-mono tracking-widest uppercase px-4 py-2 transition-all ${
              isSoldOut
                ? 'text-white/20 border border-white/10 cursor-not-allowed'
                : 'btn-outline-cyber'
            }`}
          >
            {isSoldOut ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
