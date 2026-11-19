import type { LanguageBreakdown } from "@/types";

interface LanguageChartProps {
  languages: LanguageBreakdown[];
}

// Approximate GitHub language colors for the most common languages.
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  "Jupyter Notebook": "#DA5B0B",
  Lua: "#000080",
  Perl: "#0298c3",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
  Zig: "#ec915c",
  "Objective-C": "#438eff",
  R: "#198CE7",
  Makefile: "#427819",
  Dockerfile: "#384d54",
};

function colorFor(lang: string): string {
  return LANG_COLORS[lang] ?? "#64748b";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function LanguageChart({ languages }: LanguageChartProps) {
  if (languages.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Languages</h2>
        <p className="mt-4 text-sm text-slate-500">
          No language data available for this repository.
        </p>
      </div>
    );
  }

  const top = languages.slice(0, 8);
  const remainingPct = languages.slice(8).reduce((s, l) => s + l.percentage, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <h2 className="text-lg font-semibold text-slate-100">Languages</h2>

      {/* Stacked bar */}
      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
        {top.map((l) => (
          <div
            key={l.language}
            style={{
              width: `${l.percentage}%`,
              backgroundColor: colorFor(l.language),
            }}
            title={`${l.language}: ${l.percentage.toFixed(1)}%`}
          />
        ))}
        {remainingPct > 0 && (
          <div
            style={{ width: `${remainingPct}%`, backgroundColor: "#64748b" }}
            title={`Other: ${remainingPct.toFixed(1)}%`}
          />
        )}
      </div>

      {/* Legend / list */}
      <ul className="mt-4 space-y-2.5">
        {top.map((l) => (
          <li key={l.language} className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: colorFor(l.language) }}
            />
            <span className="flex-1 text-sm text-slate-300">{l.language}</span>
            <span className="text-xs text-slate-500">{formatBytes(l.bytes)}</span>
            <span className="w-14 text-right text-sm font-medium text-slate-200 tabular-nums">
              {l.percentage.toFixed(1)}%
            </span>
          </li>
        ))}
        {remainingPct > 0 && (
          <li className="flex items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-full bg-slate-500" />
            <span className="flex-1 text-sm text-slate-400">Other</span>
            <span className="w-14 text-right text-sm font-medium text-slate-300 tabular-nums">
              {remainingPct.toFixed(1)}%
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
