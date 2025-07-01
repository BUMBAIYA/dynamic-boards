import { generateRandomId } from "@/core/utils/generateRandomId";
import type { DynamicBoardDNDCard } from "@/core/types";

export const MOCK_CARD_DATA: DynamicBoardDNDCard[] = [
  {
    id: generateRandomId(),
    layout: {
      row: 0,
      col: 0,
    },
    title: "Card 1",
  },
  {
    id: generateRandomId(),
    layout: {
      row: 0,
      col: 1,
    },
    title: "Card 2",
  },
  {
    id: generateRandomId(),
    layout: {
      row: 0,
      col: 2,
    },
    title: "Card 3",
  },
  {
    id: generateRandomId(),
    layout: {
      row: 1,
      col: 0,
    },
    title: "Card 4",
  },
  {
    id: generateRandomId(),
    layout: {
      row: 1,
      col: 1,
    },
    title: "Card 5",
  },
];
