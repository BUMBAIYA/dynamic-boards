import { Fragment } from "react";

import { DynamicBoardWindowAutoScroll } from "@/core/components/dynamic-board-window-auto-scroll";
import { DynamicBoardRow } from "@/core/components/dynamic-board-row";
import { DynamicBoardCard } from "@/core/components/dynamic-board-card";
import { DynamicBoardCardResizeHandle } from "@/core/components/dynamic-board-card-resize-handle";
import { DynamicBoardRowHeightResizeHandle } from "@/core/components/dynamic-board-row-height-resize-handle";
import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { CardImplementation } from "@/components/card-implementation";
import type { MockCardContent } from "@/types";

export function DynamicBoard() {
  const { rows, boardConfig } = useDynamicBoard<MockCardContent>();

  return (
    <DynamicBoardWindowAutoScroll maxScrollSpeed="fast">
      <div className="flex flex-1 flex-col p-2">
        {rows.map((row) => (
          <DynamicBoardRow key={row.id} row={row}>
            {({ rowId, row, rowHeight, rowRef, isDraggingOver }) => (
              <div className="flex w-full flex-col">
                <div className="flex w-full">
                  <div
                    key={rowId}
                    ref={rowRef}
                    className="relative flex flex-1 items-stretch"
                  >
                    {isDraggingOver && (
                      <div className="bg-primary-light absolute inset-0" />
                    )}
                    {row.cards.map((card, cardIdx) => (
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
                        {cardIdx !== row.cards.length - 1 &&
                          !boardConfig.disableResizeCardWidth && (
                            <DynamicBoardCardResizeHandle
                              rowId={row.id}
                              cardIndex={cardIdx}
                              height={rowHeight}
                            />
                          )}
                      </Fragment>
                    ))}
                  </div>
                </div>
                {!boardConfig.disableResizeRowHeight && (
                  <DynamicBoardRowHeightResizeHandle rowId={row.id} />
                )}
              </div>
            )}
          </DynamicBoardRow>
        ))}
      </div>
    </DynamicBoardWindowAutoScroll>
  );
}
