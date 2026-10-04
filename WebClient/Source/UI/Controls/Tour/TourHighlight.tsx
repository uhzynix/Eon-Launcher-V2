import { AnimatePresence, motion } from "framer-motion";
import type { HighlightBounds } from "../../../Core/Services/TourGeometry";

const Padding = 6;
const Inset = 4;
const Transition = { duration: 0.42, ease: [0.16, 1, 0.3, 1] } as const;

interface TourHighlightProps {
  Bounds: HighlightBounds | null;
  Hidden: boolean;
}

function ToFrame(Bounds: HighlightBounds) {
  const Left = Math.max(Inset, Bounds.left - Padding);
  const Top = Math.max(Inset, Bounds.top - Padding);
  const Right = Math.min(window.innerWidth - Inset, Bounds.right + Padding);
  const Bottom = Math.min(window.innerHeight - Inset, Bounds.bottom + Padding);

  return { x: Left, y: Top, width: Math.max(0, Right - Left), height: Math.max(0, Bottom - Top) };
}

export function TourHighlight({ Bounds, Hidden }: TourHighlightProps) {
  const Frame = Bounds ? ToFrame(Bounds) : null;

  return (
    <AnimatePresence>
      {Frame && (
        <motion.svg
          key="launcher-tour-overlay"
          className="launcher-tour-overlay"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: Hidden ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <defs>
            <mask id="launcher-tour-mask">
              <rect width="100%" height="100%" fill="white" />
              <motion.rect initial={Frame} animate={Frame} transition={Transition} rx="14" fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="#030305" fillOpacity=".72" mask="url(#launcher-tour-mask)" />
          <motion.rect
            className="launcher-tour-highlight-ring"
            initial={Frame}
            animate={Frame}
            transition={Transition}
            rx="14"
            fill="none"
            stroke="rgba(255, 255, 255, .85)"
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}
