# RepoRadar — GitHub Repository Analyzer

RepoRadar is a full-stack web app that analyzes any public GitHub repository in real time using the GitHub REST API. Enter a repo URL and get a detailed dashboard covering stats, languages, commit activity, contributors, README quality, and an overall health score.

## Features

- **Repository overview** — name, description, stars, forks, open issues, watchers, license, topics, and key dates.
- **Language breakdown** — programming language distribution with a stacked bar chart and per-language percentages.
- **Commit activity** — weekly commit volume for the last 12 weeks, with hover details.
- **Contributor statistics** — top contributors with contribution counts and proportional bars.
- **README & docs quality checks** — detects installation, usage, contributing, license, and badge sections, with a quality score.
- **Health score** — a weighted 0–100 score (A–F grade) across five factors: popularity, activity, community, documentation, and maintenance. The calculation method is explained in-app.
- **Loading, error, and empty states** throughout.
- **Fully responsive** from mobile to desktop.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react (icons)
- GitHub REST API (live data — no mocked stats)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install & run

```bash
npm install
npm run dev
```

The app runs on the local dev server URL printed in your terminal.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                  # Root component, state & layout
├── components/              # UI components (presentation only)
│   ├── SearchBar.tsx
│   ├── OverviewCard.tsx
│   ├── LanguageChart.tsx
│   ├── CommitActivityChart.tsx
│   ├── ContributorList.tsx
│   ├── ReadmeChecks.tsx
│   ├── HealthScoreCard.tsx
│   ├── AnalysisSkeleton.tsx
│   └── ErrorBanner.tsx
├── lib/
│   ├── github.ts            # GitHub API client (all network logic)
│   └── healthScore.ts       # Health score calculation
└── types/
    └── index.ts             # Shared TypeScript types
```

API logic lives entirely in `src/lib/` and is kept separate from the UI components in `src/components/`.

## GitHub API & Rate Limits

RepoRadar uses unauthenticated requests to the GitHub REST API, which are limited to **60 requests per hour per IP**. If you hit the limit, the app shows a rate-limit message — wait a few minutes and try again.

To raise the limit to 5,000/hour, you can authenticate requests by adding a GitHub personal access token to the `ghFetch` headers in `src/lib/github.ts`:

```ts
headers: {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
}
```

Never commit tokens to source control — load them from environment variables.

## Health Score Methodology

The 0–100 score is the sum of five weighted factors:

| Factor           | Max | Basis                                                        |
|------------------|-----|--------------------------------------------------------------|
| Popularity       | 25  | Log-scaled star count                                        |
| Activity         | 25  | Commits in the last 12 weeks + recency of the last push      |
| Community        | 20  | Log-scaled contributor count                                 |
| Documentation    | 20  | README presence + structural quality checks                  |
| Maintenance      | 10  | License presence + open-issue-to-star ratio                  |

Grades: **A** (90+), **B** (80–89), **C** (70–79), **D** (60–69), **F** (below 60).

## Supported Input Formats

- `https://github.com/owner/repo`
- `github.com/owner/repo`
- `owner/repo`
