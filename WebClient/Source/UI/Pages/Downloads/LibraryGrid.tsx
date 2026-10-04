import { DownloadNotification } from "../../Controls/Downloads/DownloadNotification";
import { LibraryTile } from "./LibraryTile";
import { InstallTile } from "./InstallTile";
import type { BuildDownloadProgress } from "../../../Types/Downloads";
import type { BuildLibrary } from "../../../Types/Library";

interface LibraryGridProps {
  Library: BuildLibrary;
  GameRunning: boolean;
  Preparing: boolean;
  Progress: BuildDownloadProgress | null;
  Speed: number;
  Error: string | null;
  OnPause: () => void;
  OnResume: () => void;
  OnCancel: () => void;
  OnActivate: () => void;
  OnChangePath: () => void;
  OnRemove: () => void;
  OnUninstall: () => void;
  OnInstall: () => void;
  OnDismissError: () => void;
}

export function LibraryGrid(Props: LibraryGridProps) {
  const { Library, Progress, Error } = Props;

  return (
    <section className={`downloads-grid${Library.Installed === null ? " downloads-grid-loading" : ""}`}>
      <h2 className="library-section-title">{Progress ? (Progress.Status === "extracting" ? "Installing" : "Downloading") : "Installed"}</h2>
      {Error && !Progress && (
        <p className="form-message error">
          {Error}
          <button type="button" className="download-error-dismiss" onClick={Props.OnDismissError}>Dismiss</button>
        </p>
      )}
      {Progress && (
        <DownloadNotification
          Progress={Progress}
          Speed={Props.Speed}
          OnPause={Props.OnPause}
          OnResume={Props.OnResume}
          OnCancel={Props.OnCancel}
        />
      )}
      {!Progress && (
        <LibraryTile
          Installed={Boolean(Library.Installed)}
          Busy={Library.Busy}
          Splash={Library.Splash}
          GameRunning={Props.GameRunning}
          Preparing={Props.Preparing}
          OnActivate={Props.OnActivate}
          OnChangePath={Props.OnChangePath}
          OnRemove={Props.OnRemove}
          OnUninstall={Props.OnUninstall}
        />
      )}
      {!Progress && Library.Installed !== true && (
        <>
          <h2 className="library-section-title library-section-title-available">Available Downloads</h2>
          <InstallTile Disabled={Library.Busy || Library.Installed === null} OnInstall={Props.OnInstall} />
        </>
      )}
    </section>
  );
}
