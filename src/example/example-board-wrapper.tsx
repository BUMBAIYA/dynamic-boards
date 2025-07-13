import { DynamicBoardProvider } from "@/core/context/dynamic-board-provider";
import { ExampleBoard } from "@/example/example-board";
import { MOCK_CARD_DATA } from "@/data/mockCardData";

export function ExampleBoardWrapper() {
  return (
    <DynamicBoardProvider
      initialCards={MOCK_CARD_DATA}
      boardConfig={{
        maxCardsPerRow: 3,
        enableLayoutCorrection: true,
        disableCardDropInBetweenRows: true,
      }}
    >
      <div className="flex min-h-screen w-full flex-col">
        <div className="sticky top-0 z-50 flex min-h-10 items-center border-b border-gray-200 bg-white px-4">
          <h1 className="font-medium">Dynamic Boards</h1>
        </div>
        <ExampleBoard />
      </div>
    </DynamicBoardProvider>
  );
}
