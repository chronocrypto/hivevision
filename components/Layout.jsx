import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg text-white">
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent via-purple-400 to-blue-500 shadow-lg shadow-accent/60" />
            <span className="font-semibold tracking-[0.18em] text-xs uppercase">
              HiveVision
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-xs md:text-sm text-white/70">
            <Link href="/" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition">
              Network
            </Link>
            <Link href="/leaderboards" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition">
              Leaderboards
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
