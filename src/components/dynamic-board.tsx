import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { DynamicBoardCard } from "@/components/dynamic-board-card";

export function DynamicBoard() {
  const { rows } = useDynamicBoard();

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {row.map((card) => (
            <DynamicBoardCard key={card.id} card={card} />
          ))}
        </div>
      ))}
    </div>
  );
}
