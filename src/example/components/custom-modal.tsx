import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface CustomModalProps {
  open: boolean;
  onChange: (open: boolean) => void;
  children?: React.ReactNode;
  closeOnClickOutside?: boolean;
}

/**
 * This is make shift modal implementation.
 * It is not a good practice to use this in production.
 * It is only used for this example project. Did not wanted to add an extra dependency.
 *
 * TODO: Use a proper modal library.
 *
 *
 * Custom modal component that can be used to display a modal.
 * @param open - Whether the modal is open.
 * @param onChange - Callback function to handle modal open state changes.
 * @param children - React nodes to be rendered inside the modal.
 * @param closeOnClickOutside - Whether to close the modal when clicking outside of it.
 */
export function CustomModal({
  open,
  onChange,
  children,
  closeOnClickOutside = true,
}: CustomModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={focusTrapElement}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black/40 p-3"
    >
      <div
        data-modal-root
        className="flex w-full flex-1 items-center justify-center"
        onClick={(e) => {
          if (
            closeOnClickOutside &&
            (e.target as HTMLElement).hasAttribute("data-modal-root")
          ) {
            e.stopPropagation();
            e.preventDefault();
            onChange(false);
          }
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function focusTrapElement(container: HTMLElement | null) {
  if (!container) return;
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ];

  const focusableElements = container.querySelectorAll(
    focusableSelectors.join(", "),
  );
  const first = focusableElements[0] as HTMLElement;
  const last = focusableElements[focusableElements.length - 1] as HTMLElement;

  container.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
