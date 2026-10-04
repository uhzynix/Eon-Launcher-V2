import type { PointerEvent } from "react";

const Tilt = 8;

export function ApplyGlassPointer(Event: PointerEvent<HTMLElement>, ReduceMotion: boolean): void {
  const Card = Event.currentTarget;
  const Bounds = Card.getBoundingClientRect();
  if (Bounds.width === 0 || Bounds.height === 0) return;

  const RatioX = (Event.clientX - Bounds.left) / Bounds.width;
  const RatioY = (Event.clientY - Bounds.top) / Bounds.height;

  Card.style.setProperty("--mx", `${(RatioX * 100).toFixed(1)}%`);
  Card.style.setProperty("--my", `${(RatioY * 100).toFixed(1)}%`);
  Card.style.setProperty("--gloss", ".85");

  if (ReduceMotion) return;

  Card.style.setProperty("--rx", `${((RatioX - 0.5) * Tilt * 2).toFixed(2)}deg`);
  Card.style.setProperty("--ry", `${(-(RatioY - 0.5) * Tilt * 2).toFixed(2)}deg`);
}

export function ClearGlassPointer(Event: PointerEvent<HTMLElement>): void {
  const Card = Event.currentTarget;
  Card.style.setProperty("--gloss", ".5");
  Card.style.setProperty("--rx", "0deg");
  Card.style.setProperty("--ry", "0deg");
}
