export default function Loading() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated ARLON logo */}
        <div className="relative">
          <span className="font-display font-bold text-4xl tracking-[0.4em] text-glow-cyan animate-pulse">
            ARLON
          </span>
          {/* Scanning line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan to-transparent animate-scan"
            style={{ animationDuration: '1.5s' }}
          />
        </div>
        <p className="text-[10px] font-mono text-white/20 tracking-[0.4em] uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}
