import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type JSX,
} from "react";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import type { DynamicBoardRowId } from "@/core/context/dynamic-board-context";

/**
 * Represents the state of the resize handle component.
 */
type DynamicBoardCardResizeHandleState = {
  type: "idle" | "dragging";
};

/**
 * Props for the DynamicBoardCardResizeHandle component.
 * @interface DynamicBoardCardResizeHandleProps
 * @extends {Omit<HTMLAttributes<HTMLDivElement>, 'ref' | 'style'>}
 * @property {string} rowId - The unique identifier of the row containing the card
 * @property {number} cardIndex - The index of the card in the row
 * @property {number} height - The height of the resize handle in pixels
 */

export interface DynamicBoardCardResizeHandleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "ref" | "style"> {
  rowId: DynamicBoardRowId;
  cardIndex: number;
  height: number;
}

/**
 * A draggable resize handle component for adjusting the width of cards in a row.
 * This component provides a visual indicator and interaction point for resizing cards
 * using drag and drop functionality from @atlaskit/pragmatic-drag-and-drop.
 *
 * @component
 * @param {DynamicBoardCardResizeHandleProps} props - The component props
 * @returns {React.JSX.Element} A draggable resize handle element
 *
 * @example
 * ```tsx
 * <DynamicBoardCardResizeHandle
 *   rowId="row-1"
 *   cardIndex={0}
 *   height={100}
 * />
 * ```
 */
export function DynamicBoardCardResizeHandle({
  rowId,
  cardIndex,
  height,
  ...props
}: DynamicBoardCardResizeHandleProps): JSX.Element {
  const { handleResizeStart, handleResizeMove, handleResizeEnd } =
    useDynamicBoard();
  const [state, setState] = useState<DynamicBoardCardResizeHandleState>({
    type: "idle",
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
        setState({ type: "dragging" });
        const { clientX, clientY } = location.current.input;
        handleResizeStart(rowId, cardIndex, { clientX, clientY });
      },
      onDrag: ({ location }) => {
        const { clientX, clientY } = location.current.input;
        handleResizeMove({ clientX, clientY });
      },
      onDrop: () => {
        preventUnhandled.stop();
        setState({ type: "idle" });
        handleResizeEnd();
      },
    });
  }, [rowId, cardIndex, handleResizeStart, handleResizeMove, handleResizeEnd]);

  return (
    <div
      ref={dividerRef}
      className={`group relative -mx-2 flex w-4 cursor-ew-resize justify-center ${
        state.type === "dragging" ? "pointer-events-none" : ""
      }`}
      style={{ height: `${height}px` }}
      {...props}
    >
      <div
        data-dragging={state.type === "dragging"}
        className="group-hover:bg-primary data-[dragging='true']:bg-primary h-full w-0 rounded-full transition-all duration-150 group-hover:w-1 data-[dragging='true']:w-1"
      />
    </div>
  );
}
