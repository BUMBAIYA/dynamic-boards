import { useEffect, useRef } from "react";
import type { DynamicBoardDNDRow } from "@/core/types";

export interface DynamicBoardRowProps {
  row: DynamicBoardDNDRow;
  children: (props: {
    boardRow: DynamicBoardDNDRow;
    boardRowRef: React.RefObject<HTMLDivElement | null>;
  }) => React.ReactNode;
}

export function DynamicBoardRow({ row, children }: DynamicBoardRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      row.rowElementRef = ref.current;
    }
  }, [row]);

  return children({ boardRow: row, boardRowRef: ref });
}
