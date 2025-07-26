import { ProjectInfoButton } from "@/example/components/project-info-button";
import { GithubAnchor } from "@/example/components/github-anchor";
import { useExampleBoard } from "@/example/context/useExampleBoard";

export function AppHeader() {
  const { setShowProjectInfoModal } = useExampleBoard();

  return (
    <div className="sticky top-0 z-50 flex min-h-10 items-center justify-between border-b border-gray-200 bg-white px-4">
      <h1 className="font-medium">Dynamic Boards</h1>
      <div className="flex items-center space-x-2">
        <ProjectInfoButton onClick={() => setShowProjectInfoModal(true)} />
        <GithubAnchor />
      </div>
    </div>
  );
}
