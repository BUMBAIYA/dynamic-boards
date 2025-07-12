import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

import {
  buildDynamicBoardRowsFromCards,
  createDynamicBoardCardsMap,
  dynamicBoardDiffGrids,
  dynamicBoardDiffImproperLayout,
} from "@/core/utils/dynamic-board-utils";
import type {
  DynamicBoardContextType,
  DynamicBoardRow,
  DynamicBoardCard,
  DynamicBoardDragData,
  DynamicBoardLayoutChangeData,
  DynamicBoardConfig,
  DynamicBoardRowId,
  DynamicBoardCardId,
} from "@/core/context/dynamic-board-context";
import { createDynamicBoardContext } from "@/core/context/dynamic-board-context";

export const DynamicBoardContext = createDynamicBoardContext<unknown>();

/**
 * Default configuration for the dashboard layout.
 * These values are used when no boardConfig prop is provided.
 *
 * TODO: Implement disableDrag, disableResizeCardWidth, disableResizeRowHeight, disableAddCard and disableCardDropInBetweenRows in the provider for now we can use them conditionally in components
 *
 * @property {number} maxCardsPerRow - Maximum number of cards allowed in a single row
 * @property {number} minHeight - Minimum height (in pixels) for cards and rows
 * @property {number} maxHeight - Maximum height (in pixels) for cards and rows
 */
const DEFAULT_BOARD_CONFIG = {
  maxCardsPerRow: 3,
  minHeight: 100,
  maxHeight: 600,
  disableDrag: false,
  disableResizeCardWidth: false,
  disableResizeRowHeight: false,
  disableAddCard: false,
  disableCardDropInBetweenRows: true,
  enableLayoutCorrection: true,
};

/**
 * Props for the PragmaticDndDashboardProvider component.
 *
 * @template Content - The type of content stored in each card (extends the base card type)
 */
export interface DynamicBoardProviderProps<Content = unknown> {
  /** React children to be rendered within the provider */
  children: ReactNode;

  /**
   * Callback function triggered when the layout changes.
   * Receives data about updated rows and cards.
   */
  onLayoutChange?: (data: DynamicBoardLayoutChangeData<Content>) => void;

  /**
   * Initial cards to populate the dashboard with.
   * If not provided, the dashboard starts empty.
   */
  initialCards?: DynamicBoardCard<Content>[];

  /**
   * Configuration options for the dashboard layout.
   * Includes constraints for card and row dimensions.
   * @default { maxCardsPerRow: 3, minHeight: 100, maxHeight: 600 }
   */
  boardConfig?: DynamicBoardConfig;
}

/**
 * A provider component that manages the state and interactions for a drag-and-drop dashboard.
 * This provider handles card layout, resizing, reordering, and movement between rows.
 *
 * Features:
 * - Drag and drop card reordering within and between rows
 * - Card resizing with width constraints
 * - Row resizing with height constraints
 * - Automatic layout calculations and adjustments
 * - Layout change notifications
 *
 * @template Content - The type of content stored in each card (extends the base card type)
 *
 * @example
 * ```tsx
 * <DynamicBoardProvider
 *   onLayoutChange={(changes) => {
 *     // Handle layout changes
 *   }}
 *   initialCards={cards}
 *   boardConfig={{
 *     maxCardsPerRow: 3,
 *     minHeight: 100,
 *     maxHeight: 600
 *   }}
 * >
 *   <DynamicBoard />
 * </DynamicBoardProvider>
 * ```
 */
