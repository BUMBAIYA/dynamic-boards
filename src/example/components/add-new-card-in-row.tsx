import { PlusIcon } from "lucide-react";

import { useExampleBoard } from "@/example/context/useExampleBoard";

export interface AddNewCardInRowProps {
  rowId: string;
  row: number;
  col: number;
  widthPercentage: number;
  rowHeight: number;
}

export function AddNewCardInRow({
  rowId,
  row,
  col,
  widthPercentage,
  rowHeight,
}: AddNewCardInRowProps) {
  const { setShowOpenEditModal } = useExampleBoard();

  return (
    <div className="w-6 py-2">
      <button
        title="Add New Card"
        className="hover:bg-primary-light hover:text-primary flex h-full w-full cursor-pointer items-center justify-center rounded-md transition-colors"
        onClick={() =>
          setShowOpenEditModal({
            mode: "add",
            data: {
              rowId: rowId,
              layoutJson: {
                row,
                col,
                widthPercentage,
                height: rowHeight,
              },
            },
          })
        }
      >
        <PlusIcon className="size-4" />
        <span className="sr-only">Add Card</span>
      </button>
    </div>
  );
}
