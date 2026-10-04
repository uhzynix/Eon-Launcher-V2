import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { PlayClick } from "../../../Core/Services/SoundEffects";

interface ImportDialogProps {
  Open: boolean;
  Path: string;
  Busy: boolean;
  OnBrowse: () => void;
  OnConfirm: () => void;
  OnClose: () => void;
}

export function ImportDialog({ Open, Path, Busy, OnBrowse, OnConfirm, OnClose }: ImportDialogProps) {
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
            aria-labelledby="import-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(Event) => Event.stopPropagation()}
          >
            <h2 id="import-title">Import a build</h2>
            <div className="import-instructions">
              <strong>Instructions</strong>
              <p>
                Add an installation to your library by selecting a folder which contains both{" "}
                <code><Folder size={12} strokeWidth={2.3} />Engine</code> &amp; <code><Folder size={12} strokeWidth={2.3} />FortniteGame</code> folders.
              </p>
            </div>
            <div className="import-path">
              <FolderOpen size={17} />
              <span className={Path ? "import-path-value" : "import-path-placeholder"}>{Path || "Choose a path!"}</span>
              <button type="button" aria-label="Browse for a folder" disabled={Busy} onClick={OnBrowse}>
                <FolderOpen size={16} />
              </button>
            </div>
            <div className="import-actions">
              <button type="button" className="import-cancel" onClick={() => { PlayClick(); OnClose(); }}>Cancel</button>
              <button type="button" className="import-next" disabled={!Path} onClick={OnConfirm}>Next <ChevronRight size={15} /></button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
