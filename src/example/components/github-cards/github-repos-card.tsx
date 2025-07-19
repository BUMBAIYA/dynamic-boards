import { useState, useEffect } from "react";

import { StarIcon, GitForkIcon, CalendarIcon, GlobeIcon } from "lucide-react";

import {
  GitHubApiService,
  type GitHubRepo,
} from "@/example/services/github-api";

interface GitHubReposCardProps {
  username: string;
}

export function GitHubReposCard({ username }: GitHubReposCardProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        const githubService = new GitHubApiService();
        const reposData = await githubService.getUserRepositories(username);
        setRepos(reposData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch repositories",
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchRepos();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">Loading repositories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (!repos.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">No repositories found</div>
      </div>
    );
  }

  // Sort repos by stars and take top 5
  const publicReposSortedByStars = repos
    .filter((repo) => !repo.private)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  return (
    <div className="flex h-full flex-col space-y-3 p-4">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {publicReposSortedByStars.map((repo) => (
          <div
            key={repo.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                  >
                    {repo.name}
                  </a>
                  {repo.homepage && (
                    <a
                      href={
                        repo.homepage.startsWith("http")
                          ? repo.homepage
                          : `https://${repo.homepage}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 hover:bg-green-200"
                    >
                      <GlobeIcon className="h-3 w-3" />
                      <span>Live</span>
                    </a>
                  )}
                </div>

                {repo.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                    {repo.description}
                  </p>
                )}

                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  {repo.language && (
                    <span className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>{repo.language}</span>
                    </span>
                  )}

                  <span className="flex items-center space-x-1">
                    <StarIcon className="h-3 w-3" />
                    <span>{repo.stargazers_count}</span>
                  </span>

                  <span className="flex items-center space-x-1">
                    <GitForkIcon className="h-3 w-3" />
                    <span>{repo.forks_count}</span>
                  </span>

                  <span className="flex items-center space-x-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {repos.length > 5 && (
        <div className="text-center">
          <span className="text-xs text-gray-500">
            Total {repos.length} public repositories
          </span>
        </div>
      )}
    </div>
  );
}
