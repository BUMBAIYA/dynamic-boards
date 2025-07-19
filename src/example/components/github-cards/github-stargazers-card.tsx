import { useState, useEffect } from "react";

import { ExternalLinkIcon, StarIcon } from "lucide-react";
import {
  GitHubApiService,
  type GitHubUser,
} from "@/example/services/github-api";

interface GitHubStargazersCardProps {
  repoOwner: string;
  repoName: string;
}

export function GitHubStargazersCard({
  repoOwner,
  repoName,
}: GitHubStargazersCardProps) {
  const [stargazers, setStargazers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStargazers = async () => {
      try {
        setLoading(true);
        setError(null);
        const githubService = new GitHubApiService();
        const stargazersData = await githubService.getStargazers(
          repoOwner,
          repoName,
        );
        setStargazers(stargazersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch stargazers",
        );
      } finally {
        setLoading(false);
      }
    };

    if (repoOwner && repoName) {
      fetchStargazers();
    }
  }, [repoOwner, repoName]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-gray-500">Loading stargazers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (!stargazers.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-gray-500">No stargazers found</div>
      </div>
    );
  }

  // Take first 12 stargazers for display
  const displayStargazers = stargazers.slice(0, 12);

  return (
    <div className="flex h-full flex-col space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <StarIcon className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">Stargazers</h3>
        </div>
        <span className="text-xs text-gray-500">{stargazers.length} total</span>
      </div>

      <div className="mb-2 text-xs text-gray-600">
        <span className="font-medium">
          {repoOwner}/{repoName}
        </span>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-3 gap-3">
          {displayStargazers.map((stargazer) => (
            <div
              key={stargazer.id}
              className="group relative rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 hover:shadow-sm"
            >
              <a
                href={stargazer.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="relative">
                    <img
                      src={stargazer.avatar_url}
                      alt={`${stargazer.login} avatar`}
                      className="h-12 w-12 rounded-full"
                    />
                    <ExternalLinkIcon className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-600 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-900">
                      {stargazer.name || stargazer.login}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      @{stargazer.login}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {stargazers.length > 12 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500">
              Showing 12 of {stargazers.length} stargazers
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="rounded-lg bg-gray-50 p-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Total Stargazers:</span>
          <span className="font-medium">{stargazers.length}</span>
        </div>
      </div>
    </div>
  );
}
