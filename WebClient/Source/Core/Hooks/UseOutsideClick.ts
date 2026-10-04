import { useEffect, type RefObject } from "react";

export function UseOutsideClick(Target: RefObject<HTMLElement | null>, Active: boolean, OnOutside: () => void): void {
  useEffect(() => {
    if (!Active) return;

    const Handle = (Event: MouseEvent) => {
      if (!(Event.target instanceof Node)) return;
      if (Target.current?.contains(Event.target)) return;
      OnOutside();
    };

    document.addEventListener("mousedown", Handle);
    return () => document.removeEventListener("mousedown", Handle);
  }, [Active]);
}
