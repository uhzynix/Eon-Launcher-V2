import type { KeyboardEvent } from "react";
import { Download as DownloadIcon } from "lucide-react";
import { SplashArt } from "../../../Core/Configuration/Assets";

interface InstallTileProps {
  Disabled: boolean;
  OnInstall: () => void;
}

export function InstallTile({ Disabled, OnInstall }: InstallTileProps) {
  function HandleKeyDown(Event: KeyboardEvent<HTMLElement>) {
    if (Event.key !== "Enter" && Event.key !== " ") return;
    Event.preventDefault();
    if (!Disabled) OnInstall();
  }

  return (
    <article
      className="download-tile download-install-tile"
      data-tour="installation-build"
      role="button"
      aria-label="Download"
      tabIndex={Disabled ? -1 : 0}
      onClick={() => { if (!Disabled) OnInstall(); }}
      onKeyDown={HandleKeyDown}
    >
      <span className="download-tile-corners" aria-hidden="true">
        <span className="download-tile-corner download-tile-corner-top-left" />
        <span className="download-tile-corner download-tile-corner-top-right" />
        <span className="download-tile-corner download-tile-corner-bottom-left" />
        <span className="download-tile-corner download-tile-corner-bottom-right" />
      </span>
      <div className="download-tile-art">
        <img className="download-install-art-image" src={SplashArt} alt="" />
        <span className="download-tile-action" aria-hidden="true">
          <span className="download-tile-action-icon"><DownloadIcon size={26} /></span>
          <span className="download-tile-action-label">Download</span>
        </span>
      </div>
    </article>
  );
}
