import { useEffect, useRef, type PointerEvent } from "react";
import { ApplyGlassPointer, ClearGlassPointer } from "../Services/GlassPointer";

export interface GlassPointer {
  OnPointerMove: (Event: PointerEvent<HTMLElement>) => void;
  OnPointerLeave: (Event: PointerEvent<HTMLElement>) => void;
}

export function UseGlassPointer(): GlassPointer {
  const ReduceMotion = useRef(false);

  useEffect(() => {
    ReduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return {
    OnPointerMove: (Event) => ApplyGlassPointer(Event, ReduceMotion.current),
    OnPointerLeave: ClearGlassPointer,
  };
}
