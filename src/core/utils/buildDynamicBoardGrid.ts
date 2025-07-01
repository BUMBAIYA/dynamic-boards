import type { DynamicBoardDNDCard } from "@/core/types";

export function buildDynamicBoardGrid(
  cards: DynamicBoardDNDCard[],
): DynamicBoardDNDCard[][] {
  const rowMap = new Map<number, DynamicBoardDNDCard[]>();

  cards.forEach((card) => {
    const row = card.layout.row;
    if (!rowMap.has(row)) {
      rowMap.set(row, []);
    }
    rowMap.get(row)!.push(card);
  });

  return Array.from(rowMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([rowIndex, rowCards]) => {
      const sortedCards = rowCards.sort((a, b) => a.layout.col - b.layout.col);

      const normalizedRowCards = sortedCards.map((card, colIndex) => ({
        ...card,
        layout: {
          ...card.layout,
          row: rowIndex,
          col: colIndex,
        },
      }));

      return normalizedRowCards;
    });
}
