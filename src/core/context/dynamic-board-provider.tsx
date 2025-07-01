import { useState } from "react";

import { INITIAL_DND_DATA } from "@/core/data/initial-data";
import { DynamicBoardContext } from "@/core/context/dynamic-board-context";
import { buildDynamicBoardGrid } from "@/core/utils/buildDynamicBoardGrid";
import type { DynamicBoardDNDCard } from "@/core/types";

export function DynamicBoardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cards] = useState<DynamicBoardDNDCard[]>(INITIAL_DND_DATA);
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
