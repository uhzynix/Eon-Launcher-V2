import { useEffect } from "react";
import { Project } from "../../../Core/Services/ProjectStore";
import { ActionCopyFor } from "../../../Core/Configuration/LibraryActions";
import { UseLibraryFlow } from "../../../Core/Hooks/UseLibraryFlow";
import { UseInstallFlow } from "../../../Core/Hooks/UseInstallFlow";
import { ImportDialog } from "../../Controls/Dialogs/ImportDialog";
import { InstallDialog } from "../../Controls/Dialogs/InstallDialog";
import { ConfirmModal } from "../../Controls/Dialogs/ConfirmModal";
import { BuildCheckModal } from "../../Controls/Dialogs/BuildCheckModal";
import { LibraryGrid } from "./LibraryGrid";
import type { GameRunningState } from "../../../Core/Hooks/UseGameRunning";
import type { LaunchButton } from "../../../Core/Hooks/UseLaunchButton";
import type { BuildDownloadProgress } from "../../../Types/Downloads";

interface DownloadsProps {
  SelectedFolder: string;
  OnFolderResolved: (Folder: string) => void;
  Game: GameRunningState;
  Launch: LaunchButton;
  Preparing: boolean;
  DownloadProgress: BuildDownloadProgress | null;
  DownloadSpeed: number;
  DownloadError: string | null;
  OnPauseDownload: () => void;
  OnResumeDownload: () => void;
  OnCancelDownload: () => void;
  OnStartDownload: (Folder?: string, IsInstall?: boolean) => void;
  OnClearDownloadError: () => void;
}

export function DownloadsPage(Props: DownloadsProps) {
  const { SelectedFolder, OnFolderResolved, DownloadProgress, Game, Launch } = Props;

  const Info = Project();
  const Flow = UseLibraryFlow(SelectedFolder, OnFolderResolved);
  const Install = UseInstallFlow((Folder) => Props.OnStartDownload(Folder, true));
  const Library = Flow.Library;

  useEffect(() => {
    if (DownloadProgress?.Status === "complete") Library.MarkInstalled();
  }, [DownloadProgress]);

  function StartPlay() {
    if (Props.Preparing || Launch.Launching || Launch.GameRunning || Library.Busy) return;
    Launch.Launch();
  }

  async function StopIfRunning() {
    if (Launch.GameRunning) await Launch.Stop(true);
  }

  async function RemoveBuild() {
    await StopIfRunning();
    Library.Forget();
  }

  const Copy = Flow.Action ? ActionCopyFor(Info.Build) : null;

  return (
    <div className="settings installation-settings">
      <LibraryGrid
        Library={Library}
        GameRunning={Launch.GameRunning}
        Preparing={Launch.Launching}
        Progress={DownloadProgress}
        Speed={Props.DownloadSpeed}
        Error={Props.DownloadError}
        OnPause={Props.OnPauseDownload}
        OnResume={Props.OnResumeDownload}
        OnCancel={Props.OnCancelDownload}
        OnActivate={() => (Library.Installed ? StartPlay() : Flow.OpenImport())}
        OnChangePath={Flow.ChangePath}
        OnRemove={() => void RemoveBuild()}
        OnUninstall={() => Flow.SetAction("uninstall")}
        OnInstall={() => { Props.OnClearDownloadError(); Install.Begin(); }}
        OnDismissError={Props.OnClearDownloadError}
      />

      <InstallDialog
        Open={Install.Open}
        Path={Install.Path}
        OnBrowse={Install.Browse}
        OnConfirm={Install.Confirm}
        OnClose={Install.Close}
      />

      <ImportDialog
        Open={Flow.ImportOpen}
        Path={Flow.ImportPath}
        Busy={Library.Busy}
        OnBrowse={Flow.BrowseImport}
        OnConfirm={Flow.ConfirmImport}
        OnClose={() => Flow.SetImportOpen(false)}
      />

      {Copy && (
        <ConfirmModal
          Title={Copy.Title}
          Message={Copy.Message}
          ConfirmLabel={Copy.Confirm}
          OnConfirm={() => { void StopIfRunning().then(Flow.RunAction).then(Game.Refresh); }}
          OnCancel={() => Flow.SetAction(null)}
        />
      )}

      <BuildCheckModal
        Checking={Library.Confirming}
        Unsupported={Library.Unsupported}
        UnsupportedMessage={`Only Fortnite v${Info.Build} Can Be Used With ${Info.Name}.`}
        OnCancel={Library.Cancel}
        OnChangePath={() => { Library.SetUnsupported(false); Flow.ChangePath(); }}
      />
    </div>
  );
}
