import { useContext } from "react";

import { DynamicBoardContext } from "@/core/context/dynamic-board-context";

export const useDynamicBoard = () => {
  const context = useContext(DynamicBoardContext);

  if (!context) {
    throw new Error(
      "useDynamicBoard must be used within a DynamicBoardProvider",
    );
  }

  return context;
};
