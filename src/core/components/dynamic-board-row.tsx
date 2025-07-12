import { useEffect, useMemo, useRef, useState } from "react";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import type {
  DynamicBoardDragData,
  DynamicBoardRow,
  DynamicBoardRowId,
} from "@/core/context/dynamic-board-context";

/**
 * Props interface for the DynamicBoardRow component
 * @template CardContent - The type of content that can be stored in the cards of this row
 */
export interface DynamicBoardRowProps<CardContentGeneric> {
  /** The row data containing cards and metadata */
  row: DynamicBoardRow<CardContentGeneric>;
  /** Render prop function that receives row data and returns React nodes */
  children: (props: {
    rowId: DynamicBoardRowId;
    row: DynamicBoardRow<CardContentGeneric>;
    rowHeight: number;
    isDraggingOver: boolean;
    rowRef: React.RefObject<HTMLDivElement | null>;
  }) => React.ReactNode;
}

/**
 * A draggable and droppable row component for the dynamic board.
 * This component handles the drag and drop interactions for cards within a row,
 * including visual feedback during drag operations and card reordering.
 *
 * @template CardContent - The type of content that can be stored in the cards of this row
 * @param props - The component props
 * @param props.row - The row data containing cards and metadata
 * @param props.children - Render prop function that receives row data and returns React nodes
 * @returns The rendered row component
 *
 * @example
 * ```tsx
 * <DynamicBoardRow key={row.id} row={row}>
 *   {({ rowId, row, rowHeight, isDraggingOver, rowRef }) => (
 *       <YourRowImplementation />
 *   )}
 * </DynamicBoardRow>
 * ```
 */
export function DynamicBoardRow<CardContentGeneric>({
  row,
  children,
}: DynamicBoardRowProps<CardContentGeneric>) {
  const ref = useRef<HTMLDivElement>(null);
  const { moveCard } = useDynamicBoard<CardContentGeneric>();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    if (ref.current) {
      row.elementRef = ref;
    }
  }, [row]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      getData: () => ({
        id: row.id,
        type: "row",
      }),
      getIsSticky: () => true,
      onDrag: ({ source, location }) => {
        if (source.data.type === "card") {
          const rect = element.getBoundingClientRect();
          const clientY = location.current.input.clientY;
          const isOver = clientY >= rect.top && clientY <= rect.bottom;

          setIsDraggingOver(isOver);
          element.style.backgroundColor = isOver ? "rgb(243 244 246)" : "";
        }
      },
      onDragLeave: () => {
        setIsDraggingOver(false);
        element.style.backgroundColor = "";
      },
      onDrop: ({ source, location }) => {
        setIsDraggingOver(false);
        element.style.backgroundColor = "";
        if (source.data.type === "card") {
          const dragData = source.data as unknown as DynamicBoardDragData;
          if (dragData.rowId !== row.id) {
            const rect = element.getBoundingClientRect();
            const mouseX = location.current.input.clientX;
            const relativeX = ((mouseX - rect.left) / rect.width) * 100;

            // Calculate the position based on the mouse X position
            const positions = [0];
            let currentX = 0;
            for (const card of row.cards) {
              currentX += card.layoutJson.widthPercentage;
              positions.push(currentX);
            }

            const closest = positions.reduce((closest, pos) => {
              return Math.abs(pos - relativeX) < Math.abs(closest - relativeX)
                ? pos
                : closest;
            });

            const insertIndex = positions.findIndex((pos) => pos === closest);
            if (insertIndex !== -1) {
              moveCard(dragData.id, dragData.rowId, row.id, insertIndex);
            }
          }
        }
      },
    });
  }, [row.id, moveCard, row.cards]);

  const maxRowHeight = useMemo(() => {
    return Math.max(...row.cards.map((card) => card.layoutJson.height));
  }, [row.cards]);

  if (!children) {
    throw new Error("DynamicBoardRow should have a children");
  }

  return children({
    rowId: row.id,
    row,
    rowHeight: maxRowHeight,
    isDraggingOver,
    rowRef: ref,
  });
}
