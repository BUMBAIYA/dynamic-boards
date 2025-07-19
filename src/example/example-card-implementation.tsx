import { PencilIcon, TrashIcon } from "lucide-react";

import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { useExampleBoard } from "@/example/context/useExampleBoard";
import type { DynamicBoardCardChildrenProps } from "@/core/components/dynamic-board-card";
import type { MockCardContent } from "@/example/types";

export type CardImplementationProps =
  DynamicBoardCardChildrenProps<MockCardContent>;

export function ExampleCardImplementation({
  rowId,
  card,
  dragHandleRef,
}: CardImplementationProps) {
  const { setShowOpenEditModal } = useExampleBoard();
  const { deleteCard } = useDynamicBoard();

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div
        ref={dragHandleRef}
        className="flex min-h-10 cursor-grab justify-between border-b border-gray-200 p-3 hover:bg-gray-50 active:cursor-grabbing"
      >
        <span className="text-lg font-medium">{card.customCardData.title}</span>
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
      <div className="flex-1 p-3 text-xs">
        {card.customCardData.githubInfo === "profile" ? (
          <div className="flex flex-col space-y-1">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {card.customCardData.title}
            </p>
          </div>
        ) : card.customCardData.githubInfo === "repos" ? (
          <div className="flex flex-col space-y-1">
            <p>
              <span className="font-medium">Repos:</span>{" "}
              {card.customCardData.title}
            </p>
          </div>
        ) : card.customCardData.githubInfo === "metrics" ? (
          <div className="flex flex-col space-y-1">
            <p>
              <span className="font-medium">Metrics:</span>{" "}
              {card.customCardData.title}
            </p>
          </div>
        ) : card.customCardData.githubInfo === "followers" ? (
          <div className="flex flex-col space-y-1">
            <p>
              <span className="font-medium">Followers:</span>{" "}
              {card.customCardData.title}
            </p>
          </div>
        ) : card.customCardData.githubInfo === "stargazers" ? (
          <div className="flex flex-col space-y-1">
            <p>
              <span className="font-medium">Stargazers:</span>{" "}
              {card.customCardData.title}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
