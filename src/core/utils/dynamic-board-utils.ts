import type {
  DynamicBoardCard,
  DynamicBoardLayoutChangeData,
  DynamicBoardRow,
  DynamicBoardCardId,
} from "@/core/context/dynamic-board-context";

/** Default height in pixels for cards in the dashboard */
export const DEFAULT_CARD_HEIGHT = 360;

/**
 * Creates a Map of cards from an array of rows for quick lookup by card ID
 * @template Content - The type of content stored in the cards
 * @param {PragmaticDndRow<CardContentGeneric>[]} rows - Array of rows containing cards
 * @returns {Map<number, PragmaticDndCard<CardContentGeneric>>} A Map where keys are card IDs and values are the corresponding cards
 */
export function createDynamicBoardCardsMap<CardContentGeneric>(
  rows: DynamicBoardRow<CardContentGeneric>[],
): Map<DynamicBoardCardId, DynamicBoardCard<CardContentGeneric>> {
  const map = new Map<
    DynamicBoardCardId,
    DynamicBoardCard<CardContentGeneric>
  >();
  rows.forEach((row) => {
    row.cards.forEach((card) => {
      map.set(card.id, card);
    });
  });
  return map;
}

/**
 * Builds an array of rows from a flat array of cards, organizing them by row and column
 * @template Content - The type of content stored in the cards
 * @param {PragmaticDndCard<Content>[]} cards - Array of cards to organize into rows
 * @returns {PragmaticDndRow<Content>[]} Array of rows containing the organized cards
 * @description
 * - Groups cards by their row number
 * - Sorts cards within each row by column
 * - Normalizes card widths if total width is not 100% (within 2% tolerance)
 * - Ensures all cards in a row have the same height
 */
export function buildDynamicBoardRowsFromCards<Content>(
  cards: DynamicBoardCard<Content>[],
): DynamicBoardRow<Content>[] {
  // Group cards by row
  const rowMap = new Map<number, DynamicBoardCard<Content>[]>();

  cards.forEach((card) => {
    const row = card.layoutJson.row;
    if (!rowMap.has(row)) {
      rowMap.set(row, []);
    }
    rowMap.get(row)!.push(card);
  });

  // Sort rows and build row objects
  return Array.from(rowMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([rowIndex, rowCards]) => {
      // Sort cards by column
      const sortedCards = rowCards.sort(
        (a, b) => a.layoutJson.col - b.layoutJson.col,
      );

      // Calculate total width of the row
      const totalWidth = sortedCards.reduce(
        (sum, card) => sum + card.layoutJson.widthPercentage,
        0,
      );

      // If total width is not 100% (within 2% tolerance), distribute width equally
      const normalizedCards =
        Math.abs(totalWidth - 100) > 2
          ? sortedCards.map((card) => ({
              ...card,
              layoutJson: {
                ...card.layoutJson,
                widthPercentage: 100 / sortedCards.length,
              },
            }))
          : sortedCards;

      // Get max height in the row or use default DEFAULT_CARD_HEIGHT
      const maxHeight = Math.max(
        DEFAULT_CARD_HEIGHT,
        ...normalizedCards.map(
          (card) => card.layoutJson.height || DEFAULT_CARD_HEIGHT,
        ),
      );

      // Ensure all cards have the same height
      const cardsWithHeight = normalizedCards.map((card, colIndex) => ({
        ...card,
        layoutJson: {
          ...card.layoutJson,
          row: rowIndex, // Update row if were using improper row index
          col: colIndex, // Update column if were using improper column index
          height: maxHeight,
        },
      }));

      return {
        id: `row-${rowIndex + 1}`,
        cards: cardsWithHeight,
      };
    });
}

/**
 * Compares two grid layouts and identifies changes in cards and rows
 * @template Content - The type of content stored in the cards
 * @param {PragmaticDndRow<CardContentGeneric>[]} oldRows - The previous state of rows
 * @param {PragmaticDndRow<CardContentGeneric>[]} newRows - The new state of rows
 * @param {Map<number, PragmaticDndCard<CardContentGeneric>>} oldCardsMap - Map of cards from the previous state
 * @returns {PragmaticDndLayoutChangeData<CardContentGeneric>} Object containing updated cards and rows
 * @description
 * Identifies:
 * - Newly added cards and rows
 * - Removed cards and rows
 * - Cards with changed layout properties (width, height, row, column)
 * - Rows containing modified cards
 */
