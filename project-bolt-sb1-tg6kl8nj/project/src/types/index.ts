export interface RepoOverviewData {
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  defaultBranch: string;
  license: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  homepage: string | null;
  topics: string[];
  size: number;
  ownerLogin: string;
  ownerAvatarUrl: string;
  ownerHtmlUrl: string;
}

export interface LanguageBreakdown {
  language: string;
  bytes: number;
  percentage: number;
}

export interface CommitActivityData {
  total: number;
  weekly: { week: number; commits: number }[];
}

export interface ContributorData {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
}

export interface ReadmeCheckData {
  found: boolean;
  fileName: string | null;
  size: number;
  hasContent: boolean;
  hasInstallSection: boolean;
  hasUsageSection: boolean;
  hasContributingSection: boolean;
  hasLicenseSection: boolean;
  hasBadges: boolean;
  estimatedQualityScore: number;
  url: string | null;
}

export interface HealthScoreData {
  total: number;
  grade: string;
  factors: {
    label: string;
    score: number;
    max: number;
    detail: string;
  }[];
}

export interface RepoAnalysis {
  overview: RepoOverviewData;
  languages: LanguageBreakdown[];
  commitActivity: CommitActivityData;
  contributors: ContributorData[];
  readme: ReadmeCheckData;
  health: HealthScoreData;
}

export type AnalysisStatus = "idle" | "loading" | "success" | "error";
