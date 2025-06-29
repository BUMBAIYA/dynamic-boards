import { createContext } from "react";

import type { DynamicBoardDNDCard } from "@/core/types";

export type DynamicBoardContextType = {
  cards: DynamicBoardDNDCard[];
};

export const DynamicBoardContext =
  createContext<DynamicBoardContextType | null>(null);
