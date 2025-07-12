import { type PropsWithChildren, useEffect } from "react";

import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

/**
 * Props for the DynamicBoardWindowAutoScroll component
 * @interface DynamicBoardWindowAutoScrollProps
 * @extends {React.PropsWithChildren}
 */
export interface DynamicBoardWindowAutoScrollProps extends PropsWithChildren {
  /**
   * Controls the maximum scroll speed when auto-scrolling during drag operations
   * @property {("standard" | "fast" | undefined)} maxScrollSpeed
   * - "standard": Default scroll speed
   * - "fast": Increased scroll speed for quicker navigation
   * - undefined: Uses default scroll speed
   */
  maxScrollSpeed?: "standard" | "fast" | undefined;
}

/**
 * A wrapper component that enables automatic window scrolling during drag and drop operations.
 * This component is particularly useful when dragging items near the edges of a scrollable container,
 * as it automatically scrolls the window to reveal more content.
 *
 * @component
 * @param {DynamicBoardWindowAutoScrollProps} props - The component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @param {("standard" | "fast" | undefined)} [props.maxScrollSpeed] - Optional scroll speed configuration
 *
 * @example
 * ```tsx
 * <DynamicBoardWindowAutoScroll maxScrollSpeed="fast">
 *   <YourDraggableContent />
 * </DynamicBoardWindowAutoScroll>
 * ```
 */
export function DynamicBoardWindowAutoScroll({
  children,
  maxScrollSpeed,
}: DynamicBoardWindowAutoScrollProps) {
  useEffect(() => {
    return autoScrollWindowForElements({
      getConfiguration() {
        return {
          enabled: true,
          maxScrollSpeed: maxScrollSpeed,
        };
      },
    });
  }, [maxScrollSpeed]);

  if (!children) {
    throw new Error("DynamicBoardWindowAutoScroll must have children");
  }

  return children;
}