export function dynamicBoardDiffGrids<CardContentGeneric>(
  oldRows: DynamicBoardRow<CardContentGeneric>[],
  newRows: DynamicBoardRow<CardContentGeneric>[],
  oldCardsMap: Map<DynamicBoardCardId, DynamicBoardCard<CardContentGeneric>>,
): DynamicBoardLayoutChangeData<CardContentGeneric> {
  const updatedCards: DynamicBoardCard<CardContentGeneric>[] = [];
  const updatedRows: DynamicBoardRow<CardContentGeneric>[] = [];

  // Check for row changes (added, removed, or modified)
  newRows.forEach((newRow) => {
    const oldRow = oldRows.find((r) => r.id === newRow.id);

    if (!oldRow) {
      // New row added
      updatedRows.push(newRow);
      updatedCards.push(...newRow.cards);
      return;
    }

    // Check for card changes in this row
    newRow.cards.forEach((newCard) => {
      const oldCard = oldCardsMap.get(newCard.id);

      if (!oldCard) {
        // New card added
        updatedCards.push(newCard);
        return;
      }

      // Check if card layout changed
      if (
        dynamicBoardCardLayoutHasChanged(oldCard.layoutJson, newCard.layoutJson)
      ) {
        updatedCards.push(newCard);
      }
    });

    // If any cards in this row were updated, mark the row as updated
    if (
      updatedCards.some((card) => newRow.cards.find((c) => c.id === card.id))
    ) {
      updatedRows.push(newRow);
    }
  });

  // Check for removed rows
  oldRows.forEach((oldRow) => {
    if (!newRows.find((r) => r.id === oldRow.id)) {
      updatedRows.push(oldRow);
    }
  });

  return {
    updatedRows,
    updatedCards,
  };
}

/**
 * Compares the layout of two cards and returns true if they are different
 * @template Content - The type of content stored in the cards
 * @param {DynamicBoardCard} oldCard - The previous card
 * @param {DynamicBoardCard} newCard - The new card
 * @returns {boolean} True if the layout of the cards is different, false otherwise
 */
export function dynamicBoardCardLayoutHasChanged(
  oldCard: DynamicBoardCard["layoutJson"],
  newCard: DynamicBoardCard["layoutJson"],
): boolean {
  return (
    oldCard.widthPercentage !== newCard.widthPercentage ||
    oldCard.height !== newCard.height ||
    oldCard.row !== newCard.row ||
    oldCard.col !== newCard.col
  );
}

/**
 * Compares the initial cards from backend with the updated cards from frontend after performing layout correction using a map of updated cards keyed by card id
 * @template CardContentGeneric - The type of content stored in the cards
 * @param {DynamicBoardCard<CardContentGeneric>} initialCards - The initial cards
 * @param {Map<number, DynamicBoardCard<CardContentGeneric>>} mapOfUpdatedCardAfterLayoutChange - The map of updated cards after layout correction
 * @returns {DynamicBoardCard<CardContentGeneric>[]} The cards which have been updated after layout correction
 */
export function dynamicBoardDiffImproperLayout<CardContentGeneric = unknown>(
  initialCards: DynamicBoardCard<CardContentGeneric>[],
  mapOfUpdatedCardAfterLayoutChange: Map<
    DynamicBoardCardId,
    DynamicBoardCard<CardContentGeneric>
  >,
): DynamicBoardCard<CardContentGeneric>[] {
  const cardsWithUpdatedLayout: DynamicBoardCard<CardContentGeneric>[] = [];

  initialCards.forEach((card) => {
    const cardToCheckForLayoutChange = mapOfUpdatedCardAfterLayoutChange.get(
      card.id,
    );

    // If the card is in the map of updated cards and the layout has changed, add it to the updated cards
    if (
      cardToCheckForLayoutChange &&
      dynamicBoardCardLayoutHasChanged(
        card.layoutJson,
        cardToCheckForLayoutChange.layoutJson,
      )
    ) {
      cardsWithUpdatedLayout.push(cardToCheckForLayoutChange);
    }
  });

  return cardsWithUpdatedLayout;
}
