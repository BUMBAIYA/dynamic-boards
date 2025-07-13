import { Fragment, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";

import type {
  DynamicBoardCard,
  DynamicBoardRowId,
} from "@/core/context/dynamic-board-context";

/**
 * Props for the children render function of DynamicBoardCard
 * @template CardContent - The type of content stored in the card
 */
export type DynamicBoardCardChildrenProps<CardContent> = {
  /** The card data object */
  card: DynamicBoardCard<CardContent>;
  /** The ID of the row this card belongs to */
  rowId: DynamicBoardRowId;
  /** The dimensions of the card content area */
  dimensions: { width: number; height: number };
  /** Reference to the drag handle element */
  dragHandleRef: React.RefObject<HTMLDivElement | null> | null;
};

/**
 * Props for the DynamicBoardCard
 * @template CardContent - The type of content stored in the card
 */
export interface DynamicBoardCardProps<CardContent> {
  /** The card data object */
  card: DynamicBoardCard<CardContent>;
  /** The ID of the row this card belongs to */
  rowId: DynamicBoardRowId;
  /** Render function that receives card props and returns React node */
  children: (
    props: DynamicBoardCardChildrenProps<CardContent>,
  ) => React.ReactNode;
  /** Horizontal padding for the card (default: 0) */
  paddingX?: number;
  /** Vertical padding for the card (default: 0) */
  paddingY?: number;
}

/**
 * A draggable card component that supports drag and drop functionality.
 * This component does not have any styles related to the card, it only handles the drag and drop interactions.
 * The card content is rendered by the children function.
 * This component handles the drag and drop interactions for individual cards,
 * including drag previews, drop targets, and edge detection for card reordering.
 *
 * Features:
 * - Drag and drop functionality with custom preview
 * - Edge detection for card reordering
 * - Responsive dimensions based on container size
 * - Customizable padding
 *
 * @template CardContent - The type of content stored in the card
 * @param props - The component props
 * @returns A React component that renders a draggable card
 *
 * @example
 * ```tsx
 * <DynamicBoardCard
 *   card={myCard}
 *   rowId="row-1"
 *   paddingX={8}
 *   paddingY={8}
 * >
 *   {({ card, dimensions, dragHandleRef }) => (
 *       // Your card implementation here
 *   )}
 * </DynamicBoardCard>
 * ```
 */
export function DynamicBoardCard<CardContent>({
  card,
  rowId,
  children,
  paddingX = 0,
  paddingY = 0,
}: DynamicBoardCardProps<CardContent>) {
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<"idle" | "dragging" | "preview">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<{ container: HTMLElement; rect: DOMRect } | null>(
    null,
  );
  const [contentDimensions, setContentDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Calculate content dimensions when container width changes
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      const containerWidth = element.offsetWidth;
      const containerHeight = element.offsetHeight;
      setContentDimensions({
        width: containerWidth,
        height: containerHeight,
      });
    };

    // Initial calculation
    updateWidth();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    // Handle window resize
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    const dragHandleElement = dragHandleRef.current;
    if (!element || !dragHandleElement) return;

    return combine(
      draggable({
        element: dragHandleElement,
        getInitialData: () => ({
          id: card.id,
          rowId: rowId,
          type: "card",
        }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();
          setState("preview");
          previewRef.current = { container: document.body, rect };

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: dragHandleElement,
              input: location.current.input,
            }),
            render({ container }) {
              previewRef.current = { container, rect };
              return () => setState("dragging");
            },
          });
        },
        onDragStart: () => setState("dragging"),
        onDrop: () => setState("idle"),
      }),
      dropTargetForElements({
        element,
        getData: ({ input, element }) => {
          const data = { id: card.id };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          if (
            args.source.data.type === "card" &&
            args.source.data.id !== card.id
          ) {
            const edge = extractClosestEdge(args.self.data);
            setClosestEdge(edge);
          }
        },
        onDrag: (args) => {
          if (
            args.source.data.type === "card" &&
            args.source.data.id !== card.id
          ) {
            const edge = extractClosestEdge(args.self.data);
            setClosestEdge(edge);
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      }),
    );
  }, [card.id, rowId]);

  if (!children) {
    throw new Error("DynamicBoardCard component must have a children");
  }

  return (
    <Fragment>
      <div
        ref={ref}
        className="relative"
        style={{
          width: `${card.layoutJson.widthPercentage}%`,
          height: `${card.layoutJson.height}px`,
          padding: `${paddingY}px ${paddingX}px`,
        }}
      >
        {children({
          card,
          rowId,
          dimensions: {
            width: contentDimensions.width - paddingX * 2,
            height: contentDimensions.height - paddingY * 2,
          },
          dragHandleRef,
        })}
        {closestEdge && (
          <div
            className="bg-primary absolute top-0 bottom-0 w-1 rounded-full transition-all duration-150"
            style={{
              left: closestEdge === "left" ? "0px" : "calc(100% + 2px)",
              transform: "translateX(-50%)",
              zIndex: 20,
            }}
          />
        )}
      </div>
      {state === "preview" &&
        previewRef.current &&
        createPortal(
          <div
            style={{
              // width: previewRef.current.rect.width,
              // height: previewRef.current.rect.height,
              width: contentDimensions.width,
              height: contentDimensions.height,
              pointerEvents: "none",
            }}
          >
            {children({
              card,
              rowId,
              dimensions: {
                width: contentDimensions.width - paddingX * 2,
                height: contentDimensions.height - paddingY * 2,
              },
              dragHandleRef,
            })}
          </div>,
          previewRef.current.container,
        )}
    </Fragment>
  );
}
