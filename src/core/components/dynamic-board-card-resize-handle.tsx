import { type HTMLAttributes, type JSX } from "react";

import { useDynamicBoardCardResize } from "@/core/hooks/useDynamicBoardCardResize";
import type { DynamicBoardRowId } from "@/core/context/dynamic-board-context";

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
  const { state, dividerRef } = useDynamicBoardCardResize({
    rowId,
    cardIndex,
  });

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
