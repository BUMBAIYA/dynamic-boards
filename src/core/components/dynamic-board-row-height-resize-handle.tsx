import { useEffect, useRef, useState, type JSX } from "react";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import type { DynamicBoardRowId } from "@/core/context/dynamic-board-context";

/**
 * Represents the state of the row resize handle component.
 */
type DynamicBoardRowHeightResizeHandleState = {
  type: "idle" | "dragging";
};

/**
 * Props for the DynamicBoardRowHeightResizeHandle component.
 * @interface DynamicBoardRowHeightResizeHandleProps
 * @property {DynamicBoardRowId} rowId - The unique identifier of the row being resized
 */

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
  const { handleRowResizeStart, handleRowResizeMove, handleRowResizeEnd } =
    useDynamicBoard();
  const [state, setState] = useState<DynamicBoardRowHeightResizeHandleState>({
    type: "idle",
  });
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    return draggable({
      element: handle,
      getInitialData: () => ({
        type: "row-resize",
        rowId: rowId,
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
        preventUnhandled.start();
      },
      onDragStart: ({ location }) => {
        setState({ type: "dragging" });
        const { clientY, clientX } = location.current.input;
        handleRowResizeStart(rowId, { clientY, clientX });
      },
      onDrag: ({ location }) => {
        const { clientY, clientX } = location.current.input;
        handleRowResizeMove({ clientY, clientX });
      },
      onDrop: () => {
        preventUnhandled.stop();
        setState({ type: "idle" });
        handleRowResizeEnd();
      },
    });
  }, [rowId, handleRowResizeStart, handleRowResizeMove, handleRowResizeEnd]);

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
