import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { PlayClick } from "../../../Core/Services/SoundEffects";

interface BuildCheckModalProps {
  Checking: boolean;
  Unsupported: boolean;
  UnsupportedMessage: string;
  OnCancel: () => void;
  OnChangePath: () => void;
}

export function BuildCheckModal({ Checking, Unsupported, UnsupportedMessage, OnCancel, OnChangePath }: BuildCheckModalProps) {
  return createPortal(
    <AnimatePresence>
      {(Checking || Unsupported) && (
        <motion.div className="logout-modal-backdrop" role="presentation" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.section
            className="logout-modal build-confirm-modal"
            role="status"
            aria-live="polite"
            aria-label="Confirming Build"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2>{Unsupported ? "Build Not Supported" : "Confirming Build"}</h2>
            <p>{Unsupported ? UnsupportedMessage : "Checking Your Fortnite Installation."}</p>
            {!Unsupported && <LoaderCircle className="build-confirm-spinner" size={28} aria-hidden="true" />}
            <div className="logout-modal-actions">
              <button className="secondary" onClick={OnCancel}>Cancel</button>
              {Unsupported && <button className="secondary" onClick={() => { PlayClick(); OnChangePath(); }}>Change Path</button>}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
