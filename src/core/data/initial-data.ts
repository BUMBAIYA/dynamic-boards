import { nanoid } from "nanoid";

import type { DynamicBoardDNDCard } from "@/core/types";

export const INITIAL_DND_DATA: DynamicBoardDNDCard[] = [
  {
    id: nanoid(),
    layout: {
      row: 0,
      col: 0,
    },
    title: "Card 1",
  },
  {
    id: nanoid(),
    layout: {
      row: 0,
      col: 1,
    },
    title: "Card 2",
  },
  {
    id: nanoid(),
    layout: {
      row: 0,
      col: 2,
    },
    title: "Card 3",
  },
  {
    id: nanoid(),
    layout: {
      row: 1,
      col: 0,
    },
    title: "Card 4",
  },
  {
    id: nanoid(),
    layout: {
      row: 1,
      col: 1,
    },
    title: "Card 5",
  },
];
