import { PageShell } from "@/components/layout/PageShell";

export default function HomePage() {
  return (
    <PageShell>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">WildJacket</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Discover and book premium wildlife and nature experiences in the world's most breathtaking wild places.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
