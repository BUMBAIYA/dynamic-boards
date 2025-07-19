import {
  GithubIcon,
  HashIcon,
  Users2Icon,
  StarIcon,
  AlbumIcon,
  type LucideIcon,
  TrendingUpIcon,
} from "lucide-react";
import type { MockCardContentCustomDataGithubInfo } from "./types";

export const GITHUB_CARD_TYPE_TO_ICON_MAPPING: Record<
  MockCardContentCustomDataGithubInfo | "unknown",
  {
    icon: LucideIcon;
    color: string;
  }
> = {
  profile: {
    icon: GithubIcon,
    color: "text-blue-600",
  },
  repos: {
    icon: AlbumIcon,
    color: "text-green-600",
  },
  metrics: {
    icon: TrendingUpIcon,
    color: "text-blue-600",
  },
  followers: {
    icon: Users2Icon,
    color: "text-red-600",
  },
  stargazers: {
    icon: StarIcon,
    color: "text-purple-600",
  },
  unknown: {
    icon: HashIcon,
    color: "text-gray-600",
  },
};
