import { PencilIcon, TrashIcon } from "lucide-react";

import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { useExampleBoard } from "@/example/context/useExampleBoard";
import type { DynamicBoardCardChildrenProps } from "@/core/components/dynamic-board-card";
import type { MockCardContent } from "@/example/types";
import {
  GitHubProfileCard,
  GitHubReposCard,
  GitHubMetricsCard,
  GitHubFollowersCard,
} from "@/example/components/github-cards";
import { GITHUB_CARD_TYPE_TO_ICON_MAPPING } from "./card-type-to-icon-mapping";

export type CardImplementationProps =
  DynamicBoardCardChildrenProps<MockCardContent> & {
    /**
     * GitHub username to fetch data for.
     * For stargazers cards, this should be in format "owner/repo" (e.g., "bumbaiya/dynamic-boards")
     */
    githubUsername: string;
  };

export function ExampleCardImplementation({
  rowId,
  card,
  dragHandleRef,
  githubUsername,
}: CardImplementationProps) {
  const { setShowOpenEditModal } = useExampleBoard();
  const { deleteCard } = useDynamicBoard();

  const Icon =
    GITHUB_CARD_TYPE_TO_ICON_MAPPING[card.customCardData.githubInfo] ||
    GITHUB_CARD_TYPE_TO_ICON_MAPPING.unknown;

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div
        ref={dragHandleRef}
        className="flex min-h-10 cursor-grab justify-between border-b border-gray-200 p-3 hover:bg-gray-50 active:cursor-grabbing"
      >
        <div className="flex items-center space-x-2">
          <Icon.icon className={`size-5 ${Icon.color}`} />
          <span className="text-lg font-medium">
            {card.customCardData.title}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowOpenEditModal({
                mode: "edit",
                data: card,
              });
            }}
            className="flex h-7 shrink-0 cursor-pointer items-center justify-center space-x-1 rounded-md px-2 hover:bg-gray-200"
          >
            <PencilIcon className="size-3" />
            <span className="text-xs">Edit</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteCard(card.id, rowId);
            }}
            className="flex h-7 shrink-0 cursor-pointer items-center justify-center space-x-1 rounded-md px-2 hover:bg-gray-200"
          >
            <TrashIcon className="size-3" />
            <span className="text-xs">Delete</span>
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        {card.customCardData.githubInfo === "profile" ? (
          <GitHubProfileCard username={githubUsername} />
        ) : card.customCardData.githubInfo === "repos" ? (
          <GitHubReposCard username={githubUsername} />
        ) : card.customCardData.githubInfo === "metrics" ? (
          <GitHubMetricsCard username={githubUsername} />
        ) : card.customCardData.githubInfo === "followers" ? (
          <GitHubFollowersCard username={githubUsername} />
        ) : (
          <div className="flex h-full items-center justify-center p-3">
            <div className="text-sm text-gray-500">Unknown card type</div>
          </div>
        )}
      </div>
    </div>
  );
}
