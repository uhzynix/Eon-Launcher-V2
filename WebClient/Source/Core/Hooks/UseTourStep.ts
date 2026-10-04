import { useEffect, useRef, useState } from "react";
import type { PageId } from "../Configuration/PageDefinitions";
import { StepTargets, TourSteps } from "../Configuration/TourSteps";
import { AreRectsStable, MeasureTargets } from "../Services/TourGeometry";

const PageSettleDelay = 200;
const MaxAttempts = 60;
const RequiredStableFrames = 2;

const NextFrame = () => new Promise((Resolve) => requestAnimationFrame(Resolve));
const Wait = (Delay: number) => new Promise((Resolve) => setTimeout(Resolve, Delay));

export interface TourStepState {
  Index: number;
  Rects: DOMRect[];
  IsLocating: boolean;
  GoTo: (Index: number) => void;
}

export function UseTourStep(OnNavigate: (Page: PageId) => void): TourStepState {
  const [Index, SetIndex] = useState(0);
  const [Rects, SetRects] = useState<DOMRect[]>([]);
  const [IsLocating, SetIsLocating] = useState(false);
  const RequestId = useRef(0);

  async function Locate(NextIndex: number, Selectors: string[], Request: number) {
    const Step = TourSteps[NextIndex];
    await (Step?.Page ? Wait(PageSettleDelay) : NextFrame());
    if (Request !== RequestId.current) return;

    let Previous: DOMRect[] = [];
    let Stable = 0;

    for (let Attempt = 0; Attempt < MaxAttempts; Attempt += 1) {
      if (Request !== RequestId.current) return;
      await NextFrame();

      const Measured = MeasureTargets(Selectors);
      if (Measured.length === 0) continue;

      Stable = AreRectsStable(Previous, Measured) ? Stable + 1 : 0;
      Previous = Measured;

      if (Stable >= RequiredStableFrames) {
        SetIsLocating(false);
        SetIndex(NextIndex);
        SetRects(Measured);
        return;
      }
    }

    if (Request !== RequestId.current) return;
    SetIsLocating(false);
    SetIndex(NextIndex);
    SetRects(Previous);
  }

  function GoTo(NextIndex: number) {
    const Step = TourSteps[NextIndex];
    if (!Step) return;

    const Selectors = StepTargets(Step);
    const Request = ++RequestId.current;

    if (Step.Page) OnNavigate(Step.Page);

    if (Selectors.length === 0) {
      SetIsLocating(false);
      SetIndex(NextIndex);
      SetRects([]);
      return;
    }

    SetIsLocating(true);
    void Locate(NextIndex, Selectors, Request);
  }

  useEffect(() => {
    const Remeasure = () => {
      const Selectors = StepTargets(TourSteps[Index]);
      if (Selectors.length === 0) return;

      const Measured = MeasureTargets(Selectors);
      if (Measured.length > 0) SetRects(Measured);
    };

    window.addEventListener("resize", Remeasure);
    return () => window.removeEventListener("resize", Remeasure);
  }, [Index]);

  return { Index, Rects, IsLocating, GoTo };
}
