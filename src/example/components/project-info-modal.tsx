import { XIcon } from "lucide-react";

import {
  CustomModal,
  type CustomModalProps,
} from "@/example/components/custom-modal";

export function ProjectInfoModal(props: CustomModalProps) {
  return (
    <CustomModal {...props}>
      <div className="flex w-full max-w-3xl flex-col rounded-xl bg-white">
        <div className="flex min-h-10 items-center justify-between border-b border-gray-200 p-3">
          <h1 className="text-xl font-semibold">Overview</h1>
          <button
            type="button"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md p-1 hover:bg-gray-200"
            onClick={() => props.onChange(false)}
          >
            <XIcon />
          </button>
        </div>
        <div className="flex w-full flex-col space-y-8 px-5 py-4">
          {/* Overview */}
          <p className="text-sm text-gray-600">
            This is an interactive dashboard where you can drag, resize, and
            organize cards to create your perfect layout. Think of it like a
            customizable dashboard where you can arrange everything exactly how
            you want it.
          </p>

          {/* How to Drag Cards */}
          <div>
            <h2 className="mb-3 text-base font-semibold">
              🎯 Moving Cards Around
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                  1
                </div>
                <div>
                  <strong>Drag Cards:</strong> Click and hold on any card's
                  header (the top part with the title) to start dragging
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                  2
                </div>
                <div>
                  <strong>Drop Anywhere:</strong> Drag cards between rows or
                  within the same row to reorganize your layout
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                  3
                </div>
                <div className="flex items-center space-x-2">
                  <strong>Visual Feedback:</strong>
                  <p className="flex items-center space-x-1">
                    <span>You'll see a purple</span>
                    <span className="bg-primary mr-1 inline-block size-3 rounded-sm"></span>
                    <span>highlight when hovering over valid drop zones.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Resize Cards */}
          <div>
            <h2 className="mb-3 text-base font-semibold">📏 Resizing Cards</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                  1
                </div>
                <div>
                  <strong>Width Resize:</strong> Look for the thin vertical
                  resize handles between cards - drag these to make cards wider
                  or narrower
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                  2
                </div>
                <div>
                  <strong>Row Height:</strong> Use the horizontal resize handle
                  at the bottom of each row to make rows taller or shorter
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                  3
                </div>
                <div>
                  <strong>Smart Layout:</strong> The system automatically
                  adjusts other cards to maintain a balanced layout
                </div>
              </div>
            </div>
          </div>

          {/* Adding New Cards */}
          <div>
            <h2 className="mb-3 text-base font-semibold">
              ➕ Adding New Cards
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-800">
                  1
                </div>
                <div>
                  <strong>Add to Existing Row:</strong> Click the "+" button at
                  the end of any row to add a new card there
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-800">
                  2
                </div>
                <div>
                  <strong>Create New Row:</strong> Use the "Add New Row" button
                  at the bottom to create a completely new row
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-800">
                  3
                </div>
                <div>
                  <strong>Customize:</strong> Choose the card type and configure
                  it to your needs
                </div>
              </div>
            </div>
          </div>

          {/* Card Management */}
          <div>
            <h2 className="mb-3 text-base font-semibold">
              ⚙️ Managing Your Cards
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">✏️</span>
                <span>
                  <strong>Edit:</strong> Click the "Edit" button on any card to
                  modify its content and settings
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">🗑️</span>
                <span>
                  <strong>Delete:</strong> Use the "Delete" button to remove
                  cards you no longer need
                </span>
              </div>
            </div>
          </div>

          {/* Made by */}
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <span className="text-lg">🚀</span>
              <div>
                <div className="font-semibold">Made by Amit Chauhan</div>
                <div className="text-sm text-blue-600">
                  <a
                    href="https://github.com/BUMBAIYA/dynamic-boards"
                    target="_blank"
                    className="underline"
                  >
                    Check out the source code
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
