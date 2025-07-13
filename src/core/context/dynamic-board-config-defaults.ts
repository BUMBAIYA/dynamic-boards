/**
 * Default configuration for the dashboard layout.
 * These values are used when no boardConfig prop is provided.
 *
 * @AmitChauhan
 * TODO: Implement disableDrag, disableResizeCardWidth, disableResizeRowHeight, disableAddCard and disableCardDropInBetweenRows in the provider for now we can use them conditionally in components
 *
 * @property {number} maxCardsPerRow - Maximum number of cards allowed in a single row
 * @property {number} minHeight - Minimum height (in pixels) for cards and rows
 * @property {number} maxHeight - Maximum height (in pixels) for cards and rows
 * @property {boolean} disableDrag - Disable dragging of cards
 * @property {boolean} disableResizeCardWidth - Disable resizing of card width
 * @property {boolean} disableResizeRowHeight - Disable resizing of row height
 * @property {boolean} disableAddCard - Disable adding new cards
 * @property {boolean} disableCardDropInBetweenRows - Disable dropping cards in between rows
 * @property {boolean} enableLayoutCorrection - Enable layout correction
 */
export const DEFAULT_BOARD_CONFIG = {
  maxCardsPerRow: 3,
  minHeight: 250,
  maxHeight: 600,
  disableDrag: false,
  disableResizeCardWidth: false,
  disableResizeRowHeight: false,
  disableAddCard: false,
  disableCardDropInBetweenRows: true,
  enableLayoutCorrection: true,
};
