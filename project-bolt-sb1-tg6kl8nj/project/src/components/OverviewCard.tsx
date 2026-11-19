import {
  Star,
  GitFork,
  CircleDot,
  Eye,
  Scale,
  Globe,
  Calendar,
  GitBranch,
} from "lucide-react";
import type { RepoOverviewData } from "@/types";

interface OverviewCardProps {
  overview: RepoOverviewData;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-emerald-400">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-lg font-semibold text-slate-100 tabular-nums">
          {value}
        </div>
        <div className="truncate text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}

export function OverviewCard({ overview }: OverviewCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <img
            src={overview.ownerAvatarUrl}
            alt={overview.ownerLogin}
            className="h-14 w-14 rounded-xl ring-1 ring-slate-700"
          />
          <div className="min-w-0">
            <a
              href={overview.htmlUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-1.5 text-xl font-bold text-slate-100 hover:text-emerald-400"
            >
              {overview.fullName}
            </a>
            {overview.description && (
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                {overview.description}
              </p>
            )}
            {overview.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {overview.topics.slice(0, 8).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Stat icon={<Star className="h-5 w-5" />} label="Stars" value={overview.stars.toLocaleString()} />
        <Stat icon={<GitFork className="h-5 w-5" />} label="Forks" value={overview.forks.toLocaleString()} />
        <Stat icon={<CircleDot className="h-5 w-5" />} label="Open Issues" value={overview.openIssues.toLocaleString()} />
        <Stat icon={<Eye className="h-5 w-5" />} label="Watchers" value={overview.watchers.toLocaleString()} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<GitBranch className="h-5 w-5" />} label="Default Branch" value={overview.defaultBranch} />
        <Stat icon={<Scale className="h-5 w-5" />} label="License" value={overview.license ?? "None"} />
        <Stat icon={<Calendar className="h-5 w-5" />} label="Created" value={formatDate(overview.createdAt)} />
        <Stat icon={<Calendar className="h-5 w-5" />} label="Last Push" value={formatDate(overview.pushedAt)} />
      </div>

      {(overview.homepage || overview.topics.length > 0) && overview.homepage && (
        <div className="mt-3">
          <a
            href={overview.homepage}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
          >
            <Globe className="h-4 w-4" />
            {overview.homepage}
          </a>
        </div>
      )}
    </section>
  );
}
