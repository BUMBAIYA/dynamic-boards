import type { DynamicBoardCard } from "@/core/context/dynamic-board-context";
import { generateRandomId } from "@/core/utils/generateRandomId";
import type { MockCardContent } from "@/types";

export const MOCK_CARD_DATA: DynamicBoardCard<MockCardContent>[] = [
  {
    id: generateRandomId(),
    layoutJson: {
      row: 0,
      col: 0,
      widthPercentage: 50,
      height: 300,
    },
    title: "Card 1",
    description: "Description 1",
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 0,
      col: 1,
      widthPercentage: 50,
      height: 300,
    },
    title: "Card 2",
    description: "Description 2",
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 1,
      col: 0,
      widthPercentage: 30,
      height: 300,
    },
    title: "Card 3",
    description: "Description 3",
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 1,
      col: 1,
      widthPercentage: 30,
      height: 300,
    },
    title: "Card 4",
    description: "Description 4",
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 1,
      col: 2,
      widthPercentage: 40,
      height: 300,
    },
    title: "Card 5",
    description: "Description 5",
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 2,
      col: 0,
      widthPercentage: 50,
      height: 300,
    },
    title: "Card 6",
    description: "Description 6",
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 2,
      col: 1,
      widthPercentage: 50,
      height: 300,
    },
    title: "Card 7",
    description: "Description 7",
  },
];
