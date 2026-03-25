import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-3xl opacity-50 mix-blend-screen animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-3xl opacity-50 mix-blend-screen"></div>
      </div>

      <div className="z-10 relative text-center space-y-8 max-w-4xl">
        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-cyan-400 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          The Future of Golf Charity
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 drop-shadow-sm">
          Win Big. <br/>
          Give Back.
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-100/60 max-w-2xl mx-auto leading-relaxed">
          A premium subscription platform where your golf scores unlock exclusive prizes and support world-changing causes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <Link href="/signup">
            <button className="px-8 py-4 rounded-xl bg-cyan-500 text-blue-950 font-bold text-lg hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]">
              Start Your Journey
            </button>
          </Link>
          
          <Link href="/pricing">
            <button className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-all">
              See How It Works
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-32 w-full max-w-6xl glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Monthly Draws</h3>
            <p className="text-white/60">Algorithm-driven selection based on your real golf performance.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Global Impact</h3>
            <p className="text-white/60">Choose from curated charities and track your contribution in real-time.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Premium Rewards</h3>
            <p className="text-white/60">Exclusive luxury prizes including equipment, travel, and experiences.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
