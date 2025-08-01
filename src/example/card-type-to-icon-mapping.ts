import {
  GithubIcon,
  HashIcon,
  Users2Icon,
  AlbumIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react";
import type { MockCardContentCustomDataGithubInfo } from "@/example/types";

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
  unknown: {
    icon: HashIcon,
    color: "text-gray-600",
  },
};
