import { createContext } from "react";

import type { DynamicBoardDNDCard, DynamicBoardDNDRow } from "@/core/types";

export type DynamicBoardContextType = {
  cards: DynamicBoardDNDCard[];
  boardGrid: DynamicBoardDNDRow[];
};

export const DynamicBoardContext =
  createContext<DynamicBoardContextType | null>(null);
