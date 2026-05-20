import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 grid-bg">
      <div className="text-center space-y-6">
        <p className="text-[120px] md:text-[180px] font-display font-bold leading-none text-glow-cyan opacity-20">
          404
        </p>
        <div className="-mt-8 space-y-2">
          <h1 className="font-display font-bold text-3xl tracking-widest">SIGNAL LOST</h1>
          <p className="text-white/40 font-mono text-sm tracking-widest">
            This page has been dropped from the grid.
          </p>
        </div>
        <Link href="/" className="btn-cyber inline-block px-10 py-3 text-sm">
          Return to Base
        </Link>
      </div>
    </div>
  );
}
