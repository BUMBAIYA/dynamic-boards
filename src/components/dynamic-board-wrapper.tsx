import { DynamicBoardProvider } from "@/core/context/dynamic-board-provider";
import { DynamicBoard } from "@/components/dynamic-board";

export function DynamicBoardWrapper() {
  return (
    <DynamicBoardProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex min-h-10 items-center border-b border-gray-200 px-4">
          <h1 className="font-medium">Dynamic Boards</h1>
        </div>
        <DynamicBoard />
      </div>
    </DynamicBoardProvider>
  );
}
