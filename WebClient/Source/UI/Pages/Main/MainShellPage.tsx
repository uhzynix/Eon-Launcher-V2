import { createPortal } from "react-dom";
import { LauncherTour } from "../../Controls/Tour/LauncherTour";
import { LauncherDialog } from "../../Controls/Dialogs/LauncherDialog";
import { HomeTrailers, TrailerIndicator } from "../../Controls/Shell/HomeTrailers";
import { ShellLayout } from "./ShellLayout";
import { ShellPages } from "./ShellPages";
import { ShellSplash } from "./ShellSplash";
import { LoginPage } from "../Authentication/LoginPage";
import { UseLauncherShell, UseSettingsTab } from "../../../Core/Hooks/UseLauncherShell";

export default function MainShellPage() {
  const Shell = UseLauncherShell();
  const [SettingsTabValue, SetSettingsTabValue] = UseSettingsTab();
  const { Boot, History, Launcher, Trailers } = Shell;

  return (
    <>
      <main className="app-shell" onContextMenu={(Event) => Event.preventDefault()}>
        <HomeTrailers
          Visible={Shell.ShellReady}
          IsPlayPage={Shell.IsPlayPage}
          Active={Trailers.Active}
          OnEnded={(Index) => Trailers.SetActive(Index === 0 ? 1 : 0)}
        />
        {Boot.LoggedIn && (
          <ShellLayout
            History={History}
            Username={Boot.Account.Username}
            SkinUrl={Boot.Account.SkinUrl}
            PlayerCount={Shell.PlayersOnline}
            Auxiliary={Shell.Auxiliary}
            OnLogout={Shell.SignOut}
          >
            <ShellPages
              ActivePage={History.ActivePage}
              Account={Boot.Account}
              Folder={Boot.Folder}
              Theme={Boot.Theme}
              Actions={Shell.Actions}
              Download={Shell.Download}
              Game={Shell.Game}
              Launch={Shell.Launch}
              SettingsTab={SettingsTabValue}
              OnSettingsTabChange={SetSettingsTabValue}
              OnNavigate={History.Navigate}
              Downloading={Boolean(Shell.Download.Progress)}
              Preparing={Shell.Auxiliary.IsActive || Boolean(Shell.Download.Progress)}
            />
          </ShellLayout>
        )}
      </main>

      {Boot.Booted && !Launcher.StartupSplash && !Boot.LoggedIn && (
        <LoginPage RememberMe={Boot.Account.RememberMe} InitialStatus={Boot.LoginNotice} OnLoggedIn={Shell.SignIn} />
      )}

      <ShellSplash
        Boot={Boot}
        Welcome={Shell.Welcome}
        StartupSplash={Launcher.StartupSplash}
        Mode={Launcher.SplashMode}
        OnRetry={Shell.RetryBoot}
      />

      {Boot.LoggedIn && Shell.IsPlayPage && createPortal(<TrailerIndicator Active={Trailers.Active} OnSelect={Trailers.SetActive} />, document.body)}
      {Launcher.TourOpen && <LauncherTour OnClose={Shell.CloseTour} OnNavigate={History.Navigate} />}
      <LauncherDialog />
    </>
  );
}
