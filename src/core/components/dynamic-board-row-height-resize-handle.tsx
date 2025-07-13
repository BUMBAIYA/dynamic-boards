import { type JSX } from "react";

import { useDynamicBoardRowHeightResize } from "@/core/hooks/useDynamicBoardRowHeightResize";
import type { DynamicBoardRowId } from "@/core/context/dynamic-board-context";

export interface DynamicBoardRowHeightResizeHandleProps {
  rowId: DynamicBoardRowId;
}

/**
 * A draggable handle component that allows users to resize rows in a drag-and-drop board.
 * This component creates a visual handle that users can drag to adjust the height of a row.
 * It integrates with the pragmatic-dnd system to handle drag events and row resizing.
 *
 * @component
 * @param {DynamicBoardRowHeightResizeHandleProps} props - The component props
 * @returns {JSX.Element} A draggable resize handle element
 *
 * @example
 * ```tsx
 * <DynamicBoardRowHeightResizeHandle rowId={rowId} />
 * ```
 */
export function DynamicBoardRowHeightResizeHandle({
  rowId,
}: DynamicBoardRowHeightResizeHandleProps): JSX.Element {
  const { state, handleRef } = useDynamicBoardRowHeightResize({ rowId });

  return (
    <div
      ref={handleRef}
      className={`group relative flex h-1 w-full cursor-ns-resize justify-center ${
        state.type === "dragging" ? "pointer-events-none" : ""
      }`}
    >
      <div
        data-dragging={state.type === "dragging"}
        className="group-hover:bg-primary data-[dragging='true']:bg-primary h-1 w-full rounded-full transition-all duration-150"
      />
    </div>
  );
}
