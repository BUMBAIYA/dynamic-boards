import type { DynamicBoardDNDCard } from "@/core/types";

export interface DynamicBoardCardProps {
  card: DynamicBoardDNDCard;
}

export function DynamicBoardCard({ card }: DynamicBoardCardProps) {
  return (
    <div className="flex min-h-60 flex-1 flex-col rounded-lg border border-gray-200 p-3">
      <div className="flex flex-col">{card.title}</div>
      <p>{JSON.stringify(card)}</p>
    </div>
  );
}
