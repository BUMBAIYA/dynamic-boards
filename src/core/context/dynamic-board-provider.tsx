import { useState } from "react";

import { INITIAL_DND_DATA } from "@/core/data/initial-data";
import { DynamicBoardContext } from "@/core/context/dynamic-board-context";
import type { DynamicBoardDNDCard } from "@/core/types";

export function DynamicBoardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cards] = useState<DynamicBoardDNDCard[]>(INITIAL_DND_DATA);

  return (
    <DynamicBoardContext.Provider value={{ cards: cards }}>
      {children}
    </DynamicBoardContext.Provider>
  );
}
