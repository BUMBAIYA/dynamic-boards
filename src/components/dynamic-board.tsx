import { lazy, Suspense } from "react";

import { DynamicBoardCardSkeleton } from "@/components/dynamic-board-card-skeleton";
import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";

const DynamicBoardCard = lazy(async () => {
  const { DynamicBoardCard } = await import("@/components/dynamic-board-card");
  return { default: DynamicBoardCard };
});

export function DynamicBoard() {
  const { rows } = useDynamicBoard();

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {row.map((card) => (
            <Suspense key={card.id} fallback={<DynamicBoardCardSkeleton />}>
              <DynamicBoardCard card={card} />
            </Suspense>
          ))}
        </div>
      ))}
    </div>
  );
}
