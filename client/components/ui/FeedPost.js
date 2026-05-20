'use client';

export default function FeedPost({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="glass-card p-5 space-y-4 transition-all hover:border-cyan/20">
      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 bg-surface-2 border border-cyan/30 overflow-hidden flex-shrink-0"
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        >
          {post.authorId?.avatar ? (
            <img src={post.authorId.avatar} alt={post.authorId.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyan font-mono text-sm">
              {post.authorId?.name?.[0]}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold tracking-wide">
              {post.authorId?.name}
            </span>
            {post.authorId?.verified && (
              <span className="text-[10px] font-mono text-cyan border border-cyan/30 px-1.5 py-0.5"
                style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
                ✦ VERIFIED
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono text-white/30 tracking-widest">{date}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-white/80 leading-relaxed font-display text-[15px]">{post.content}</p>

      {/* Images */}
      {post.images?.length > 0 && (
        <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.images.slice(0, 4).map((img, i) => (
            <div key={i} className="relative h-40 bg-surface-2 overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
