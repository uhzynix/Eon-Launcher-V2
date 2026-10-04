import { useEffect, useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { IsTourCompleted, MarkTourCompleted } from "../Services/LauncherStorage";
import { UseBootSequence } from "./UseBootSequence";
import { UseLauncherBoot } from "./UseLauncherBoot";
import { UseAccountActions } from "./UseAccountActions";
import { UseAuxiliaryDownload } from "./UseAuxiliaryDownload";
import { UseBuildDownload } from "./UseBuildDownload";
import { UseGameRunning } from "./UseGameRunning";
import { UseLaunchButton } from "./UseLaunchButton";
import { UseLauncherTheme } from "./UseLauncherTheme";
import { UsePageHistory } from "./UsePageHistory";
import { UsePlayerCount } from "./UsePlayerCount";
import { UsePlayFlow } from "./UsePlayFlow";
import { UseTrailers } from "./UseTrailers";
import { UseWelcomeSplash } from "./UseWelcomeSplash";
import { UseWindowReveal } from "./UseWindowReveal";
import type { LoggedInAccount } from "../../Types/Authentication";
import type { SettingsTab } from "../../Types/Settings";

export function UseLauncherShell() {
  const Boot = UseBootSequence();
  const Actions = UseAccountActions(Boot);
  const History = UsePageHistory("play");
  const Auxiliary = UseAuxiliaryDownload();
  const Download = UseBuildDownload();
  const Game = UseGameRunning();
  const Welcome = UseWelcomeSplash();
  const PlayersOnline = UsePlayerCount();
  const Play = UsePlayFlow(Boot.Account, Boot.Folder, Auxiliary, Game);
  const Launch = UseLaunchButton(Boot.Folder, Play, Game);

  const Launcher = UseLauncherBoot(Boot, Welcome);
  const IsPlayPage = History.ActivePage === "play";
  const ShellReady = Boot.Booted && !Launcher.StartupSplash && Boot.LoggedIn;
  const Trailers = UseTrailers(IsPlayPage, ShellReady);

  UseLauncherTheme(Boot.Theme, Boot.Account.IsLiquidGlassEnabled);
  UseWindowReveal();

  useEffect(() => {
    if (!Download.CompletedFolder) return;
    Actions.ResolveFolder(Download.CompletedFolder);
    Download.ClearCompletedFolder();
  }, [Download.CompletedFolder]);

  function SignIn(Logged: LoggedInAccount) {
    Actions.Update({
      Email: Logged.Email,
      Password: Logged.Password,
      Username: Logged.Username,
      SkinUrl: Logged.SkinUrl,
      RememberMe: Logged.RememberMe,
    });
    Launcher.SetSplashMode("welcome");
    Welcome.Begin(() => {
      Boot.SetLoggedIn(true);
      Launcher.SetTourOpen(!Boot.Folder && !IsTourCompleted());
    });
  }

  function SignOut() {
    void Invoke("SignOut");
    Boot.SetAccount({ ...Boot.Account, Password: "" });
    Boot.SetLoggedIn(false);
    History.Reset();
  }

  function CloseTour() {
    MarkTourCompleted();
    Launcher.SetTourOpen(false);
  }

  function RetryBoot() {
    Launcher.SetSplashMode("loading");
    Boot.Retry();
  }

  return {
    Boot, Actions, History, Auxiliary, Download, Game, Launch, Welcome, Launcher, Trailers, Play, PlayersOnline, IsPlayPage, ShellReady,
    SignIn, SignOut, CloseTour, RetryBoot,
  };
}

export function UseSettingsTab() {
  return useState<SettingsTab>("General");
}
