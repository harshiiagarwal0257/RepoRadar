import { useMemo } from "react";
import type { CommitActivityData } from "@/types";

interface CommitActivityChartProps {
  data: CommitActivityData;
}

export function CommitActivityChart({ data }: CommitActivityChartProps) {
  const { weeks, maxCommits, last12 } = useMemo(() => {
    const last12 = data.weekly.slice(-12);
    const maxCommits = Math.max(1, ...last12.map((w) => w.commits));
    return { weeks: last12, maxCommits, last12 };
  }, [data]);

  const totalRecent = last12.reduce((s, w) => s + w.commits, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Commit Activity</h2>
        <span className="text-sm text-slate-500">
          {totalRecent.toLocaleString()} commits · last 12 weeks
        </span>
      </div>

      {weeks.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No commit activity data available. This can happen for very new or inactive
          repositories — GitHub builds these stats on demand.
        </p>
      ) : (
        <div className="mt-5 flex items-end gap-1.5 sm:gap-2" style={{ height: 180 }}>
          {weeks.map((w) => {
            const heightPct = (w.commits / maxCommits) * 100;
            const label = new Date(w.week * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={w.week}
                className="group flex flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span className="text-[10px] font-medium text-slate-300 opacity-0 transition group-hover:opacity-100">
                  {w.commits}
                </span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 transition group-hover:from-emerald-500 group-hover:to-emerald-300"
                  style={{ height: `${Math.max(heightPct, 2)}%` }}
                  title={`${label}: ${w.commits} commits`}
                />
                <span className="hidden text-[10px] text-slate-600 sm:block">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Total tracked commits across all weeks: {data.total.toLocaleString()}
      </p>
    </div>
  );
}
