import { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import type { CardPosition } from "../../../Core/Services/TourGeometry";
import type { TourStep } from "../../../Core/Configuration/TourSteps";

interface TourCardProps {
  Step: TourStep;
  Index: number;
  StepCount: number;
  IsIntro: boolean;
  IsLastStep: boolean;
  IsCentered: boolean;
  IsLocating: boolean;
  Position: CardPosition;
  OnBack: () => void;
  OnNext: () => void;
  OnClose: () => void;
}

export const TourCard = forwardRef<HTMLElement, TourCardProps>(function TourCard(Props, Reference) {
  const { Step, Index, StepCount, IsIntro, IsLastStep, IsCentered, IsLocating, Position } = Props;

  return (
    <motion.section
      ref={Reference}
      initial={{ opacity: 0, scale: 0.96, ...Position }}
      animate={{ opacity: 1, scale: 1, ...Position }}
      transition={{
        opacity: { duration: 0.28, ease: "easeOut" },
        scale: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
        top: { duration: 0.44, ease: [0.16, 1, 0.3, 1] },
        left: { duration: 0.44, ease: [0.16, 1, 0.3, 1] },
      }}
      className={`launcher-tour${IsCentered ? " launcher-tour-intro" : " launcher-tour-tooltip"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="launcher-tour-title"
    >
      <button className="launcher-tour-close" type="button" aria-label="Skip tour" onClick={() => { PlayClick(); Props.OnClose(); }}>
        <X size={18} />
      </button>
      <div className="launcher-tour-copy">
        <AnimatePresence mode="wait">
          <motion.div
            key={Index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 id="launcher-tour-title">{Step.Title}</h2>
            <p>{Step.Description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="launcher-tour-progress" aria-hidden="true">
        {Array.from({ length: StepCount }).map((_, Dot) => (
          <span key={Dot} className={Index > Dot ? "active" : ""} />
        ))}
      </div>
      <div className="launcher-tour-actions">
        <button className="launcher-tour-skip" type="button" onClick={() => { PlayClick(); Props.OnClose(); }}>
          Skip tour
        </button>
        <div className="launcher-tour-navigation">
          {Index > 0 && (
            <button className="launcher-tour-icon-button" type="button" aria-label="Previous step" disabled={IsLocating} onClick={() => { PlayClick(); Props.OnBack(); }}>
              <ArrowLeft size={17} />
            </button>
          )}
          <button className="launcher-tour-next" type="button" disabled={IsLocating} onClick={() => { PlayClick(); Props.OnNext(); }}>
            {IsIntro ? "Start tour" : IsLastStep ? "Get started" : "Next"}
            {IsLastStep ? <Check size={16} /> : <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </motion.section>
  );
});
