import { useState } from "react";
import { Radar, Github, Info } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { OverviewCard } from "@/components/OverviewCard";
import { LanguageChart } from "@/components/LanguageChart";
import { CommitActivityChart } from "@/components/CommitActivityChart";
import { ContributorList } from "@/components/ContributorList";
import { ReadmeChecks } from "@/components/ReadmeChecks";
import { HealthScoreCard } from "@/components/HealthScoreCard";
import { AnalysisSkeleton } from "@/components/AnalysisSkeleton";
import { ErrorBanner } from "@/components/ErrorBanner";
import { analyzeRepository, GitHubError } from "@/lib/github";
import type { RepoAnalysis } from "@/types";

export default function App() {
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleAnalyze(input: string) {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setAnalysis(null);
    try {
      const result = await analyzeRepository(input);
      setAnalysis(result);
    } catch (err) {
      if (err instanceof GitHubError) {
        setError(err.message);
      } else {
        setError("Something went wrong while analyzing this repository.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">RepoRadar</span>
              <span className="ml-2 hidden text-xs text-slate-500 sm:inline">
                GitHub Repository Analyzer
              </span>
            </div>
          </div>
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-emerald-400"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub API</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero / search */}
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Analyze any public GitHub repository
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Enter a repository URL to get a full breakdown — stats, languages, commit
            activity, contributors, README quality, and an overall health score.
          </p>
          <div className="mt-6">
            <SearchBar onAnalyze={handleAnalyze} loading={loading} />
          </div>
        </section>

        {/* Content */}
        <div className="mt-10">
          {error && (
            <div className="mb-6">
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {loading && <AnalysisSkeleton />}

          {!loading && !error && !analysis && !hasSearched && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 text-emerald-400">
                <Info className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-200">
                Ready when you are
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Search for a repository above to see a detailed analysis here. All data
                comes live from the GitHub API — nothing is mocked.
              </p>
            </div>
          )}

          {!loading && !error && analysis && (
            <div className="space-y-6">
              <OverviewCard overview={analysis.overview} />

              <HealthScoreCard health={analysis.health} />

              <div className="grid gap-6 lg:grid-cols-2">
                <LanguageChart languages={analysis.languages} />
                <CommitActivityChart data={analysis.commitActivity} />
                <ContributorList contributors={analysis.contributors} />
                <ReadmeChecks readme={analysis.readme} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 px-4 py-6">
        <div className="mx-auto max-w-6xl text-center text-xs text-slate-600">
          RepoRadar uses the public GitHub REST API. Rate limits apply for unauthenticated
          requests (60/hour per IP).
        </div>
      </footer>
    </div>
  );
}
