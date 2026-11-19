import { useState, type FormEvent } from "react";
import { Search, Loader2, Radar } from "lucide-react";

interface SearchBarProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

const EXAMPLES = [
  "facebook/react",
  "vercel/next.js",
  "microsoft/vscode",
];

export function SearchBar({ onAnalyze, loading }: SearchBarProps) {
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (v) onAnalyze(v);
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a GitHub repo URL or owner/repo…"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-12 pr-4 py-3.5 text-slate-100 placeholder-slate-500 outline-none transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20"
            disabled={loading}
            aria-label="GitHub repository URL"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Radar className="h-5 w-5" />
          )}
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setValue(ex);
              onAnalyze(ex);
            }}
            disabled={loading}
            className="rounded-full border border-slate-700 px-3 py-1 text-slate-400 transition hover:border-emerald-500/60 hover:text-emerald-400 disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
