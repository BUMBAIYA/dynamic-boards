import { useState } from "react";

import { DynamicBoardProvider } from "@/core/context/dynamic-board-provider";
import { ExampleBoard } from "@/example/example-board";
import { GithubAnchor } from "@/example/components/github-anchor";
import { ProjectInfoButton } from "@/example/components/project-info-button";
import { MOCK_CARD_DATA } from "@/example/data/mockCardData";
import { ExampleBoardProvider } from "@/example/context/example-board-provider";
import { ProjectInfoModal } from "@/example/components/project-info-modal";

export function ExampleBoardWrapper() {
  const [showProjectInfoModal, setShowProjectInfoModal] = useState(true);

  return (
    <>
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
            <div className="flex items-center space-x-2">
              <ProjectInfoButton
                onClick={() => setShowProjectInfoModal(true)}
              />
              <GithubAnchor />
            </div>
          </div>
          {/* This is the example board provider. */}
          {/* User need to implement their own provider here according to their own needs/business logic. */}
          <ExampleBoardProvider>
            <ExampleBoard />
          </ExampleBoardProvider>
        </div>
      </DynamicBoardProvider>
      {/* This is the example project info modal. */}
      <ProjectInfoModal
        open={showProjectInfoModal}
        onChange={setShowProjectInfoModal}
        closeOnClickOutside={false}
      />
    </>
  );
}
