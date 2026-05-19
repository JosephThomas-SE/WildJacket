export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-soft backdrop-blur-xl">
        <p className="text-base font-medium text-slate-400">Page not found.</p>
        <p className="mt-3 text-lg font-semibold text-white">Please check the URL and try again.</p>
      </div>
    </div>
  );
}
