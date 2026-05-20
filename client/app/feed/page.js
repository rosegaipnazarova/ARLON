'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';
import FeedPost from '../../components/ui/FeedPost';
import Link from 'next/link';

export default function FeedPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get('/feed')
      .then(({ data }) => setPosts(data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-mono text-cyan/50 tracking-[0.4em] uppercase mb-3">
            ◈ Your Feed
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-wider">TRANSMISSIONS</h1>
          <p className="text-white/30 font-mono text-xs mt-2 tracking-widest">
            Posts from artists you follow
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card h-40 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-5xl opacity-10">◈</p>
            <p className="font-mono text-white/20 tracking-widest text-sm">NO TRANSMISSIONS</p>
            <p className="text-xs font-mono text-white/10 tracking-widest">
              Follow artists to see their posts here
            </p>
            <Link href="/artists" className="btn-outline-cyber text-xs px-6 py-2 inline-block mt-4">
              Discover Artists
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
