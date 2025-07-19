export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  hireable: boolean;
  twitter_username: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  private: boolean;
  homepage: string | null;
}

export interface GitHubMetrics {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: Array<{ language: string; count: number }>;
  averageRepoSize: number;
}

export class GitHubApiService {
  private baseUrl = "https://api.github.com";

  private async fetchWithRateLimit<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "dynamic-boards-app",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (response.status === 404) {
        throw new Error("User not found.");
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  async getUserProfile(username: string): Promise<GitHubUser> {
    const url = `${this.baseUrl}/users/${username}`;
    return this.fetchWithRateLimit<GitHubUser>(url);
  }

  async getUserRepositories(username: string): Promise<GitHubRepo[]> {
    const url = `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=100`;
    return this.fetchWithRateLimit<GitHubRepo[]>(url);
  }

  async getUserFollowers(username: string): Promise<GitHubUser[]> {
    const url = `${this.baseUrl}/users/${username}/followers?per_page=100`;
    return this.fetchWithRateLimit<GitHubUser[]>(url);
  }

  async getUserFollowing(username: string): Promise<GitHubUser[]> {
    const url = `${this.baseUrl}/users/${username}/following?per_page=100`;
    return this.fetchWithRateLimit<GitHubUser[]>(url);
  }

  async getUserMetrics(username: string): Promise<GitHubMetrics> {
    const [user, repos] = await Promise.all([
      this.getUserProfile(username),
      this.getUserRepositories(username),
    ]);

    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0,
    );
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    const languageCounts = repos.reduce(
      (acc, repo) => {
        if (repo.language) {
          acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const topLanguages = Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averageRepoSize = repos.length > 0 ? repos.length : 0;

    return {
      totalRepos: user.public_repos,
      totalStars,
      totalForks,
      topLanguages,
      averageRepoSize,
    };
  }

  async getStargazers(
    repoOwner: string,
    repoName: string,
  ): Promise<GitHubUser[]> {
    const url = `${this.baseUrl}/repos/${repoOwner}/${repoName}/stargazers?per_page=100`;
    return this.fetchWithRateLimit<GitHubUser[]>(url);
  }
}
