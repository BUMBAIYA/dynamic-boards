import { DynamicBoardProvider } from "@/core/context/dynamic-board-provider";
import { ExampleBoard } from "@/example/example-board";
import { MOCK_CARD_DATA } from "@/example/data/mockCardData";
import { ExampleBoardProvider } from "@/example/context/example-board-provider";
import { AppHeader } from "@/example/components/app-header";

export function ExampleBoardWrapper() {
  return (
    <DynamicBoardProvider
      initialCards={MOCK_CARD_DATA}
      boardConfig={{
        maxCardsPerRow: 3,
        enableLayoutCorrection: true,
        maxHeight: 700,
      }}
    >
      <ExampleBoardProvider>
        <div className="flex min-h-screen w-full flex-col">
          <AppHeader />
          <ExampleBoard />
        </div>
      </ExampleBoardProvider>
    </DynamicBoardProvider>
  );
}
