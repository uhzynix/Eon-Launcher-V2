import { useRef } from "react";
import type { PageId } from "../../../Core/Configuration/PageDefinitions";
import { StepTargets, TourSteps } from "../../../Core/Configuration/TourSteps";
import { PlaceCard, UnionBounds } from "../../../Core/Services/TourGeometry";
import { UseTourStep } from "../../../Core/Hooks/UseTourStep";
import { UseMeasuredSize } from "../../../Core/Hooks/UseMeasuredSize";
import { TourHighlight } from "./TourHighlight";
import { TourCard } from "./TourCard";

const IntroSize = { width: 440, height: 250 };
const TooltipSize = { width: 390, height: 230 };

interface LauncherTourProps {
  OnClose: () => void;
  OnNavigate: (Page: PageId) => void;
}

export function LauncherTour({ OnClose, OnNavigate }: LauncherTourProps) {
  const Step = UseTourStep(OnNavigate);
  const CardRef = useRef<HTMLElement>(null);

  const Current = TourSteps[Step.Index] ?? TourSteps[0];
  const IsIntro = Step.Index === 0;
  const IsLastStep = Step.Index === TourSteps.length - 1;
  const IsCentered = StepTargets(Current).length === 0;

  const Size = UseMeasuredSize(CardRef, Step.Index, IsIntro ? IntroSize : TooltipSize);
  const Bounds = UnionBounds(Step.Rects);
  const Position = PlaceCard(IsCentered ? null : Bounds, Size);

  function Advance(Offset: number) {
    if (Step.IsLocating) return;
    if (Offset > 0 && IsLastStep) {
      OnClose();
      return;
    }

    const Next = Step.Index + Offset;
    if (Next < 0 || Next >= TourSteps.length) return;
    Step.GoTo(Next);
  }

  return (
    <div className={`launcher-tour-backdrop${IsCentered ? " is-intro" : ""}`} role="presentation">
      <TourHighlight Bounds={Bounds} Hidden={Step.IsLocating} />
      <TourCard
        ref={CardRef}
        Step={Current}
        Index={Step.Index}
        StepCount={TourSteps.length - 1}
        IsIntro={IsIntro}
        IsLastStep={IsLastStep}
        IsCentered={IsCentered}
        IsLocating={Step.IsLocating}
        Position={Position}
        OnBack={() => Advance(-1)}
        OnNext={() => Advance(1)}
        OnClose={OnClose}
      />
    </div>
  );
}
