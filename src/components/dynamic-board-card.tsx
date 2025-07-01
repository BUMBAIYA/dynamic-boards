import { useEffect, useRef } from "react";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";

import type { DynamicBoardDNDCard } from "@/core/types";

export interface DynamicBoardCardProps {
  card: DynamicBoardDNDCard;
}

export function DynamicBoardCard({ card }: DynamicBoardCardProps) {
  const cardElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardElementRef.current;
    invariant(element, "Card element not found");

    return combine(
      draggable({
        element,
        getInitialData: () => ({
          id: card.id,
          type: "card",
        }),
      }),
    );
  }, [card.id]);

  return (
    <div
      ref={cardElementRef}
      className="flex min-h-60 flex-1 flex-col rounded-lg border border-gray-200 p-3"
    >
      <div className="flex flex-col">{card.title}</div>
      <p>{JSON.stringify(card)}</p>
    </div>
  );
}
