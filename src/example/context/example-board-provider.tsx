import { useState } from "react";

import {
  ExampleBoardContext,
  type ExampleBoardContextType,
} from "@/example/context/example-board-context";
import { useDynamicBoard } from "@/core/hooks/useDynamicBoard";
import { AddEditCard } from "@/example/components/add-edit-card";
import { ProjectInfoModal } from "@/example/components/project-info-modal";
import type { MockCardContent } from "@/example/types";

export interface ExampleBoardProviderProps {
  children: React.ReactNode;
}

export function ExampleBoardProvider({ children }: ExampleBoardProviderProps) {
  const { addCard, updateCard } = useDynamicBoard<MockCardContent>();
  const [showProjectInfoModal, setShowProjectInfoModal] = useState(true);
  const [showOpenEditModal, setShowOpenEditModal] = useState<
    ExampleBoardContextType["showOpenEditModal"]
  >({
    mode: "close",
    data: null,
  });

  return (
    <ExampleBoardContext.Provider
      value={{
        showOpenEditModal,
        setShowOpenEditModal,
        showProjectInfoModal,
        setShowProjectInfoModal,
      }}
    >
      {children}
      <AddEditCard
        open={showOpenEditModal.mode !== "close"}
        onChange={() =>
          setShowOpenEditModal({
            mode: "close",
            data: null,
          })
        }
        closeOnClickOutside={false}
        mode={showOpenEditModal.mode}
        initialCardData={showOpenEditModal.data?.customCardData}
        handleSubmit={(cardData) => {
          if (showOpenEditModal.mode === "close") return;
          if (showOpenEditModal.mode === "add") {
            addCard(showOpenEditModal.data.rowId, {
              id: crypto.randomUUID(),
              layoutJson: showOpenEditModal.data.layoutJson,
              customCardData: cardData,
            });
          } else if (showOpenEditModal.mode === "edit") {
            updateCard(showOpenEditModal.data.id, {
              id: showOpenEditModal.data.id,
              layoutJson: showOpenEditModal.data.layoutJson,
              customCardData: cardData,
            });
          }
          setShowOpenEditModal({
            mode: "close",
            data: null,
          });
        }}
      />
      {/* This is the example project info modal. */}
      <ProjectInfoModal
        open={showProjectInfoModal}
        onChange={setShowProjectInfoModal}
        closeOnClickOutside={false}
      />
    </ExampleBoardContext.Provider>
  );
}
