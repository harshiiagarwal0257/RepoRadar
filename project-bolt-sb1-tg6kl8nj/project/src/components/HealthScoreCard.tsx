import type { HealthScoreData } from "@/types";

interface HealthScoreCardProps {
  health: HealthScoreData;
}

const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const GRADE_RING: Record<string, string> = {
  A: "stroke-emerald-400",
  B: "stroke-lime-400",
  C: "stroke-amber-400",
  D: "stroke-orange-400",
  F: "stroke-red-400",
};

export function HealthScoreCard({ health }: HealthScoreCardProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (health.total / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <h2 className="text-lg font-semibold text-slate-100">Repository Health Score</h2>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        {/* Circular score */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="fill-none stroke-slate-800"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className={`fill-none ${GRADE_RING[health.grade]} transition-all duration-700`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-3xl font-bold ${GRADE_COLORS[health.grade]}`}>
              {health.grade}
            </span>
            <span className="text-sm font-semibold text-slate-300 tabular-nums">
              {health.total}
            </span>
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="w-full space-y-3">
          {health.factors.map((f) => (
            <div key={f.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-slate-300">{f.label}</span>
                <span className="text-slate-400 tabular-nums">
                  {f.score}/{f.max}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500/80 transition-all duration-700"
                  style={{ width: `${(f.score / f.max) * 100}%` }}
                />
              </div>
              <p className="mt-0.5 text-xs text-slate-600">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <details className="mt-5 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-sm text-slate-400">
        <summary className="cursor-pointer font-medium text-slate-300">
          How is this score calculated?
        </summary>
        <p className="mt-2 leading-relaxed">
          The health score combines five factors, each weighted to reflect its impact
          on long-term project sustainability:
        </p>
        <ul className="mt-2 space-y-1.5 pl-4">
          <li><span className="text-slate-300">Popularity (25)</span> — log-scaled star count.</li>
          <li><span className="text-slate-300">Activity (25)</span> — commits in the last 12 weeks plus recency of the last push.</li>
          <li><span className="text-slate-300">Community (20)</span> — number of contributors (log-scaled).</li>
          <li><span className="text-slate-300">Documentation (20)</span> — README presence and structural quality checks.</li>
          <li><span className="text-slate-300">Maintenance (10)</span> — license presence and open-issue-to-star ratio.</li>
        </ul>
        <p className="mt-2 leading-relaxed">
          Grades: A (90+), B (80–89), C (70–79), D (60–69), F (below 60).
        </p>
      </details>
    </div>
  );
}
