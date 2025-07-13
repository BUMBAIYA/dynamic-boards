import { useEffect, useRef, useState } from "react";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import type { DynamicBoardRowId } from "@/core/context/dynamic-board-context";

/**
 * Represents the state of the row resize handle component.
 */
type DynamicBoardRowHeightResizeState = {
  type: "idle" | "dragging";
  clientX: number | null;
  clientY: number | null;
};

/**
 * Props for the useDynamicBoardRowHeightResize hook.
 * @interface UseDynamicBoardRowHeightResizeProps
 * @property {DynamicBoardRowId} rowId - The unique identifier of the row being resized
 */
export interface UseDynamicBoardRowHeightResizeProps {
  rowId: DynamicBoardRowId;
}

export interface UseDynamicBoardRowHeightResizeReturn {
  state: DynamicBoardRowHeightResizeState;
  handleRef: React.RefObject<HTMLDivElement> | null;
}

/**
 * Custom hook to handle row height resizing in a dynamic board.
 * User can use this hook to create custom resize handle for row height.
 *
 * @param {UseDynamicBoardRowHeightResizeProps} props - The hook props
 * @returns {DynamicBoardRowHeightResizeState} The current state of the resize handle
 * @returns {UseDynamicBoardRowHeightResizeReturn} A ref to the resize handle element
 */
export function useDynamicBoardRowHeightResize({
  rowId,
}: UseDynamicBoardRowHeightResizeProps): UseDynamicBoardRowHeightResizeReturn {
  const { handleRowResizeStart, handleRowResizeMove, handleRowResizeEnd } =
    useDynamicBoard();
  const [state, setState] = useState<DynamicBoardRowHeightResizeState>({
    type: "idle",
    clientX: null,
    clientY: null,
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
        const { clientY, clientX } = location.current.input;
        setState({ type: "dragging", clientX, clientY });
        handleRowResizeStart(rowId, { clientY, clientX });
      },
      onDrag: ({ location }) => {
        const { clientY, clientX } = location.current.input;
        setState({ type: "dragging", clientX, clientY });
        handleRowResizeMove({ clientY, clientX });
      },
      onDrop: () => {
        preventUnhandled.stop();
        setState({ type: "idle", clientX: null, clientY: null });
        handleRowResizeEnd();
      },
    });
  }, [rowId, handleRowResizeStart, handleRowResizeMove, handleRowResizeEnd]);

  return { state, handleRef: handleRef as React.RefObject<HTMLDivElement> };
}
