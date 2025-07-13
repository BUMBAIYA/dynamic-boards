import type { DynamicBoardCardChildrenProps } from "@/core/components/dynamic-board-card";
import type { MockCardContent } from "@/types";

export type CardImplementationProps =
  DynamicBoardCardChildrenProps<MockCardContent>;

export function ExampleCardImplementation({
  card,
  dragHandleRef,
}: CardImplementationProps) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div
        ref={dragHandleRef}
        className="min-h-10 cursor-grab border-b border-gray-200 p-3 hover:bg-gray-50 active:cursor-grabbing"
      >
        <h3 className="text-lg font-medium">{card.title}</h3>
      </div>
      <div className="flex-1 p-3">
        <p>{card.description}</p>
      </div>
    </div>
  );
}
