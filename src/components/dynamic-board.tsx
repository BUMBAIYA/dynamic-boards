import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { DynamicBoardCard } from "@/components/dynamic-board-card";

export function DynamicBoard() {
  const { cards } = useDynamicBoard();

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {cards.map((card) => (
        <DynamicBoardCard key={card.id} card={card} />
      ))}
    </div>
  );
}
