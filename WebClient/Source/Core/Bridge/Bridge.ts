import type { PointerEvent } from "react";

interface EonBridge {
  Invoke<Result>(Method: string, Args?: Record<string, unknown>): Promise<Result>;
  Listen<Payload>(Event: string, Handler: (Payload: Payload) => void): () => void;
}

declare global {
  interface Window {
    Eon: EonBridge;
  }
}

export function Invoke<Result>(Method: string, Args?: Record<string, unknown>): Promise<Result> {
  return window.Eon.Invoke<Result>(Method, Args);
}

export function Listen<Payload>(Event: string, Handler: (Payload: Payload) => void): () => void {
  return window.Eon.Listen<Payload>(Event, Handler);
}

export function OpenUrl(Url: string): Promise<void> {
  return Invoke("OpenUrl", { Url });
}

export function MinimizeWindow(): Promise<void> {
  return Invoke("MinimizeWindow");
}

export function CloseWindow(): Promise<void> {
  return Invoke("CloseWindow");
}

export function ShowWindow(): Promise<void> {
  return Invoke("ShowWindow");
}

export function BeginDrag(Event: PointerEvent<HTMLElement>): void {
  if (Event.button !== 0 || (Event.target as HTMLElement).closest("button, a, input")) return;

  const Target = Event.currentTarget;

  const Release = () => {
    Target.removeEventListener("pointerup", Release);
    Target.removeEventListener("pointercancel", Release);
    void Invoke("EndDrag");
  };

  Target.setPointerCapture(Event.pointerId);
  Target.addEventListener("pointerup", Release);
  Target.addEventListener("pointercancel", Release);

  void Invoke("BeginDrag");
}

