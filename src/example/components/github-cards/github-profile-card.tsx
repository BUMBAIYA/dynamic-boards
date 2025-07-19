import { useState, useEffect } from "react";

import {
  ExternalLinkIcon,
  UsersIcon,
  CalendarIcon,
  BuildingIcon,
  MapPinIcon,
  GlobeIcon,
  TwitterIcon,
  CheckCircleIcon,
} from "lucide-react";

import {
  GitHubApiService,
  type GitHubUser,
} from "@/example/services/github-api";

interface GitHubProfileCardProps {
  username: string;
}

export function GitHubProfileCard({ username }: GitHubProfileCardProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const githubService = new GitHubApiService();
        const userData = await githubService.getUserProfile(username);
        setUser(userData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">Loading profile...</div>
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

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-sm text-gray-500">No user data found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      {/* Header with avatar and basic info */}
      <div className="flex items-center space-x-3">
        <img
          src={user.avatar_url}
          alt={`${user.login} avatar`}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex-1">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5"
          >
            <h3 className="font-semibold text-gray-900 hover:text-blue-600">
              {user.name || user.login}
            </h3>
            <ExternalLinkIcon className="size-4 text-blue-600 hover:text-blue-800" />
          </a>

          <p className="text-sm text-gray-500">@{user.login}</p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="text-sm text-gray-700">
          <p>{user.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-lg font-semibold text-gray-900">
            {user.public_repos}
          </div>
          <div className="text-xs text-gray-500">Repositories</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-lg font-semibold text-gray-900">
            {user.followers}
          </div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">
          <div className="text-lg font-semibold text-gray-900">
            {user.following}
          </div>
          <div className="text-xs text-gray-500">Following</div>
        </div>
      </div>

      {/* Additional info */}
      <div className="space-y-3">
        {/* Basic info */}
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-3 w-3" />
            <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-3 w-3" />
            <span>{user.public_gists} public gists</span>
          </div>
        </div>

        {/* Contact & Professional Info */}
        {(user.company ||
          user.location ||
          user.blog ||
          user.twitter_username ||
          user.hireable) && (
          <div className="rounded-lg bg-blue-50 p-3">
            <h4 className="mb-2 text-xs font-medium text-blue-900">
              Contact & Info
            </h4>
            <div className="space-y-1 text-xs text-blue-800">
              {user.company && (
                <div className="flex items-center space-x-2">
                  <BuildingIcon className="h-3 w-3" />
                  <span>{user.company}</span>
                </div>
              )}

              {user.location && (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-3 w-3" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.blog && (
                <div className="flex items-center space-x-2">
                  <GlobeIcon className="h-3 w-3" />
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-600 hover:text-blue-800"
                  >
                    {user.blog}
                  </a>
                </div>
              )}

              {user.twitter_username && (
                <div className="flex items-center space-x-2">
                  <TwitterIcon className="h-3 w-3" />
                  <a
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    @{user.twitter_username}
                  </a>
                </div>
              )}

              {user.hireable && (
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Available for hire</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
