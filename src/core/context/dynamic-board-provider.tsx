import { useState } from "react";

import { MOCK_CARD_DATA } from "@/core/data/mockCardData";
import { DynamicBoardContext } from "@/core/context/dynamic-board-context";
import { buildDynamicBoardGrid } from "@/core/utils/buildDynamicBoardGrid";
import type { DynamicBoardDNDCard } from "@/core/types";

export function DynamicBoardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cards] = useState<DynamicBoardDNDCard[]>(MOCK_CARD_DATA);
  const [rows] = useState(buildDynamicBoardGrid(cards));

  const value = {
    cards: cards,
    rows: rows,
  };

  return (
    <DynamicBoardContext.Provider value={value}>
      {children}
    </DynamicBoardContext.Provider>
  );
}
