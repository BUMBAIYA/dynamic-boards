import type { DynamicBoardCardChildrenProps } from "@/core/components/dynamic-board-card";
import type { MockCardContent } from "@/example/types";

export type CardImplementationProps =
  DynamicBoardCardChildrenProps<MockCardContent>;

export function ExampleCardImplementation({
  card,
  dragHandleRef,
  dimensions,
}: CardImplementationProps) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div
        ref={dragHandleRef}
        className="min-h-10 cursor-grab border-b border-gray-200 p-3 hover:bg-gray-50 active:cursor-grabbing"
      >
        <h3 className="text-lg font-medium">{card.customCardData.title}</h3>
      </div>
      <div className="flex-1 p-3 text-xs">
        <p>Custom card data: {JSON.stringify(card.customCardData)}</p>
        <p>
          Dimensions: {dimensions?.width} x {dimensions?.height}
        </p>
      </div>
    </div>
  );
}
