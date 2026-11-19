import {
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  Package,
  BookOpen,
  Users,
  Scale,
  BadgeCheck,
} from "lucide-react";
import type { ReadmeCheckData } from "@/types";

interface ReadmeChecksProps {
  readme: ReadmeCheckData;
}

function CheckRow({
  ok,
  icon,
  label,
}: {
  ok: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0 text-slate-600" />
      )}
      <span className={ok ? "text-slate-300" : "text-slate-600"}>{label}</span>
      <span className="ml-auto text-slate-500">{icon}</span>
    </li>
  );
}

export function ReadmeChecks({ readme }: ReadmeChecksProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <FileText className="h-5 w-5 text-emerald-400" />
          README & Docs Quality
        </h2>
        <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-sm font-semibold text-slate-200 tabular-nums">
          {readme.estimatedQualityScore}/100
        </span>
      </div>

      {!readme.found ? (
        <p className="mt-4 text-sm text-slate-500">
          No README file found in this repository. Adding one greatly improves
          discoverability and onboarding for new users.
        </p>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <span className="font-medium text-slate-300">{readme.fileName}</span>
            <span className="text-slate-600">·</span>
            <span>{readme.size.toLocaleString()} bytes</span>
            {readme.url && (
              <a
                href={readme.url}
                target="_blank"
                rel="noreferrer noopener"
                className="ml-auto inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
              >
                <Download className="h-3.5 w-3.5" />
                View
              </a>
            )}
          </div>

          <ul className="mt-4 space-y-2.5">
            <CheckRow ok={readme.hasContent} icon={<BookOpen className="h-4 w-4" />} label="Has readable content" />
            <CheckRow ok={readme.hasInstallSection} icon={<Package className="h-4 w-4" />} label="Installation instructions" />
            <CheckRow ok={readme.hasUsageSection} icon={<BookOpen className="h-4 w-4" />} label="Usage / getting started" />
            <CheckRow ok={readme.hasContributingSection} icon={<Users className="h-4 w-4" />} label="Contributing guide" />
            <CheckRow ok={readme.hasLicenseSection} icon={<Scale className="h-4 w-4" />} label="License section" />
            <CheckRow ok={readme.hasBadges} icon={<BadgeCheck className="h-4 w-4" />} label="Badges (CI / coverage)" />
          </ul>
        </>
      )}
    </div>
  );
}
