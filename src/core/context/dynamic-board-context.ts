import { createContext } from "react";

export type DynamicBoardCardId = string;
export type DynamicBoardRowId = string;

export interface DynamicBoardCardLayout {
  row: number;
  col: number;
  widthPercentage: number;
  height: number;
}

export type DynamicBoardCard<CardContent = unknown> = {
  id: DynamicBoardCardId;
  layoutJson: DynamicBoardCardLayout;
} & CardContent;

export interface DynamicBoardRow<CardContent = unknown> {
  id: DynamicBoardRowId;
  cards: DynamicBoardCard<CardContent>[];
  elementRef?: React.RefObject<HTMLDivElement | null>;
}

export interface DynamicBoardDragData {
  id: DynamicBoardCardId;
  rowId: DynamicBoardRowId;
  type: "card";
}

export interface DynamicBoardConfig {
  maxCardsPerRow: number;
  minHeight?: number;
  maxHeight?: number;
  disableDrag?: boolean;
  disableResizeCardWidth?: boolean;
  disableResizeRowHeight?: boolean;
  disableAddCard?: boolean;
  disableCardDropInBetweenRows?: boolean;
  enableLayoutCorrection?: boolean;
}

export interface DynamicBoardLayoutChangeData<CardContent = unknown> {
  updatedRows: DynamicBoardRow<CardContent>[];
  updatedCards: DynamicBoardCard<CardContent>[];
}

/**
 * Represents the pointer position during resize operations.
 * @interface DynamicBoardResizePointer
 * @property {number} clientX - The horizontal position of the pointer in pixels
 * @property {number} clientY - The vertical position of the pointer in pixels
 */
export interface DynamicBoardResizePointer {
  clientX: number;
  clientY: number;
}

export interface DynamicBoardContextType<CardContent = unknown> {
  boardConfig: DynamicBoardConfig;
  rows: DynamicBoardRow<CardContent>[];
  cardResizing: {
    rowId: DynamicBoardRowId;
    cardIdx: number;
    startX: number;
    startWidth: number;
    neighborStartWidth: number;
  } | null;
  rowResizing: {
    rowId: DynamicBoardRowId;
    startY: number;
    startHeight: number;
  } | null;
  /**
   * Represents the drop indicator for a row.
   * @interface DynamicBoardRowDropIndicator
   * @property {boolean} show - Whether the drop indicator should be shown
   * @property {string} rowId - The ID of the row the indicator is for
   * @property {number} top - The top position of the indicator
   * @property {number} left - The left position of the indicator
   * @property {number} width - The width of the indicator
   */
  rowDropIndicator: {
    show: boolean;
    rowId: DynamicBoardRowId;
    top: number;
    left: number;
    width: number;
  } | null;
  /**
   * Loads a new set of cards into the dashboard.
   * Rebuilds the entire layout from the provided cards.
   *
   * @param cards - Array of cards to load into the dashboard
   */
  loadBoardCards: (cards: DynamicBoardCard<CardContent>[]) => void;
  /**
   * Handles the start of a card resize operation.
   * Stores initial dimensions and positions for the resize.
   *
   * @param rowId - ID of the row containing the card
   * @param cardIdx - Index of the card being resized
   * @param pointer - Mouse pointer information containing clientX and clientY
   */
  handleResizeStart: (
    rowId: DynamicBoardRowId,
    cardIdx: number,
    pointer: DynamicBoardResizePointer,
  ) => void;
  /**
   * Handles the movement during a card resize operation.
   * Updates card widths based on mouse movement.
   *
   * @param pointer - Mouse pointer information containing clientX and clientY
   */
  handleResizeMove: (pointer: DynamicBoardResizePointer) => void;
  /**
   * Handles the end of a card resize operation.
   * Finalizes the resize and triggers layout change notifications.
   */
  handleResizeEnd: () => void;
  /**
   * Handles the start of a row resize operation.
   * Stores initial dimensions for the row resize.
   *
   * @param rowId - ID of the row being resized
   * @param pointer - Mouse pointer information containing clientX and clientY
   */
  handleRowResizeStart: (
    rowId: DynamicBoardRowId,
    pointer: DynamicBoardResizePointer,
  ) => void;
  /**
   * Handles the movement during a row resize operation.
   * Updates row height based on mouse movement.
   *
   * @param pointer - Mouse pointer information containing clientX and clientY
   */
  handleRowResizeMove: (pointer: DynamicBoardResizePointer) => void;
  /**
   * Handles the end of a row resize operation.
   * Finalizes the resize and triggers layout change notifications.
   */
  handleRowResizeEnd: () => void;
  /**
   * Moves a card from one row to another.
   * Handles all the necessary layout adjustments and constraints.
   *
   * @param cardId - ID of the card to move
   * @param sourceRowId - ID of the source row
   * @param targetRowId - ID of the target row
   * @param position - Optional position in the target row
   */
  moveCard: (
    cardId: DynamicBoardCardId,
    sourceRowId: DynamicBoardRowId,
    targetRowId: DynamicBoardRowId,
    position?: number,
  ) => void;
  /**
   * Finds a row by its ID.
   *
   * @param rowId - ID of the row to find
   * @returns The found row or null if not found
   */
  findRow: (rowId: DynamicBoardRowId) => DynamicBoardRow<CardContent> | null;
  /**
   * Finds a card by its ID.
   *
   * @param cardId - ID of the card to find
   * @returns The found card or null if not found
   */
  findCard: (
    cardId: DynamicBoardCardId,
  ) => DynamicBoardCard<CardContent> | null;
  /**
   * Deletes a card from a row.
   * Handles row removal if empty and recalculates layouts.
   *
   * @param cardId - ID of the card to delete
   * @param rowId - ID of the row containing the card
   */
  deleteCard: (cardId: DynamicBoardCardId, rowId: DynamicBoardRowId) => void;
  /**
   * Adds a new card to a specific row.
   * Handles width calculations and layout adjustments for existing cards.
   *
   * @param rowId - ID of the row to add the card to, or null to create a new row
   * @param newCard - The new card to add
   */
  addCard: (
    rowId: DynamicBoardRowId | null,
    newCard: DynamicBoardCard<CardContent>,
  ) => void;
  /**
   * Updates an existing card's properties.
   * Preserves layout information while updating card content.
   *
   * @param cardId - ID of the card to update
   * @param updatedCard - New card data
   */
  updateCard: (
    cardId: DynamicBoardCardId,
    updatedCard: DynamicBoardCard<CardContent>,
  ) => void;
  /**
   * Callback function triggered when the layout changes.
   * Receives data about updated rows and cards.
   */
  onLayoutChange?: (data: DynamicBoardLayoutChangeData<CardContent>) => void;
}

export const DynamicBoardContext =
  createContext<DynamicBoardContextType<unknown> | null>(null);

export function createDynamicBoardContext<CardContent>() {
  return createContext<DynamicBoardContextType<CardContent> | null>(null);
}
