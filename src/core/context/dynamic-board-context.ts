import { createContext } from "react";

import type { DynamicBoardDNDCard, DynamicBoardDNDRow } from "@/core/types";

export type DynamicBoardContextType = {
  cards: DynamicBoardDNDCard[];
  rows: DynamicBoardDNDRow[];
};

export const DynamicBoardContext =
  createContext<DynamicBoardContextType | null>(null);
