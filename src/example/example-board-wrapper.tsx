import { DynamicBoardProvider } from "@/core/context/dynamic-board-provider";
import { ExampleBoard } from "@/example/example-board";
import { GithubAnchor } from "@/example/components/github-anchor";
import { MOCK_CARD_DATA } from "@/example/data/mockCardData";
import { ExampleBoardProvider } from "@/example/context/example-board-provider";

export function ExampleBoardWrapper() {
  return (
    <DynamicBoardProvider
      initialCards={MOCK_CARD_DATA}
      boardConfig={{
        maxCardsPerRow: 3,
        enableLayoutCorrection: true,
        disableCardDropInBetweenRows: true,
        maxHeight: 700,
      }}
    >
      <div className="flex min-h-screen w-full flex-col">
        <div className="sticky top-0 z-50 flex min-h-10 items-center justify-between border-b border-gray-200 bg-white px-4">
          <h1 className="font-medium">Dynamic Boards</h1>
          <GithubAnchor />
        </div>
        {/* This is the example board provider. */}
        {/* User need to implement their own provider here according to their own needs/business logic. */}
        <ExampleBoardProvider>
          <ExampleBoard />
        </ExampleBoardProvider>
      </div>
    </DynamicBoardProvider>
  );
}
