import { AnimatePresence, motion } from "framer-motion";
import { PlayClick } from "../../../Core/Services/SoundEffects";

interface TileMenuProps {
  Open: boolean;
  OnChangePath: () => void;
  OnRemove: () => void;
  OnUninstall: () => void;
  OnClose: () => void;
}

export function TileMenu({ Open, OnChangePath, OnRemove, OnUninstall, OnClose }: TileMenuProps) {
  function Run(Action: () => void) {
    PlayClick();
    OnClose();
    Action();
  }

  return (
    <AnimatePresence>
      {Open && (
        <motion.div
          className="download-tile-menu-popover"
          initial={{ opacity: 0, y: -6, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.96 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          onClick={(Event) => Event.stopPropagation()}
        >
          <button type="button" onClick={() => Run(OnChangePath)}>Change Path</button>
          <button type="button" onClick={() => Run(OnRemove)}>Remove Build</button>
          <button className="download-menu-danger" type="button" onClick={() => Run(OnUninstall)}>Uninstall</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
