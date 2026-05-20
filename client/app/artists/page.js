'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';

export default function ArtistsPage() {
  const { user } = useAuthStore();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState({});

  useEffect(() => {
    api.get('/artists')
      .then(({ data }) => {
        setArtists(data.artists || []);
        // Precompute which ones the user follows
        if (user?.subscriptions) {
          const map = {};
          user.subscriptions.forEach((sub) => {
            map[sub._id || sub] = true;
          });
          setFollowing(map);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleFollow = async (artistId) => {
    if (!user) return;
    try {
      const { data } = await api.post(`/artists/follow/${artistId}`);
      setFollowing((f) => ({ ...f, [artistId]: data.following }));
      setArtists((prev) =>
        prev.map((a) =>
          a._id === artistId ? { ...a, followers: Array(data.followerCount).fill(null) } : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] font-mono text-cyan/50 tracking-[0.4em] uppercase mb-3">
            ◈ Creators
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl tracking-wider">ARTISTS</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card h-56 animate-pulse" />
            ))}
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-24 text-white/20 font-mono tracking-widest">
            NO ARTISTS YET
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artists.map((artist) => {
              const isFollowing = following[artist._id];
              return (
                <div key={artist._id} className="glass-card p-5 space-y-4 hover:border-cyan/20 transition-colors group">
                  {/* Avatar */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 bg-surface-2 border border-cyan/20 overflow-hidden flex-shrink-0"
                      style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                    >
                      {artist.avatar ? (
                        <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cyan font-display font-bold text-lg">
                          {artist.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-semibold tracking-wide">{artist.name}</h3>
                        {artist.verified && (
                          <span className="text-cyan text-xs" title="Verified">✦</span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-white/30 tracking-widest">
                        {artist.followers?.length || 0} followers
                      </p>
                    </div>
                  </div>

                  {artist.bio && (
                    <p className="text-white/50 text-sm font-display leading-snug line-clamp-2">
                      {artist.bio}
                    </p>
                  )}

                  <button
                    onClick={() => handleFollow(artist._id)}
                    disabled={!user}
                    className={`w-full text-[10px] font-mono tracking-widest uppercase py-2 transition-all ${
                      isFollowing
                        ? 'bg-cyan/10 text-cyan border border-cyan/30 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30'
                        : 'btn-outline-cyber'
                    } ${!user ? 'opacity-30 cursor-not-allowed' : ''}`}
                    style={!isFollowing ? {} : {}}
                  >
                    {!user ? 'Login to Follow' : isFollowing ? '✓ Following' : '+ Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
