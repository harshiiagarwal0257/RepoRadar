import type {
  RepoOverviewData,
  LanguageBreakdown,
  CommitActivityData,
  ContributorData,
  ReadmeCheckData,
  HealthScoreData,
} from "@/types";

interface HealthInput {
  overview: RepoOverviewData;
  languages: LanguageBreakdown[];
  commitActivity: CommitActivityData;
  contributors: ContributorData[];
  readme: ReadmeCheckData;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function gradeFor(total: number): string {
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
}

export function calculateHealthScore(input: HealthInput): HealthScoreData {
  const { overview, commitActivity, contributors, readme } = input;

  // 1. Popularity (25) — log-scaled stars
  const starScore = clamp(Math.round((Math.log10(overview.stars + 1) / 5) * 25), 0, 25);
  const starDetail = `${overview.stars.toLocaleString()} stars`;

  // 2. Activity (25) — recent commits + recency of last push
  const recentWeeks = commitActivity.weekly.slice(-12);
  const recentCommits = recentWeeks.reduce((s, w) => s + w.commits, 0);
  const commitScore = clamp(Math.round((Math.log10(recentCommits + 1) / 3) * 15), 0, 15);

  const daysSincePush = (Date.now() - new Date(overview.pushedAt).getTime()) / 86400000;
  let recencyScore: number;
  if (daysSincePush < 30) recencyScore = 10;
  else if (daysSincePush < 90) recencyScore = 7;
  else if (daysSincePush < 180) recencyScore = 5;
  else if (daysSincePush < 365) recencyScore = 3;
  else recencyScore = 0;
  const activityScore = commitScore + recencyScore;
  const activityDetail = `${recentCommits} commits in last 12 weeks, last push ${Math.round(daysSincePush)}d ago`;

  // 3. Community (20) — contributor count
  const contributorCount = contributors.length;
  const communityScore = clamp(Math.round((Math.log10(contributorCount + 1) / 1.5) * 20), 0, 20);
  const communityDetail = `${contributorCount} contributors`;

  // 4. Documentation (20) — README quality
  const docScore = Math.round((readme.estimatedQualityScore / 100) * 20);
  const docDetail = readme.found
    ? `README quality ${readme.estimatedQualityScore}/100`
    : "No README found";

  // 5. Maintenance (10) — license + low open-issue ratio
  let maintenanceScore = 0;
  if (overview.license) maintenanceScore += 4;
  const issueRatio =
    overview.openIssues > 0
      ? overview.openIssues / (overview.stars + 1)
      : 0;
  if (issueRatio < 0.05) maintenanceScore += 6;
  else if (issueRatio < 0.15) maintenanceScore += 4;
  else if (issueRatio < 0.3) maintenanceScore += 2;
  const maintenanceDetail = `${overview.license ? "Has license" : "No license"}, ${overview.openIssues} open issues`;

  const total =
    starScore + activityScore + communityScore + docScore + maintenanceScore;

  return {
    total: clamp(total, 0, 100),
    grade: gradeFor(total),
    factors: [
      { label: "Popularity", score: starScore, max: 25, detail: starDetail },
      { label: "Activity", score: activityScore, max: 25, detail: activityDetail },
      { label: "Community", score: communityScore, max: 20, detail: communityDetail },
      { label: "Documentation", score: docScore, max: 20, detail: docDetail },
      { label: "Maintenance", score: maintenanceScore, max: 10, detail: maintenanceDetail },
    ],
  };
}
