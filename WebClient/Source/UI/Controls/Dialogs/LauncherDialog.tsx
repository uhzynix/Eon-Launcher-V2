import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleHelp, RotateCw } from "lucide-react";
import { Invoke, Listen, OpenUrl } from "../../../Core/Bridge/Bridge";
import { PlayClick } from "../../../Core/Services/SoundEffects";

interface DialogRequest {
  Id: number;
  Title: string;
  Content: string;
  IsYesNo: boolean;
  Kind: string;
}

const LinkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s,]+)/g;

function RenderContent(Content: string): ReactNode[] {
  const Nodes: ReactNode[] = [];
  let Cursor = 0;

  for (const Match of Content.matchAll(LinkPattern)) {
    const Url = Match[2] ?? Match[3];
    const Label = Match[1] ?? Url;

    if (Match.index! > Cursor) Nodes.push(<span key={Cursor}>{Content.slice(Cursor, Match.index)}</span>);

    Nodes.push(
      <button key={Match.index} type="button" className="launcher-dialog-link" onClick={() => { PlayClick(); void OpenUrl(Url); }}>
        {Label}
      </button>,
    );

    Cursor = Match.index! + Match[0].length;
  }

  if (Cursor < Content.length) Nodes.push(<span key={Cursor}>{Content.slice(Cursor)}</span>);

  return Nodes;
}

export function LauncherDialog() {
  const [Request, SetRequest] = useState<DialogRequest | null>(null);

  useEffect(() => Listen<DialogRequest>("dialog-request", SetRequest), []);

  function Resolve(Confirmed: boolean) {
    if (!Request) return;
    PlayClick();
    void Invoke("ResolveDialog", { Id: Request.Id, Confirmed });
    SetRequest(null);
  }

  return (
    <AnimatePresence>
      {Request && (
        <motion.div
          className="launcher-dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="launcher-dialog"
            role="alertdialog"
            aria-labelledby="launcher-dialog-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`launcher-dialog-badge is-${Request.Kind}`} aria-hidden="true">
              {Request.IsYesNo ? <CircleHelp size={31} strokeWidth={2.1} /> : <RotateCw size={30} strokeWidth={2.3} />}
            </div>
            <h2 id="launcher-dialog-title">{Request.Title}</h2>
            <p>{RenderContent(Request.Content)}</p>
            <div className="launcher-dialog-actions">
              {Request.IsYesNo ? (
                <>
                  <button type="button" className={`launcher-dialog-button is-primary is-${Request.Kind}`} onClick={() => Resolve(true)}>Yes</button>
                  <button type="button" className="launcher-dialog-button" onClick={() => Resolve(false)}>No</button>
                </>
              ) : (
                <button type="button" className={`launcher-dialog-button is-primary is-${Request.Kind}`} onClick={() => Resolve(false)}>Got It</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