export function DynamicBoardProvider<Content = unknown>({
  children,
  onLayoutChange,
  initialCards,
  boardConfig = DEFAULT_BOARD_CONFIG,
}: DynamicBoardProviderProps<Content>) {
  const _finalBoardConfig = useMemo(() => {
    return {
      ...DEFAULT_BOARD_CONFIG,
      ...boardConfig,
    };
  }, [boardConfig]);

  const [rows, setRows] = useState<DynamicBoardRow<Content>[]>([]);
  const [cardsMap, setCardsMap] = useState<
    Map<DynamicBoardCardId, DynamicBoardCard<Content>>
  >(new Map());

  const [cardResizing, setCardResizing] = useState<{
    rowId: DynamicBoardRowId;
    cardIdx: number;
    startX: number;
    startWidth: number;
    neighborStartWidth: number;
  } | null>(null);

  const [rowResizing, setRowResizing] = useState<{
    rowId: DynamicBoardRowId;
    startY: number;
    startHeight: number;
  } | null>(null);

  const [rowDropIndicator, setRowDropIndicator] = useState<{
    show: boolean;
    rowId: DynamicBoardRowId;
    top: number;
    left: number;
    width: number;
  } | null>(null);

  /**
   * Calculates card widths while maintaining their relative proportions.
   * Used when cards are added, removed, or resized to ensure proper layout.
   *
   * @param cards - Array of cards to calculate widths for
   * @param totalWidth - Total width to distribute (defaults to 100%)
   * @returns Array of cards with updated width percentages
   */
  const calculateCardWidths = useCallback(
    (
      cards: DynamicBoardCard<Content>[],
      totalWidth: number = 100,
    ): DynamicBoardCard<Content>[] => {
      if (cards.length === 0) return [];

      const totalCurrentWidth = cards.reduce(
        (sum, card) => sum + card.layoutJson.widthPercentage,
        0,
      );

      return cards.map((card) => ({
        ...card,
        layoutJson: {
          ...card.layoutJson,
          widthPercentage:
            (card.layoutJson.widthPercentage / totalCurrentWidth) * totalWidth,
        },
      }));
    },
    [],
  );

  /**
   * Finds the closest valid position for a card in a row based on mouse position.
   * Used during drag and drop operations to determine where to place cards.
   *
   * @param row - The row to find position in
   * @param x - Mouse x position as percentage of row width
   * @returns Index where the card should be placed, or null if position is invalid
   */
  const findClosestPosition = useCallback(
    (row: DynamicBoardRow<Content>, x: number): number | null => {
      const positions = [0];
      let currentX = 0;

      for (const card of row.cards) {
        currentX += card.layoutJson.widthPercentage;
        positions.push(currentX);
      }

      const closest = positions.reduce((closest, pos) => {
        return Math.abs(pos - x) < Math.abs(closest - x) ? pos : closest;
      });

      if (closest === 100) return null;

      const insertIndex = positions.findIndex((pos) => pos === closest);
      return insertIndex;
    },
    [],
  );

  const findCard = useCallback(
    (cardId: number | string): DynamicBoardCard<Content> | null => {
      return cardsMap.get(cardId) || null;
    },
    [cardsMap],
  );

  const findRow = useCallback(
    (rowId: string): DynamicBoardRow<Content> | null => {
      return rows.find((r) => r.id === rowId) || null;
    },
    [rows],
  );

  /**
   * Reorders a card within its current row.
   * Updates the layout and triggers necessary state changes.
   *
   * @param rowId - ID of the row containing the card
   * @param startIndex - Current index of the card
   * @param finishIndex - Target index for the card
   */
  const reorderCard = useCallback(
    (rowId: DynamicBoardRowId, startIndex: number, finishIndex: number) => {
      setRows((prevRows) => {
        return prevRows.map((row, rowIndex) => {
          if (row.id !== rowId) return row;

          const cards = [...row.cards];
          const [removed] = cards.splice(startIndex, 1);
          cards.splice(finishIndex, 0, removed);

          const cardsWithWidths = calculateCardWidths(cards);

          const updatedCards = cardsWithWidths.map((card, index) => ({
            ...card,
            layoutJson: {
              ...card.layoutJson,
              row: rowIndex,
              col: index,
            },
          }));

          return { ...row, cards: updatedCards };
        });
      });
    },
    [calculateCardWidths],
  );

  /**
   * Updates the rows state and triggers layout change notifications.
   * This is the central function for applying layout changes to the dashboard.
   *
   * @param newRows - New rows configuration to apply
   */
  const updateRows = useCallback(
    (newRows: DynamicBoardRow<Content>[]) => {
      const newCardsMap = createDynamicBoardCardsMap(newRows);
      const changes = dynamicBoardDiffGrids(rows, newRows, cardsMap);
      setRows(newRows);
      setCardsMap(newCardsMap);
      if (changes.updatedCards.length > 0 || changes.updatedRows.length > 0) {
        onLayoutChange?.(changes);
      }
    },
    [rows, cardsMap, onLayoutChange],
  );

  /**
   * Loads a new set of cards into the dashboard.
   * Rebuilds the entire layout from the provided cards.
   *
   * @param cards - Array of cards to load into the dashboard
   */
  const loadBoardCards = useCallback(
    (cards: DynamicBoardCard<Content>[]) => {
      const newRows = buildDynamicBoardRowsFromCards(cards);
      updateRows(newRows);
    },
    [updateRows],
  );

  /**
   * Moves a card from one row to another.
   * Handles all the necessary layout adjustments and constraints.
   *
   * @param cardId - ID of the card to move
   * @param sourceRowId - ID of the source row
   * @param targetRowId - ID of the target row
   * @param position - Optional position in the target row
   */
  const moveCard = useCallback(
    (
      cardId: DynamicBoardCardId,
      sourceRowId: DynamicBoardRowId,
      targetRowId: DynamicBoardRowId,
      position?: number,
    ) => {
      setRows((prevRows) => {
        const sourceRowIndex = prevRows.findIndex(
          (row) => row.id === sourceRowId,
        );
        if (sourceRowIndex === -1) return prevRows;

        const sourceRow = prevRows[sourceRowIndex];
        const sourceCardIndex = sourceRow.cards.findIndex(
          (c) => c.id === cardId,
        );
        if (sourceCardIndex === -1) return prevRows;

        const card = sourceRow.cards[sourceCardIndex];
        const sourceCards = sourceRow.cards.filter((c) => c.id !== cardId);

        const targetRowIndex = prevRows.findIndex((r) => r.id === targetRowId);
        if (targetRowIndex === -1) return prevRows;

        const targetRow = prevRows[targetRowIndex];
        const targetRowCards = targetRow.cards;
        const insertIndex =
          position !== undefined ? position : targetRowCards.length;

        // First handle the target row
        let newTargetCards;
        if (targetRowCards.length >= _finalBoardConfig.maxCardsPerRow) {
          if (insertIndex === -1 || insertIndex >= targetRowCards.length)
            return prevRows;

          const cardToSwap = targetRowCards[insertIndex];
          if (!cardToSwap) return prevRows;

          // Get max height of target row
          const targetRowMaxHeight = targetRowCards.reduce(
            (max, card) => Math.max(max, card.layoutJson.height),
            0,
          );

          // Create new array for target row
          newTargetCards = [...targetRowCards];
          // Swap the cards while preserving their widths
          newTargetCards[insertIndex] = {
            ...card,
            layoutJson: {
              ...card.layoutJson,
              row: targetRowIndex,
              col: insertIndex,
              widthPercentage: cardToSwap.layoutJson.widthPercentage,
              height: targetRowMaxHeight,
            },
          };

          // Add the swapped card back to source row
          sourceCards.splice(sourceCardIndex, 0, {
            ...cardToSwap,
            layoutJson: {
              ...cardToSwap.layoutJson,
              row: sourceRowIndex,
              col: sourceCardIndex,
              widthPercentage: card.layoutJson.widthPercentage,
              height: card.layoutJson.height,
            },
          });
        } else {
          // Get max height of target row
          const targetRowMaxHeight = targetRowCards.reduce(
            (max, card) => Math.max(max, card.layoutJson.height),
            0,
          );

          // Handle adding a card to a row that's not full
          newTargetCards = [...targetRowCards];
          if (insertIndex === -1) {
            newTargetCards.push({
              ...card,
              layoutJson: {
                ...card.layoutJson,
                height: targetRowMaxHeight,
              },
            });
          } else {
            newTargetCards.splice(insertIndex, 0, {
              ...card,
              layoutJson: {
                ...card.layoutJson,
                height: targetRowMaxHeight,
              },
            });
          }

          // Calculate widths for the target row
          newTargetCards = calculateCardWidths(newTargetCards).map(
            (c, index) => ({
              ...c,
              layoutJson: {
                ...c.layoutJson,
                row: targetRowIndex,
                col: index,
              },
            }),
          );
        }

        // Calculate widths for the source row
        const newSourceCards = calculateCardWidths(sourceCards).map(
          (c, index) => ({
            ...c,
            layoutJson: {
              ...c.layoutJson,
              row: sourceRowIndex,
              col: index,
            },
          }),
        );

        // Create new rows array
        let newRows = [...prevRows];
        newRows[sourceRowIndex] = {
          ...sourceRow,
          cards: newSourceCards,
        };
        newRows[targetRowIndex] = {
          ...targetRow,
          cards: newTargetCards,
        };

        // If source row is now empty, remove it and update row numbers
        if (newSourceCards.length === 0) {
          // Create a new array without the empty row
          const rowsWithoutEmpty = newRows.filter((r) => r.id !== sourceRowId);

          // Update all rows to have sequential IDs and correct row indices
          newRows = rowsWithoutEmpty.map((row, index) => ({
            ...row,
            id: `row-${index + 1}`,
            cards: row.cards.map((c) => ({
              ...c,
              layoutJson: {
                ...c.layoutJson,
                row: index,
              },
            })),
          }));
        }

        // Update rows and trigger layout change through updateRows
        updateRows(newRows);
        return newRows;
      });
    },
    [calculateCardWidths, updateRows, _finalBoardConfig.maxCardsPerRow],
  );

  /**
   * Handles the start of a card resize operation.
   * Stores initial dimensions and positions for the resize.
   *
   * @param rowId - ID of the row containing the card
   * @param cardIdx - Index of the card being resized
   * @param pointer - Mouse pointer information
   */
  const handleResizeStart: DynamicBoardContextType<Content>["handleResizeStart"] =
    useCallback(
      (rowId, cardIdx, pointer) => {
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;
        if (cardIdx === row.cards.length - 1) return;
        if (!pointer.clientX) return;
        setCardResizing({
          rowId,
          cardIdx,
          startX: pointer.clientX,
          startWidth: row.cards[cardIdx].layoutJson.widthPercentage,
          neighborStartWidth: row.cards[cardIdx + 1].layoutJson.widthPercentage,
        });
      },
      [rows],
    );

  const handleResizeMove: DynamicBoardContextType<Content>["handleResizeMove"] =
    useCallback(
      (pointer) => {
        if (!cardResizing || !pointer.clientX) return;
        setRows((prevRows) => {
          return prevRows.map((row) => {
            if (row.id !== cardResizing.rowId) return row;
            const deltaPx = pointer.clientX! - cardResizing.startX;
            const rowElement = row.elementRef?.current;
            if (!rowElement) return row;
            const rowWidth = rowElement.offsetWidth;
            const deltaPercent = (deltaPx / rowWidth) * 100;
            let newWidth = cardResizing.startWidth + deltaPercent;
            let neighborNewWidth =
              cardResizing.neighborStartWidth - deltaPercent;

            // Ensure minimum width of 10% for both cards
            newWidth = Math.max(10, Math.min(newWidth, 90));
            neighborNewWidth = Math.max(10, Math.min(neighborNewWidth, 90));

            // Ensure total width doesn't exceed 100%
            const totalWidth = newWidth + neighborNewWidth;
            if (totalWidth > 100) {
              const excess = totalWidth - 100;
              newWidth -= excess / 2;
              neighborNewWidth -= excess / 2;
            }

            return {
              ...row,
              cards: row.cards.map((c, idx) => {
                if (idx === cardResizing.cardIdx) {
                  return {
                    ...c,
                    layoutJson: {
                      ...c.layoutJson,
                      widthPercentage: newWidth,
                    },
                  };
                }
                if (idx === cardResizing.cardIdx + 1) {
                  return {
                    ...c,
                    layoutJson: {
                      ...c.layoutJson,
                      widthPercentage: neighborNewWidth,
                      col: idx,
                    },
                  };
                }
                return c;
              }),
            };
          });
        });
      },
      [cardResizing],
    );

  const handleResizeEnd: DynamicBoardContextType<Content>["handleResizeEnd"] =
    useCallback(() => {
      if (cardResizing) {
        const row = rows.find((r) => r.id === cardResizing.rowId);
        if (row) {
          const updatedCards = [
            row.cards[cardResizing.cardIdx],
            row.cards[cardResizing.cardIdx + 1],
          ];
          onLayoutChange?.({
            updatedRows: rows,
            updatedCards,
          });
        }
      }
      setCardResizing(null);
    }, [rows, cardResizing, onLayoutChange]);

  useEffect(() => {
    if (cardResizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleResizeMove);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [cardResizing, handleResizeMove, handleResizeEnd]);

  useEffect(() => {
    return combine(
      monitorForElements({
        onDrag: (args) => {
          const { location, source } = args;
          if (!location.current.dropTargets.length) {
            setRowDropIndicator(null);
            return;
          }

          const sourceData = source.data as unknown as DynamicBoardDragData;
          if (!sourceData || !sourceData.id || !sourceData.rowId) {
            setRowDropIndicator(null);
            return;
          }

          // Get the mouse position relative to the viewport
          const mouseY = args.location.current.input.clientY;

          // Find the closest row based on mouse position
          const closestRow = rows.reduce(
            (closest, row) => {
              const rowElement = row.elementRef?.current;
              if (!rowElement) return closest;

              const rect = rowElement.getBoundingClientRect();
              const rowCenter = rect.top + rect.height / 2;
              const distance = Math.abs(mouseY - rowCenter);

              if (!closest || distance < closest.distance) {
                return { row, distance, rect };
              }
              return closest;
            },
            null as {
              row: DynamicBoardRow<Content>;
              distance: number;
              rect: DOMRect;
            } | null,
          );

          if (!closestRow) {
            setRowDropIndicator(null);
            return;
          }

          const { row: targetRow, rect } = closestRow;
          const isBetweenRows = mouseY < rect.top || mouseY > rect.bottom;

          if (isBetweenRows) {
            const indicatorTop = mouseY < rect.top ? rect.top : rect.bottom;
            setRowDropIndicator({
              show: true,
              rowId: targetRow.id,
              top: indicatorTop,
              left: rect.left,
              width: rect.width,
            });
          } else {
            setRowDropIndicator(null);
          }
        },
        onDrop: (args) => {
          setRowDropIndicator(null);
          const { location, source } = args;
          if (!location.current.dropTargets.length) return;

          const sourceData = source.data as unknown as DynamicBoardDragData;
          if (!sourceData || !sourceData.id || !sourceData.rowId) return;

          const sourceCardId = sourceData.id;
          const sourceCard = findCard(sourceCardId);
          if (!sourceCard) return;

          // Get the mouse position relative to the viewport
          const mouseY = args.location.current.input.clientY;

          // Find the closest row based on mouse position
          const closestRow = rows.reduce(
            (closest, row) => {
              const rowElement = row.elementRef?.current;
              if (!rowElement) return closest;

              const rect = rowElement.getBoundingClientRect();
              const rowCenter = rect.top + rect.height / 2;
              const distance = Math.abs(mouseY - rowCenter);

              if (!closest || distance < closest.distance) {
                return { row, distance, rect };
              }
              return closest;
            },
            null as {
              row: DynamicBoardRow<Content>;
              distance: number;
              rect: DOMRect;
            } | null,
          );

          if (!closestRow) return;

          const { rect } = closestRow;
          const isBetweenRows = mouseY < rect.top || mouseY > rect.bottom;

          // TODO: Handle card drop between rows
          // Handle card drop between rows
          if (isBetweenRows) {
            // Create a new row between existing rows
            return;
          }

          // Handle existing drop target logic
          if (location.current.dropTargets.length === 1) {
            const targetRowId = location.current.dropTargets[0].data
              .id as string;
            const targetRow = findRow(targetRowId);
            if (!targetRow) return;

            const rowElement = targetRow.elementRef?.current;
            if (!rowElement) return;

            const rect = rowElement.getBoundingClientRect();
            const mouseX = args.location.current.input.clientX;
            const relativeX = ((mouseX - rect.left) / rect.width) * 100;

            const position = findClosestPosition(targetRow, relativeX);
            if (position === null) return;

            if (sourceData.rowId === targetRowId) {
              const sourceRow = findRow(sourceData.rowId);
              if (!sourceRow) return;

              const sourceIndex = sourceRow.cards.findIndex(
                (c) => c.id === sourceCardId,
              );

              const targetIndex = position;

              if (targetIndex === sourceIndex) return;

              reorderCard(sourceRow.id, sourceIndex, targetIndex);
              return;
            }

            moveCard(sourceCardId, sourceData.rowId, targetRowId, position);
            return;
          }

          if (location.current.dropTargets.length === 2) {
            const [targetCardRecord, targetRowRecord] =
              location.current.dropTargets;
            const targetRowId = targetRowRecord.data.id as string;
            const targetCardId = parseInt(targetCardRecord.data.id as string);
            const targetRow = findRow(targetRowId);
            if (!targetRow) return;

            const targetCard = targetRow.cards.find(
              (c) => c.id === targetCardId,
            );
            if (!targetCard) return;

            const closestEdge = extractClosestEdge(targetCardRecord.data);
            const targetIndex = targetRow.cards.findIndex(
              (c) => c.id === targetCardId,
            );
            const position =
              closestEdge === "left" ? targetIndex : targetIndex + 1;

            if (sourceData.rowId === targetRowId) {
              const sourceRow = findRow(sourceData.rowId);
              if (!sourceRow) return;

              const sourceIndex = sourceRow.cards.findIndex(
                (c) => c.id === sourceCardId,
              );

              if (position === sourceIndex) return;

              reorderCard(sourceRow.id, sourceIndex, position);
              return;
            }

            moveCard(sourceCardId, sourceData.rowId, targetRowId, position);
          }
        },
      }),
    );
  }, [rows, findCard, findRow, reorderCard, findClosestPosition, moveCard]);

  /**
   * Adds a new card to a specific row.
   * Handles width calculations and layout adjustments for existing cards.
   *
   * @param rowId - ID of the row to add the card to
   * @param newCard - The new card to add
   */
  const addCard: DynamicBoardContextType<Content>["addCard"] = useCallback(
    (rowId, newCard) => {
      if (rowId === null) {
        setRows((prevRows) => {
          const newRows = [
            ...prevRows,
            { id: `row-${prevRows.length + 1}`, cards: [newCard] },
          ];
          setCardsMap(createDynamicBoardCardsMap(newRows));
          return newRows;
        });
        return;
      }
      setRows((prevRows) => {
        const newRows = prevRows.map((row, rowIndex) => {
          if (row.id !== rowId) return row;

          // Get the max height of existing cards in the row
          const maxHeight = row.cards.reduce(
            (max, card) => Math.max(max, card.layoutJson.height),
            0,
          );

          // Calculate remaining width for existing cards
          const remainingWidth = 100 - newCard.layoutJson.widthPercentage;

          // If there's only one card, give it the remaining width
          if (row.cards.length === 1) {
            const updatedCards = [
              {
                ...row.cards[0],
                layoutJson: {
                  ...row.cards[0].layoutJson,
                  widthPercentage: remainingWidth,
                  col: 0,
                },
              },
              {
                ...newCard,
                layoutJson: {
                  ...newCard.layoutJson,
                  height: maxHeight || newCard.layoutJson.height,
                  col: 1,
                  row: rowIndex,
                },
              },
            ];

            return {
              ...row,
              cards: updatedCards,
            };
          }

          // For multiple cards, maintain their ratios
          const totalCurrentWidth = row.cards.reduce(
            (sum, card) => sum + card.layoutJson.widthPercentage,
            0,
          );

          // Update existing cards and add new card
          const updatedCards = [
            ...row.cards.map((card, index) => ({
              ...card,
              layoutJson: {
                ...card.layoutJson,
                widthPercentage:
                  (card.layoutJson.widthPercentage / totalCurrentWidth) *
                  remainingWidth,
                col: index,
              },
            })),
            {
              ...newCard,
              layoutJson: {
                ...newCard.layoutJson,
                height: maxHeight || newCard.layoutJson.height,
                col: row.cards.length,
                row: rowIndex,
              },
            },
          ];

          return {
            ...row,
            cards: updatedCards,
          };
        });

        // Update rows and trigger layout change
        updateRows(newRows);
        return newRows;
      });
    },
    [updateRows],
  );

  /**
   * Deletes a card from a row.
   * Handles row removal if empty and recalculates layouts.
   *
   * @param cardId - ID of the card to delete
   * @param rowId - ID of the row containing the card
   */
  const deleteCard: DynamicBoardContextType<Content>["deleteCard"] =
    useCallback(
      (cardId, rowId) => {
        setRows((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row.id === rowId);
          if (rowIndex === -1) return prevRows;

          const row = prevRows[rowIndex];
          const remainingCards = row.cards.filter((c) => c.id !== cardId);

          // If no cards left in the row, remove the row and update indices of rows below
          if (remainingCards.length === 0) {
            const newRows = prevRows
              .filter((r) => r.id !== rowId)
              .map((r, index) => ({
                ...r,
                id: `row-${index + 1}`,
                cards: r.cards.map((c) => ({
                  ...c,
                  layoutJson: {
                    ...c.layoutJson,
                    row: index,
                  },
                })),
              }));

            updateRows(newRows);
            return newRows;
          }

          // Get the max height of remaining cards
          const maxHeight = remainingCards.reduce(
            (max, card) => Math.max(max, card.layoutJson.height),
            0,
          );

          // Recalculate widths of remaining cards and update their heights
          const updatedCards = calculateCardWidths(remainingCards).map(
            (c, index) => ({
              ...c,
              layoutJson: {
                ...c.layoutJson,
                height: maxHeight,
                col: index,
              },
            }),
          );

          const newRows = [...prevRows];
          newRows[rowIndex] = {
            ...row,
            cards: updatedCards,
          };

          updateRows(newRows);
          return newRows;
        });
      },
      [calculateCardWidths, updateRows],
    );

  /**
   * Handles the start of a row resize operation.
   * Stores initial dimensions for the row resize.
   *
   * @param rowId - ID of the row being resized
   * @param e - Mouse event containing position information
   */
  const handleRowResizeStart: DynamicBoardContextType<Content>["handleRowResizeStart"] =
    useCallback(
      (rowId, e) => {
        const row = rows.find((r) => r.id === rowId);
        if (!row) return;

        const rowHeight = row.cards.reduce(
          (acc, card) => Math.max(acc, card.layoutJson.height),
          0,
        );

        setRowResizing({
          rowId,
          startY: e.clientY,
          startHeight: rowHeight,
        });
      },
      [rows],
    );

  const handleRowResizeMove = useCallback(
    (e: { clientY: number }) => {
      if (!rowResizing) return;

      // Use local state update without triggering callbacks
      setRows((prevRows) => {
        const newRows = prevRows.map((row) => {
          if (row.id !== rowResizing.rowId) return row;

          const deltaY = e.clientY - rowResizing.startY;
          const newHeight = Math.min(
            _finalBoardConfig.maxHeight,
            Math.max(
              _finalBoardConfig.minHeight,
              rowResizing.startHeight + deltaY,
            ),
          );

          // Update all cards in the row to have the same height
          const updatedCards = row.cards.map((card) => ({
            ...card,
            layoutJson: {
              ...card.layoutJson,
              height: newHeight,
            },
          }));

          return {
            ...row,
            cards: updatedCards,
          };
        });

        // Update cardsMap without triggering callbacks
        setCardsMap(createDynamicBoardCardsMap(newRows));
        return newRows;
      });
    },
    [rowResizing, _finalBoardConfig.minHeight, _finalBoardConfig.maxHeight],
  );

  const handleRowResizeEnd = useCallback(() => {
    if (rowResizing) {
      const row = rows.find((r) => r.id === rowResizing.rowId);
      if (row) {
        // Check if any card's height actually changed
        const hasHeightChanged = row.cards.some(
          (card) => card.layoutJson.height !== rowResizing.startHeight,
        );

        if (hasHeightChanged) {
          // Get all cards that had their height updated
          const updatedCards = row.cards.map((card) => ({
            ...card,
            layoutJson: {
              ...card.layoutJson,
              height: row.cards[0].layoutJson.height, // All cards in row have same height
            },
          }));

          // Trigger callback with updated row and cards
          onLayoutChange?.({
            updatedRows: [
              {
                ...row,
                cards: updatedCards,
              },
            ],
            updatedCards,
          });
        }
      }
    }
    setRowResizing(null);
  }, [rows, rowResizing, onLayoutChange]);

  useEffect(() => {
    if (rowResizing) {
      window.addEventListener("mousemove", handleRowResizeMove);
      window.addEventListener("mouseup", handleRowResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleRowResizeMove);
        window.removeEventListener("mouseup", handleRowResizeEnd);
      };
    }
  }, [rowResizing, handleRowResizeMove, handleRowResizeEnd]);

  /**
   * Updates an existing card's properties.
   * Preserves layout information while updating card content.
   *
   * @param cardId - ID of the card to update
   * @param updatedCard - New card data
   */
  const updateCard: DynamicBoardContextType<Content>["updateCard"] =
    useCallback(
      (cardId, updatedCard) => {
        setRows((prevRows) => {
          const newRows = prevRows.map((row, rowIndex) => {
            const cardIndex = row.cards.findIndex((c) => c.id === cardId);
            if (cardIndex === -1) return row;

            const newCards = [...row.cards];
            newCards[cardIndex] = {
              ...updatedCard,
              layoutJson: {
                ...updatedCard.layoutJson,
                row: rowIndex,
                col: cardIndex,
              },
            };

            return {
              ...row,
              cards: newCards,
            };
          });

          // Update rows and trigger layout change
          updateRows(newRows);
          return newRows;
        });
      },
      [updateRows],
    );

  // Load initial data and perform layout correction if enabled
  useEffect(() => {
    if (initialCards) {
      const initialRows = buildDynamicBoardRowsFromCards(initialCards);
      const initialCardsMap = createDynamicBoardCardsMap(initialRows);

      setRows(initialRows);
      setCardsMap(initialCardsMap);

      // Check if any cards have been updated after layout correction
      if (_finalBoardConfig.enableLayoutCorrection) {
        const changes = dynamicBoardDiffImproperLayout(
          initialCards,
          initialCardsMap,
        );
        if (changes.length > 0) {
          console.warn("Layout correction was performed");
          onLayoutChange?.({
            updatedRows: initialRows,
            updatedCards: changes,
          });
        }
      }
    }
  }, [initialCards, _finalBoardConfig.enableLayoutCorrection, onLayoutChange]);

  const value: DynamicBoardContextType<Content> = {
    boardConfig: _finalBoardConfig,
    rows,
    cardResizing,
    rowResizing,
    rowDropIndicator,
    loadBoardCards,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    handleRowResizeStart,
    handleRowResizeMove,
    handleRowResizeEnd,
    moveCard,
    findCard,
    deleteCard,
    addCard,
    updateCard,
    onLayoutChange,
  };

  return (
    <DynamicBoardContext.Provider
      value={value as DynamicBoardContextType<unknown>}
    >
      {children}
    </DynamicBoardContext.Provider>
  );
}
