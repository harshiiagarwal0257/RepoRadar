import type {
  RepoOverviewData,
  LanguageBreakdown,
  CommitActivityData,
  ContributorData,
  ReadmeCheckData,
  RepoAnalysis,
} from "@/types";
import { calculateHealthScore } from "./healthScore";

const API_BASE = "https://api.github.com";

export class GitHubError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
  }
}

async function ghFetch<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });
  } catch {
    throw new GitHubError(
      "Unable to reach GitHub. Check your connection and try again.",
      0,
    );
  }

  if (res.status === 404) {
    throw new GitHubError("Repository not found. Check the URL and try again.", 404);
  }
  if (res.status === 403) {
    throw new GitHubError(
      "GitHub API rate limit reached. Wait a few minutes and try again.",
      403,
    );
  }
  if (!res.ok) {
    throw new GitHubError(
      `GitHub request failed (${res.status}). Try again later.`,
      res.status,
    );
  }
  return res.json() as Promise<T>;
}

interface GhRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  license: { spdx_id: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  topics: string[];
  size: number;
  owner: { login: string; avatar_url: string; html_url: string };
}

interface GhContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface GhReadme {
  name: string;
  size: number;
  content: string;
  encoding: string;
  html_url: string;
}

export function parseRepoUrl(input: string): { owner: string; repo: string } {
  const trimmed = input.trim();
  // Accept formats: https://github.com/owner/repo, github.com/owner/repo, owner/repo
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+?)(?:\/|$|\?|#)/i,
  );
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  const short = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (short) {
    return { owner: short[1], repo: short[2] };
  }
  throw new GitHubError(
    "Enter a valid GitHub URL like https://github.com/owner/repo or owner/repo.",
    0,
  );
}

async function fetchOverview(owner: string, repo: string): Promise<RepoOverviewData> {
  const r = await ghFetch<GhRepo>(`${API_BASE}/repos/${owner}/${repo}`);
  return {
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    htmlUrl: r.html_url,
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    watchers: r.watchers_count,
    defaultBranch: r.default_branch,
    license: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pushedAt: r.pushed_at,
    homepage: r.homepage,
    topics: r.topics ?? [],
    size: r.size,
    ownerLogin: r.owner.login,
    ownerAvatarUrl: r.owner.avatar_url,
    ownerHtmlUrl: r.owner.html_url,
  };
}

async function fetchLanguages(owner: string, repo: string): Promise<LanguageBreakdown[]> {
  const data = await ghFetch<Record<string, number>>(`${API_BASE}/repos/${owner}/${repo}/languages`);
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  if (total === 0) return [];
  return Object.entries(data)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: (bytes / total) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

async function fetchCommitActivity(owner: string, repo: string): Promise<CommitActivityData> {
  try {
    const data = await ghFetch<{ total: number; week: number }[]>(
      `${API_BASE}/repos/${owner}/${repo}/stats/commit_activity`,
    );
    if (!Array.isArray(data) || data.length === 0) {
      return { total: 0, weekly: [] };
    }
    return {
      total: data.reduce((s, w) => s + w.total, 0),
      weekly: data.map((w) => ({ week: w.week, commits: w.total })),
    };
  } catch (err) {
    // commit_activity stats can be empty/202 for fresh repos; fall back to recent commits
    if (err instanceof GitHubError && err.status === 202) {
      return { total: 0, weekly: [] };
    }
    throw err;
  }
}

async function fetchContributors(owner: string, repo: string): Promise<ContributorData[]> {
  const data = await ghFetch<GhContributor[]>(
    `${API_BASE}/repos/${owner}/${repo}/contributors?per_page=20`,
  );
  return data.map((c) => ({
    login: c.login,
    avatarUrl: c.avatar_url,
    htmlUrl: c.html_url,
    contributions: c.contributions,
  }));
}

async function fetchReadme(owner: string, repo: string): Promise<ReadmeCheckData> {
  let readme: GhReadme | null = null;
  try {
    readme = await ghFetch<GhReadme>(
      `${API_BASE}/repos/${owner}/${repo}/readme`,
    );
  } catch (err) {
    if (err instanceof GitHubError && err.status === 404) {
      return {
        found: false,
        fileName: null,
        size: 0,
        hasContent: false,
        hasInstallSection: false,
        hasUsageSection: false,
        hasContributingSection: false,
        hasLicenseSection: false,
        hasBadges: false,
        estimatedQualityScore: 0,
        url: null,
      };
    }
    throw err;
  }

  const content =
    readme.encoding === "base64"
      ? atob(readme.content.replace(/\n/g, ""))
      : readme.content;

  const lower = content.toLowerCase();
  const hasInstall = /(^|\n)#+.*install|## installation|npm install|yarn add|pip install|cargo /i.test(content);
  const hasUsage = /#+.*usage|## usage|how to use|getting started/i.test(content);
  const hasContributing = /#+.*contribut/i.test(content);
  const hasLicense = /#+.*license|## license/i.test(content);
  const hasBadges = /!\[.*\]\(https?:\/\/.*\)/i.test(content) || /shields\.io|badge/i.test(content);

  let score = 20; // base for having a README
  if (readme.size > 500) score += 10;
  if (readme.size > 2000) score += 10;
  if (hasInstall) score += 15;
  if (hasUsage) score += 15;
  if (hasContributing) score += 10;
  if (hasLicense) score += 10;
  if (hasBadges) score += 10;
  if (/(^|\n)#{1,6} /.test(content)) score += 10; // has headings

  return {
    found: true,
    fileName: readme.name,
    size: readme.size,
    hasContent: content.trim().length > 0,
    hasInstallSection: hasInstall,
    hasUsageSection: hasUsage,
    hasContributingSection: hasContributing,
    hasLicenseSection: hasLicense,
    hasBadges,
    estimatedQualityScore: Math.min(score, 100),
    url: readme.html_url,
  };
}

export async function analyzeRepository(input: string): Promise<RepoAnalysis> {
  const { owner, repo } = parseRepoUrl(input);

  const [overview, languages, commitActivity, contributors, readme] = await Promise.all([
    fetchOverview(owner, repo),
    fetchLanguages(owner, repo),
    fetchCommitActivity(owner, repo),
    fetchContributors(owner, repo),
    fetchReadme(owner, repo),
  ]);

  const health = calculateHealthScore({
    overview,
    languages,
    commitActivity,
    contributors,
    readme,
  });

  return { overview, languages, commitActivity, contributors, readme, health };
}
