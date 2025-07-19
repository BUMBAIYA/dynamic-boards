import { InfoIcon } from "lucide-react";

export function ProjectInfoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="flex cursor-pointer items-center space-x-1 rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50"
      onClick={onClick}
    >
      <InfoIcon className="size-4" />
      <span className="text-sm">Project Info</span>
    </button>
  );
}
