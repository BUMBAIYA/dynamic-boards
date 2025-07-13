import { Fragment } from "react";

import {
  DynamicBoardWindowAutoScroll,
  DynamicBoardRow,
  DynamicBoardCard,
  DynamicBoardCardResizeHandle,
  DynamicBoardRowHeightResizeHandle,
} from "@/core/components";
import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { ExampleCardImplementation } from "@/example/example-card-implementation";
import type { MockCardContent } from "@/types";

export function ExampleBoard() {
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
                            <ExampleCardImplementation
                              key={card.id}
                              {...cardProps}
                            />
                          )}
                        </DynamicBoardCard>
                        {/* User need to add this handle if they want to resize card width */}
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
                {/* User need to add this handle if they want to resize row height */}
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
