import { useState, useEffect } from "react";

import { ExternalLinkIcon } from "lucide-react";

import {
  GitHubApiService,
  type GitHubUser,
} from "@/example/services/github-api";

interface GitHubFollowersCardProps {
  username: string;
}

export function GitHubFollowersCard({ username }: GitHubFollowersCardProps) {
  const [followers, setFollowers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        setError(null);
        const githubService = new GitHubApiService();
        const followersData = await githubService.getUserFollowers(username);
        setFollowers(followersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch followers",
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchFollowers();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">Loading followers...</div>
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

  if (!followers.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">No followers found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-3 p-4">
      <div className="flex-1">
        <div className="grid grid-cols-3 gap-3">
          {followers.map((follower) => (
            <div
              key={follower.id}
              className="group relative rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-300 hover:shadow-sm"
            >
              <a
                href={follower.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="relative">
                    <img
                      src={follower.avatar_url}
                      alt={`${follower.login} avatar`}
                      className="h-12 w-12 rounded-full"
                    />
                    <ExternalLinkIcon className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-600 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-900">
                      {follower.name || follower.login}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      @{follower.login}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-lg bg-gray-50 p-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Total Followers:</span>
          <span className="font-medium">{followers.length}</span>
        </div>
      </div>
    </div>
  );
}
