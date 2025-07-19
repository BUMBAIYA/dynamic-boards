import { useState, useEffect } from "react";

import { StarIcon, GitForkIcon, CodeIcon } from "lucide-react";

import {
  GitHubApiService,
  type GitHubMetrics,
} from "@/example/services/github-api";

interface GitHubMetricsCardProps {
  username: string;
}

export function GitHubMetricsCard({ username }: GitHubMetricsCardProps) {
  const [metrics, setMetrics] = useState<GitHubMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const githubService = new GitHubApiService();
        const metricsData = await githubService.getUserMetrics(username);
        setMetrics(metricsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch metrics",
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchMetrics();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">Loading metrics...</div>
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

  if (!metrics) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">No metrics found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <div className="flex items-center justify-center space-x-1">
            <CodeIcon className="h-4 w-4 text-blue-600" />
            <span className="text-lg font-semibold text-blue-900">
              {metrics.totalRepos}
            </span>
          </div>
          <div className="text-xs text-blue-700">Repositories</div>
        </div>

        <div className="rounded-lg bg-yellow-50 p-3 text-center">
          <div className="flex items-center justify-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-lg font-semibold text-yellow-900">
              {metrics.totalStars}
            </span>
          </div>
          <div className="text-xs text-yellow-700">Total Stars</div>
        </div>

        <div className="rounded-lg bg-green-50 p-3 text-center">
          <div className="flex items-center justify-center space-x-1">
            <GitForkIcon className="h-4 w-4 text-green-600" />
            <span className="text-lg font-semibold text-green-900">
              {metrics.totalForks}
            </span>
          </div>
          <div className="text-xs text-green-700">Total Forks</div>
        </div>

        <div className="rounded-lg bg-purple-50 p-3 text-center">
          <div className="text-lg font-semibold text-purple-900">
            {metrics.averageRepoSize}
          </div>
          <div className="text-xs text-purple-700">Avg Repo Size</div>
        </div>
      </div>

      {/* Top Languages */}
      {metrics.topLanguages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Top Languages</h4>
          <div className="space-y-2">
            {metrics.topLanguages.map((lang, index) => (
              <div
                key={lang.language}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                    }}
                  ></div>
                  <span className="text-sm text-gray-700">{lang.language}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {lang.count} repos
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-auto rounded-lg bg-gray-50 p-3">
        <div className="text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Star/Repo Ratio:</span>
            <span className="font-medium">
              {metrics.totalRepos > 0
                ? (metrics.totalStars / metrics.totalRepos).toFixed(1)
                : 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fork/Repo Ratio:</span>
            <span className="font-medium">
              {metrics.totalRepos > 0
                ? (metrics.totalForks / metrics.totalRepos).toFixed(1)
                : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
