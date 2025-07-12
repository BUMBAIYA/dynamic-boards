import { Fragment } from "react";

import { DynamicBoardRow } from "@/core/components/dynamic-board-row";
import { DynamicBoardCard } from "@/core/components/dynamic-board-card";
import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { DynamicBoardCardResizeHandle } from "@/core/components/dynamic-board-card-resize-handle";
import { CardImplementation } from "@/components/card-implementation";
import type { MockCardContent } from "@/types";

export function DynamicBoard() {
  const { rows, boardConfig } = useDynamicBoard<MockCardContent>();

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {rows.map((row) => (
        <DynamicBoardRow key={row.id} row={row}>
          {({ rowId, row, rowHeight, rowRef, isDraggingOver }) => (
            <div className="flex w-full">
              <div
                key={rowId}
                ref={rowRef}
                className="relative flex flex-1 items-stretch"
              >
                {isDraggingOver && (
                  <div className="bg-primary-light absolute inset-0" />
                )}
                {row.cards.map((card, idx) => (
                  <Fragment key={card.id}>
                    <DynamicBoardCard
                      key={card.id}
                      card={card}
                      rowId={row.id}
                      paddingX={8}
                      paddingY={8}
                    >
                      {(cardProps) => (
                        <CardImplementation key={card.id} {...cardProps} />
                      )}
                    </DynamicBoardCard>
                    {idx !== row.cards.length - 1 &&
                      !boardConfig.disableResizeCardWidth && (
                        <DynamicBoardCardResizeHandle
                          rowId={row.id}
                          cardIndex={idx}
                          height={rowHeight}
                        />
                      )}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </DynamicBoardRow>
      ))}
    </div>
  );
}
