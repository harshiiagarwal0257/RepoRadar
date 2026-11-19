import type { ContributorData } from "@/types";

interface ContributorListProps {
  contributors: ContributorData[];
}

export function ContributorList({ contributors }: ContributorListProps) {
  const total = contributors.reduce((s, c) => s + c.contributions, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Contributors</h2>
        <span className="text-sm text-slate-500">
          {contributors.length} shown · {total.toLocaleString()} total commits
        </span>
      </div>

      {contributors.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No contributor data available.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {contributors.slice(0, 12).map((c) => {
            const pct = total > 0 ? (c.contributions / total) * 100 : 0;
            return (
              <li key={c.login}>
                <a
                  href={c.htmlUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-800/60"
                >
                  <img
                    src={c.avatarUrl}
                    alt={c.login}
                    className="h-9 w-9 rounded-full ring-1 ring-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-medium text-slate-200">
                        {c.login}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                        {c.contributions.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500/70"
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
