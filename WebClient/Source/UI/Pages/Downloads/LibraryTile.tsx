import { useRef, useState, type KeyboardEvent } from "react";
import { MoreHorizontal, Play } from "lucide-react";
import { UseOutsideClick } from "../../../Core/Hooks/UseOutsideClick";
import { TileMenu } from "./TileMenu";

interface LibraryTileProps {
  Installed: boolean;
  Busy: boolean;
  Splash: string | null;
  GameRunning: boolean;
  Preparing: boolean;
  OnActivate: () => void;
  OnChangePath: () => void;
  OnRemove: () => void;
  OnUninstall: () => void;
}

export function LibraryTile(Props: LibraryTileProps) {
  const { Installed, Busy, Splash, GameRunning, Preparing } = Props;
  const [MenuOpen, SetMenuOpen] = useState(false);
  const CardRef = useRef<HTMLElement>(null);

  UseOutsideClick(CardRef, MenuOpen, () => SetMenuOpen(false));

  function HandleKeyDown(Event: KeyboardEvent<HTMLElement>) {
    if (Event.key !== "Enter" && Event.key !== " ") return;
    Event.preventDefault();
    if (!Busy) Props.OnActivate();
  }

  return (
    <article
      ref={CardRef}
      className={`download-tile download-path-tile${Installed ? "" : " download-import-tile"}`}
      data-tour="installation-path"
      role="button"
      tabIndex={Busy ? -1 : 0}
      onClick={() => { if (!Busy) Props.OnActivate(); }}
      onKeyDown={HandleKeyDown}
    >
      {!Installed && (
        <span className="download-tile-corners" aria-hidden="true">
          <span className="download-tile-corner download-tile-corner-top-left" />
          <span className="download-tile-corner download-tile-corner-top-right" />
          <span className="download-tile-corner download-tile-corner-bottom-left" />
          <span className="download-tile-corner download-tile-corner-bottom-right" />
        </span>
      )}
      <div className="download-tile-art download-path-art">
        {Splash ? (
          <>
            <img src={Splash} alt="" />
            <span className="download-tile-art-shade" />
          </>
        ) : (
          <div className="download-tile-art-empty">
            <span className="download-tile-action">
              <span className="download-tile-action-icon">
                <span className="material-symbols-outlined page-material-icon">add</span>
              </span>
              <span className="download-tile-action-label">Import</span>
            </span>
          </div>
        )}
      </div>
      {Installed && (
        <div className="download-tile-info">
          <div className="download-tile-title-row">
            <h2>Fortnite</h2>
            <button
              className="download-tile-menu"
              type="button"
              aria-label="Fortnite options"
              onClick={(Event) => { Event.stopPropagation(); SetMenuOpen((Open) => !Open); }}
            >
              <MoreHorizontal size={18} />
            </button>
            <TileMenu
              Open={MenuOpen}
              OnClose={() => SetMenuOpen(false)}
              OnChangePath={Props.OnChangePath}
              OnRemove={Props.OnRemove}
              OnUninstall={Props.OnUninstall}
            />
          </div>
          <span className="download-tile-launch">
            {Preparing || GameRunning ? null : <Play size={13} strokeWidth={2.4} fill="currentColor" />}
            {Preparing || GameRunning ? "Running" : "Launch"}
          </span>
        </div>
      )}
    </article>
  );
}
