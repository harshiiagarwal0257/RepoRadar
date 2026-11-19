export function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex gap-4">
          <div className="h-14 w-14 rounded-xl bg-slate-800" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-64 rounded bg-slate-800" />
            <div className="h-4 w-96 max-w-full rounded bg-slate-800" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-slate-800" />
              <div className="h-5 w-20 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-800" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="h-5 w-40 rounded bg-slate-800" />
            <div className="mt-6 h-3 w-full rounded-full bg-slate-800" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 w-full rounded bg-slate-800" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
