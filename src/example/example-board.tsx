import { Fragment } from "react";

// ------------------- Core Components -------------------

import {
  DynamicBoardWindowAutoScroll,
  DynamicBoardRow,
  DynamicBoardCard,
  DynamicBoardCardResizeHandle,
  DynamicBoardRowHeightResizeHandle,
} from "@/core/components";
import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";

// ------------------- Example Board Implementation -------------------

import { ExampleCardImplementation } from "@/example/example-card-implementation";
import { AddNewCard } from "@/example/components/add-new-card";
import type { MockCardContent } from "@/example/types";

export function ExampleBoard() {
  const { rows, boardConfig } = useDynamicBoard<MockCardContent>();

  return (
    <DynamicBoardWindowAutoScroll maxScrollSpeed="fast">
      <div className="flex flex-1 flex-col p-2 pb-16">
        {rows.map((row, rowIdx) => (
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
                            // User need to implement the card implementation here.
                            // This is just an example.
                            <ExampleCardImplementation
                              key={card.id}
                              {...cardProps}
                              githubUsername={"bumbaiya"}
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
                  {/* Follow the board config to disable add new card */}
                  {/* User need to implement their own add new card button here. */}
                  {row.cards.length < boardConfig.maxCardsPerRow &&
                    !boardConfig.disableAddCard && (
                      <AddNewCard
                        rowId={row.id}
                        row={rowIdx}
                        col={row.cards.length}
                        widthPercentage={100 / (row.cards.length + 1)}
                        rowHeight={rowHeight}
                      />
                    )}
                </div>
                {/* Follow the board config to disable resize row height */}
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
