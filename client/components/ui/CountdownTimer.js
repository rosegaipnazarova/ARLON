'use client';
import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = new Date(targetDate) - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-4 md:gap-8">
          <div className="text-center">
            <div
              className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center border border-gold/30 relative"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}
            >
              {/* Corner dots */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-gold/40" />
              <div className="absolute top-1 right-1 w-1 h-1 bg-gold/40" />
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-gold/40" />
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-gold/40" />

              <span className="font-mono font-bold text-3xl md:text-4xl text-glow-gold">
                {String(value).padStart(2, '0')}
              </span>
            </div>
            <p className="text-[9px] font-mono text-white/30 tracking-[0.3em] mt-2">{label}</p>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-mono text-white/20 mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
