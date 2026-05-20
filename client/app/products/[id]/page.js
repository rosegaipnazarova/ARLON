'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '../../../lib/api';
import useCartStore from '../../../store/cartStore';
import Badge from '../../../components/ui/Badge';

const ModelViewer = dynamic(() => import('../../../components/3d/ModelViewer'), { ssr: false });

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="font-mono text-cyan/40 tracking-widest animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="font-mono text-white/20 tracking-widest">PRODUCT NOT FOUND</div>
      </div>
    );
  }

  const isOriginal = product.type === 'original';
  const isSoldOut = product.remainingQuantity === 0;
  const scarcityPct = Math.round((product.remainingQuantity / product.totalQuantity) * 100);
  const scarcityColor = scarcityPct <= 10 ? '#FF4444' : scarcityPct <= 30 ? '#FFD700' : '#00F5FF';

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: Media */}
          <div className="space-y-4">
            {/* 3D Viewer (if model exists) or Image gallery */}
            {product.model3DUrl ? (
              <ModelViewer modelUrl={product.model3DUrl} height={460} />
            ) : (
              <div className="relative h-[460px] bg-surface-1 border border-white/5 overflow-hidden">
                {product.images?.[activeImage] ? (
                  <img
                    src={product.images[activeImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 font-display text-5xl tracking-widest">
                    ARLON
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 border overflow-hidden transition-colors ${
                      activeImage === i ? 'border-cyan' : 'border-white/10'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="space-y-6">
            {/* Type + Artist */}
            <div className="flex items-center gap-3">
              <span className={`badge-pill text-[10px] ${
                isOriginal
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : 'bg-cyan/10 text-cyan border border-cyan/30'
              }`}>
                {isOriginal ? '◆ ORIGINAL' : '◈ ECHO'}
              </span>
              {product.artistId?.verified && <Badge name="Verified Collector" size="sm" />}
            </div>

            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl tracking-wide leading-tight">
                {product.title}
              </h1>
              {product.artistId && (
                <p className="text-white/40 font-mono text-sm mt-2 tracking-widest">
                  by {product.artistId.name}
                </p>
              )}
            </div>

            {/* Price */}
            <p className="font-display font-bold text-4xl text-glow-gold">
              ${product.price.toFixed(2)}
            </p>

            {/* Scarcity (originals only) */}
            {isOriginal && (
              <div className="space-y-2 p-4 border border-white/5 bg-surface-1">
                <div className="flex justify-between text-sm font-mono">
                  <span style={{ color: scarcityColor }}>
                    {isSoldOut ? '✕ SOLD OUT' : `${product.remainingQuantity} of ${product.totalQuantity} remaining`}
                  </span>
                  <span className="text-white/30">{scarcityPct}%</span>
                </div>
                <div className="scarcity-bar">
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${scarcityPct}%`, background: scarcityColor }}
                  />
                </div>
                {product.remainingQuantity <= 5 && !isSoldOut && (
                  <p className="text-[10px] font-mono text-red-400 tracking-widest animate-pulse">
                    ⚠ ALMOST GONE — {product.remainingQuantity} LEFT
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-white/60 font-display leading-relaxed">{product.description}</p>

            {/* Quantity selector + Add to Cart */}
            {!isSoldOut && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/30 tracking-widest">QTY</span>
                  <div className="flex items-center border border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 text-white/60 hover:text-cyan transition-colors font-mono text-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-mono text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.remainingQuantity, quantity + 1))}
                      className="w-10 h-10 text-white/60 hover:text-cyan transition-colors font-mono text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addItem(product, quantity)}
                  className="btn-cyber w-full py-4 text-sm text-center"
                >
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {isSoldOut && (
              <div className="text-center py-4 border border-red-500/20 text-red-400 font-mono tracking-widest text-sm">
                ✕ SOLD OUT
              </div>
            )}

            {/* Certificate note */}
            {isOriginal && (
              <div className="flex items-start gap-3 p-4 border border-gold/20 bg-gold/5">
                <span className="text-gold text-xl">◆</span>
                <div>
                  <p className="text-sm font-display font-semibold text-gold">
                    Includes Certificate of Authenticity
                  </p>
                  <p className="text-xs font-mono text-white/40 mt-1">
                    Each original comes with a unique serial number and QR verification code.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
