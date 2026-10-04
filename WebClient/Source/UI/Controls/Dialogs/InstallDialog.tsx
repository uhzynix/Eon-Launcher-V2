import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { PlayClick } from "../../../Core/Services/SoundEffects";

interface InstallDialogProps {
  Open: boolean;
  Path: string;
  OnBrowse: () => void;
  OnConfirm: () => void;
  OnClose: () => void;
}

export function InstallDialog({ Open, Path, OnBrowse, OnConfirm, OnClose }: InstallDialogProps) {
  return createPortal(
    <AnimatePresence>
      {Open && (
        <motion.div
          className="import-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          onMouseDown={OnClose}
        >
          <motion.section
            className="import-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(Event) => Event.stopPropagation()}
          >
            <h2 id="install-title">Choose install location</h2>
            <span className="install-field-label">Folder</span>
            <div className="import-path">
              <FolderOpen size={17} />
              <span className={Path ? "import-path-value" : "import-path-placeholder"}>{Path || "Choose a path!"}</span>
              <button type="button" aria-label="Browse for a folder" onClick={OnBrowse}>
                <FolderOpen size={16} />
              </button>
            </div>
            <div className="import-actions">
              <button type="button" className="import-cancel" onClick={() => { PlayClick(); OnClose(); }}>Cancel</button>
              <button type="button" className="import-next" disabled={!Path} onClick={OnConfirm}>Install</button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
