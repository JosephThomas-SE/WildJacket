export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-3xl rounded-3xl bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 backdrop-blur">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Welcome to WildJacket</h1>
        <p className="mt-6 text-xl text-slate-300">
          Your Next.js app is ready with TypeScript, Tailwind CSS, ESLint, and Turbopack.
        </p>
      </div>
    </main>
  );
}
