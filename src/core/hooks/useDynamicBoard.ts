import { useContext } from "react";

import { DynamicBoardContext } from "@/core/context/dynamic-board-provider";
import type { DynamicBoardContextType } from "@/core/context/dynamic-board-context";

/**
 * Custom hook to access the DynamicBoardContext
 * @template Content - The type of content stored in the cards
 * @returns {DynamicBoardContextType<Content>} The context value
 * @throws {Error} If the context is not found
 */
export function useDynamicBoard<
  Content = unknown,
>(): DynamicBoardContextType<Content> {
  const context = useContext(
    DynamicBoardContext,
  ) as DynamicBoardContextType<Content> | null;
  if (!context) {
    throw new Error(
      "`useDynamicBoard` must be used within a `DynamicBoardProvider`",
    );
  }
  return context;
}
