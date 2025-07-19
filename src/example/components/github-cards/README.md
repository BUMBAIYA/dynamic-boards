# GitHub Card Components

This directory contains specialized React components for displaying GitHub data in the dynamic board system. Each component fetches data from the GitHub API and renders it in a visually appealing card format.

## Components

### 1. GitHubProfileCard

Displays a user's GitHub profile information including:

- Avatar and basic user info
- Bio
- Repository, follower, and following counts
- Join date and public gists

**Props:**

- `username: string` - GitHub username to fetch profile for

### 2. GitHubReposCard

Shows a user's top repositories with:

- Repository name and description
- Programming language
- Star and fork counts
- Last updated date

**Props:**

- `username: string` - GitHub username to fetch repositories for

### 3. GitHubMetricsCard

Displays comprehensive GitHub statistics including:

- Total repositories, stars, and forks
- Top programming languages used
- Star/repo and fork/repo ratios

**Props:**

- `username: string` - GitHub username to fetch metrics for

### 4. GitHubFollowersCard

Shows a user's followers with:

- Follower avatars and names
- Links to follower profiles
- Total follower count

**Props:**

- `username: string` - GitHub username to fetch followers for

## GitHub API Service

The `GitHubApiService` class provides methods to fetch data from the GitHub API:

- `getUserProfile(username)` - Fetch user profile data
- `getUserRepositories(username)` - Fetch user repositories
- `getUserFollowers(username)` - Fetch user followers
- `getUserFollowing(username)` - Fetch users being followed
- `getUserMetrics(username)` - Calculate comprehensive user metrics
- `getStargazers(repoOwner, repoName)` - Fetch repository stargazers

## Usage

```tsx
import { GitHubProfileCard } from "@/example/components/github-cards";

function MyComponent() {
  return <GitHubProfileCard username="BUMBAIYA" />;
}
```

## Error Handling

All components include:

- Loading states while fetching data
- Error handling for API failures
- Rate limit handling
- User-friendly error messages

## Rate Limiting

The GitHub API has rate limits. The service includes proper error handling for rate limit exceeded errors and will display appropriate messages to users.

## Styling

Components use Tailwind CSS classes and are designed to fit within the dynamic board card system. They include:

- Responsive layouts
- Hover effects
- Loading and error states
- Consistent spacing and typography
