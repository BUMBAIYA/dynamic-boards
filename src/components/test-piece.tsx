import { useEffect, useRef } from "react";

import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

export function TestPiece() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      onDragStart: (event) => {
        console.log("drag start", event);
      },
      onDrop: (event) => {
        console.log("drop", event);
      },
    });
  }, []);

  return (
    <div
      ref={ref}
      className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500 text-white"
    >
      <span>A</span>
    </div>
  );
}
