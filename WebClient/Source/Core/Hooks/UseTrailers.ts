import { useEffect, useState } from "react";
import { TrailerSources } from "../Configuration/Assets";

function PlayFromStart(Video: HTMLVideoElement) {
  try {
    if (Video.currentTime >= Video.duration - 0.25) Video.currentTime = 0;
  } catch {
  }

  void Video.play().catch(() => {});
}

function Rewind(Video: HTMLVideoElement) {
  if (!Video.paused) Video.pause();

  try {
    Video.currentTime = 0;
  } catch {
  }
}

function Element(Index: number): HTMLVideoElement | null {
  const Found = document.getElementById(`home-trailer-${Index}`);
  return Found instanceof HTMLVideoElement ? Found : null;
}

export interface Trailers {
  Active: number;
  SetActive: (Index: number) => void;
}

export function UseTrailers(IsPlayPage: boolean, Enabled: boolean): Trailers {
  const [Active, SetActive] = useState(0);

  useEffect(() => {
    if (!Enabled) return;

    for (let Index = 0; Index < TrailerSources.length; Index += 1) {
      const Video = Element(Index);
      if (!Video) continue;

      Video.classList.toggle("is-ready", IsPlayPage);
      Video.classList.toggle("is-active", IsPlayPage && Index === Active);

      if (!IsPlayPage || Index !== Active) {
        Rewind(Video);
        continue;
      }

      if (Video.readyState >= 2) {
        PlayFromStart(Video);
        continue;
      }

      Video.addEventListener("canplay", () => PlayFromStart(Video), { once: true });
    }
  }, [IsPlayPage, Active, Enabled]);

  return { Active, SetActive };
}
