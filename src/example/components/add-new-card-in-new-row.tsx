import { PlusIcon } from "lucide-react";

import { useExampleBoard } from "@/example/context/useExampleBoard";

export interface AddNewCardInNewRowProps {
  row: number;
  rowHeight: number;
}

export function AddNewCardInNewRow({
  row,
  rowHeight,
}: AddNewCardInNewRowProps) {
  const { setShowOpenEditModal } = useExampleBoard();

  return (
    <button
      title="Add New Card"
      className="hover:bg-primary-light hover:text-primary flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-gray-200 transition-colors"
      onClick={() =>
        setShowOpenEditModal({
          mode: "add",
          data: {
            rowId: null,
            layoutJson: {
              row,
              col: 0,
              widthPercentage: 100,
              height: rowHeight,
            },
          },
        })
      }
    >
      <PlusIcon className="size-5" />
      <span className="sr-only">Add Card</span>
    </button>
  );
}
