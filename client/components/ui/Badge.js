'use client';

const BADGE_CONFIG = {
  Collector: {
    icon: '◆',
    color: '#00F5FF',
    bg: 'rgba(0,245,255,0.1)',
    border: 'rgba(0,245,255,0.3)',
    desc: 'Owns 1+ item',
  },
  'Art Ambassador': {
    icon: '◈',
    color: '#FFD700',
    bg: 'rgba(255,215,0,0.1)',
    border: 'rgba(255,215,0,0.3)',
    desc: 'Follows 3+ artists',
  },
  'Verified Collector': {
    icon: '✦',
    color: '#A855F7',
    bg: 'rgba(168,85,247,0.1)',
    border: 'rgba(168,85,247,0.3)',
    desc: 'Verified authentic item',
  },
};

export default function Badge({ name, size = 'md' }) {
  const config = BADGE_CONFIG[name] || {
    icon: '★',
    color: '#fff',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    desc: name,
  };

  const sizes = {
    sm: 'px-2 py-1 text-[9px] gap-1',
    md: 'px-3 py-1.5 text-[11px] gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2',
  };

  return (
    <div
      className={`inline-flex items-center font-mono font-bold uppercase tracking-widest ${sizes[size]}`}
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
        clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
      }}
      title={config.desc}
    >
      <span>{config.icon}</span>
      <span>{name}</span>
    </div>
  );
}
