import { useContext } from "react";

import {
  ExampleBoardContext,
  type ExampleBoardContextType,
} from "@/example/context/example-board-context";

/**
 * Custom hook to access the ExampleBoardContext
 * @returns {ExampleBoardContextType} The context value
 * @throws {Error} If the context is not found
 */
export function useExampleBoard(): ExampleBoardContextType {
  const context = useContext(
    ExampleBoardContext,
  ) as ExampleBoardContextType | null;
  if (!context) {
    throw new Error(
      "`useExampleBoard` must be used within a `ExampleBoardProvider`",
    );
  }
  return context;
}
