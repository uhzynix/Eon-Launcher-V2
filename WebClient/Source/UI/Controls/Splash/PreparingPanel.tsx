import { motion } from "framer-motion";
import { BrandLogo } from "../../../Core/Configuration/Assets";
import { Project } from "../../../Core/Services/ProjectStore";

interface PreparingPanelProps {
  Visible: boolean;
  Stage: string;
  Dots: string;
  Progress: number;
}

export function PreparingPanel({ Visible, Stage, Dots, Progress }: PreparingPanelProps) {
  return (
    <motion.div
      className="splash-panel"
      initial={{ opacity: Visible ? 1 : 0 }}
      animate={{ opacity: Visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ pointerEvents: Visible ? "auto" : "none" }}
    >
      <img className="splash-panel-logo" src={BrandLogo} alt={Project().Name} />
      <strong>{Project().Name} Launcher</strong>
      <span>{Stage}<span className="splash-dots">{Dots}</span></span>
      <div className="splash-bar is-determinate" aria-hidden="true">
        <span style={{ width: `${Progress}%` }} />
      </div>
    </motion.div>
  );
}
