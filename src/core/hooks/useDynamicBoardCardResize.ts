import { useEffect, useRef, useState } from "react";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import type { DynamicBoardRowId } from "@/core/context/dynamic-board-context";

/**
 * Represents the state of the resize handle component.
 */
type DynamicBoardCardResizeState = {
  type: "idle" | "dragging";
  clientX: number | null;
  clientY: number | null;
};

/**
 * Props for the useDynamicBoardCardResize hook.
 * @interface UseDynamicBoardCardResizeProps
 * @property {string} rowId - The unique identifier of the row containing the card
 * @property {number} cardIndex - The index of the card in the row
 */
export interface UseDynamicBoardCardResizeProps {
  rowId: DynamicBoardRowId;
  cardIndex: number;
}

export interface UseDynamicBoardCardResizeReturn {
  state: DynamicBoardCardResizeState;
  dividerRef: React.RefObject<HTMLDivElement> | null;
}

/**
 * Custom hook to handle card resizing in a dynamic board.
 * User can use this hook to create custom resize handle for card width.
 *
 * @param {UseDynamicBoardCardResizeProps} props - The hook props
 * @returns {DynamicBoardCardResizeState} The current state of the resize handle
 * @returns {UseDynamicBoardCardResizeReturn} A ref to the resize handle element
 */
export function useDynamicBoardCardResize({
  rowId,
  cardIndex,
}: UseDynamicBoardCardResizeProps): UseDynamicBoardCardResizeReturn {
  const { handleResizeStart, handleResizeMove, handleResizeEnd } =
    useDynamicBoard();
  const [state, setState] = useState<DynamicBoardCardResizeState>({
    type: "idle",
    clientX: null,
    clientY: null,
  });
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divider = dividerRef.current;
    if (!divider) return;

    return draggable({
      element: divider,
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        // Disable native drag preview since we'll handle the visual feedback ourselves
        disableNativeDragPreview({ nativeSetDragImage });
        // Prevent unhandled drop animation
        preventUnhandled.start();
      },
      onDragStart: ({ location }) => {
        const { clientX, clientY } = location.current.input;
        setState({ type: "dragging", clientX, clientY });
        handleResizeStart(rowId, cardIndex, { clientX, clientY });
      },
      onDrag: ({ location }) => {
        const { clientX, clientY } = location.current.input;
        setState({ type: "dragging", clientX, clientY });
        handleResizeMove({ clientX, clientY });
      },
      onDrop: () => {
        preventUnhandled.stop();
        setState({ type: "idle", clientX: null, clientY: null });
        handleResizeEnd();
      },
    });
  }, [rowId, cardIndex, handleResizeStart, handleResizeMove, handleResizeEnd]);

  return { state, dividerRef: dividerRef as React.RefObject<HTMLDivElement> };
}
