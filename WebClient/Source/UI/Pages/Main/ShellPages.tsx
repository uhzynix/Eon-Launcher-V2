import type { PageId } from "../../../Core/Configuration/PageDefinitions";
import type { Account } from "../../../Core/Configuration/AccountSettings";
import type { ThemeId } from "../../../Core/Configuration/Themes";
import type { AccountActions } from "../../../Core/Hooks/UseAccountActions";
import type { BuildDownload } from "../../../Core/Hooks/UseBuildDownload";
import type { GameRunningState } from "../../../Core/Hooks/UseGameRunning";
import type { LaunchButton } from "../../../Core/Hooks/UseLaunchButton";
import { PlayPage } from "../Play/PlayPage";
import { DownloadsPage } from "../Downloads/DownloadsPage";
import { SettingsPage, type SettingsTab } from "../Settings/SettingsPage";
import { ItemShopPage } from "../Shop/ItemShopPage";
import { LeaderboardPage } from "../Leaderboard/LeaderboardPage";
import { ServerStatusPage } from "../ServerStatus/ServerStatusPage";

interface ShellPagesProps {
  ActivePage: PageId;
  Account: Account;
  Folder: string;
  Theme: ThemeId;
  Actions: AccountActions;
  Download: BuildDownload;
  Game: GameRunningState;
  Launch: LaunchButton;
  SettingsTab: SettingsTab;
  OnSettingsTabChange: (Tab: SettingsTab) => void;
  OnNavigate: (Page: PageId) => void;
  Preparing: boolean;
  Downloading: boolean;
}

export function ShellPages(Props: ShellPagesProps) {
  const { ActivePage, Account, Folder, Theme, Actions, Download, Game, Launch } = Props;

  if (ActivePage === "shop") return <ItemShopPage />;
  if (ActivePage === "leaderboard") return <LeaderboardPage />;
  if (ActivePage === "status") return <ServerStatusPage />;

  if (ActivePage === "play") {
    return (
      <PlayPage SelectedFolder={Folder} Downloading={Props.Downloading} Launch={Launch} OnNavigate={Props.OnNavigate} />
    );
  }

  if (ActivePage === "downloads") {
    return (
      <DownloadsPage
        SelectedFolder={Folder}
        OnFolderResolved={Actions.ResolveFolder}
        Game={Game}
        Launch={Launch}
        Preparing={Props.Preparing}
        DownloadProgress={Download.Progress}
        DownloadSpeed={Download.Speed}
        DownloadError={Download.Error}
        OnPauseDownload={Download.Pause}
        OnResumeDownload={Download.Resume}
        OnCancelDownload={Download.Cancel}
        OnStartDownload={(Target = Folder, IsInstall = false) => Download.Start(Target, IsInstall)}
        OnClearDownloadError={Download.ClearError}
      />
    );
  }

  if (ActivePage === "settings") {
    return (
      <SettingsPage
        IsSoundEnabled={Account.IsSoundEnabled}
        OnToggleSound={Actions.ToggleSound}
        IsBubbleBuildsEnabled={Account.IsBubbleBuildsEnabled}
        OnToggleBubbleBuilds={(Enabled) => Actions.Toggle("IsBubbleBuildsEnabled", Enabled)}
        IsLiquidGlassEnabled={Account.IsLiquidGlassEnabled}
        OnToggleLiquidGlass={(Enabled) => Actions.Toggle("IsLiquidGlassEnabled", Enabled)}
        IsMinimizeOnLaunch={Account.MinimizeOnLaunch}
        OnToggleMinimizeOnLaunch={(Enabled) => Actions.Toggle("MinimizeOnLaunch", Enabled)}
        IsKeepOnTopOnLaunch={Account.KeepOnTopOnLaunch}
        OnToggleKeepOnTopOnLaunch={(Enabled) => Actions.Toggle("KeepOnTopOnLaunch", Enabled)}
        Theme={Theme}
        OnSelectTheme={Actions.SelectTheme}
        ActiveSettingsTab={Props.SettingsTab}
        OnSettingsTabChange={Props.OnSettingsTabChange}
      />
    );
  }

  return null;
}
