'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';
import useAuthStore from '../../../store/authStore';
import ProductCard from '../../../components/ui/ProductCard';
import FeedPost from '../../../components/ui/FeedPost';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('drops');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/artists/${id}`),
      api.get(`/products?limit=12`), // filter by artistId client-side (or extend the API)
    ]).then(([artistRes, productsRes]) => {
      const a = artistRes.data.artist;
      setArtist(a);
      // Check if current user follows this artist
      if (user) {
        setIsFollowing(a.followers?.includes(user._id) || false);
      }
      // Filter products by this artist
      const artistProducts = (productsRes.data.products || []).filter(
        (p) => p.artistId?._id === id || p.artistId === id
      );
      setProducts(artistProducts);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleFollow = async () => {
    if (!user) return;
    try {
      const { data } = await api.post(`/artists/follow/${id}`);
      setIsFollowing(data.following);
      setArtist((a) => ({
        ...a,
        followers: Array(data.followerCount).fill(null),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="font-mono text-cyan/40 tracking-widest animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="font-mono text-white/20 tracking-widest">ARTIST NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero banner */}
      <div className="relative h-48 md:h-64 bg-surface-1 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 60% 50%, #00F5FF 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Profile row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-10 mb-10 relative z-10">
          {/* Avatar */}
          <div
            className="w-24 h-24 border-4 border-surface bg-surface-2 overflow-hidden flex-shrink-0"
            style={{
              clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              borderColor: 'var(--surface)',
              outline: '2px solid rgba(0,245,255,0.4)',
            }}
          >
            {artist.avatar ? (
              <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-cyan">
                {artist.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display font-bold text-3xl md:text-4xl tracking-wider">
                {artist.name}
              </h1>
              {artist.verified && (
                <span
                  className="text-[10px] font-mono text-cyan border border-cyan/40 px-2 py-1 tracking-widest"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                >
                  ✦ VERIFIED
                </span>
              )}
              {artist.isMuseum && (
                <span
                  className="text-[10px] font-mono text-gold/70 border border-gold/30 px-2 py-1 tracking-widest"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                >
                  ◆ MUSEUM
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-white/30 tracking-widest mt-1">
              {artist.followers?.length || 0} followers
            </p>
          </div>

          {/* Follow button */}
          <button
            onClick={handleFollow}
            disabled={!user}
            className={`px-8 py-2.5 text-xs font-mono tracking-widest uppercase transition-all flex-shrink-0 ${
              isFollowing
                ? 'border border-cyan/40 text-cyan hover:border-red-400/40 hover:text-red-400'
                : 'btn-cyber'
            } ${!user ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {!user ? 'Login to Follow' : isFollowing ? '✓ Following' : '+ Follow'}
          </button>
        </div>

        {/* Bio */}
        {artist.bio && (
          <p className="text-white/60 font-display leading-relaxed max-w-2xl mb-10">
            {artist.bio}
          </p>
        )}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-white/5 mb-8">
          {[
            { key: 'drops', label: `Drops (${products.length})` },
            { key: 'posts', label: `Posts (${posts.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-all ${
                activeTab === key
                  ? 'border-cyan text-cyan'
                  : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'drops' && (
          products.length === 0 ? (
            <div className="text-center py-20 text-white/20 font-mono tracking-widest text-sm">
              NO DROPS YET
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )
        )}

        {activeTab === 'posts' && (
          posts.length === 0 ? (
            <div className="text-center py-20 text-white/20 font-mono tracking-widest text-sm">
              NO POSTS YET
            </div>
          ) : (
            <div className="max-w-2xl space-y-4">
              {posts.map((post) => <FeedPost key={post._id} post={post} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}
