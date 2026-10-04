import { useEffect, useState } from "react";
import { PlayConfirm } from "../Services/SoundEffects";
import { StopGame } from "../../Game/Client/GameLauncher";
import type { GameRunningState } from "./UseGameRunning";

const OptimisticWindow = 8000;

export interface LaunchButton {
  Label: string;
  Launching: boolean;
  Stopping: boolean;
  GameRunning: boolean;
  Failed: boolean;
  Launch: () => void;
  Stop: (Silent?: boolean) => Promise<void>;
}

export function UseLaunchButton(Folder: string, OnPlay: () => Promise<void>, Game: GameRunningState): LaunchButton {
  const [Launching, SetLaunching] = useState(false);
  const [Stopping, SetStopping] = useState(false);
  const [JustLaunched, SetJustLaunched] = useState(false);
  const [Failed, SetFailed] = useState(false);
  const [Label, SetLabel] = useState("Launch");

  const GameRunning = Game.IsRunning || JustLaunched;

  useEffect(() => {
    if (!JustLaunched) return;
    if (Game.IsRunning) {
      SetJustLaunched(false);
      return;
    }

    const Timer = window.setTimeout(() => SetJustLaunched(false), OptimisticWindow);
    return () => window.clearTimeout(Timer);
  }, [JustLaunched, Game.IsRunning]);

  useEffect(() => {
    if (Launching || Failed) return;
    SetLabel(Folder ? "Launch" : "No Build Found");
  }, [Folder, Launching, Failed]);

  async function Launch() {
    if (Launching || Stopping) return;

    PlayConfirm();
    SetLaunching(true);
    SetFailed(false);
    SetLabel("Preparing");

    try {
      if (!Folder) throw new Error("You haven't selected a Fortnite installation path yet.");
      await OnPlay();
      SetLabel("Launch");
      SetJustLaunched(true);
    } catch {
      SetFailed(true);
      SetLabel("Try Again");
    } finally {
      SetLaunching(false);
    }
  }

  async function Stop(Silent = false) {
    if (!Silent) PlayConfirm();
    SetStopping(true);

    try {
      await StopGame();
    } finally {
      SetJustLaunched(false);
      SetStopping(false);
      Game.Refresh();
    }
  }

  return { Label, Launching, Stopping, GameRunning, Failed, Launch: () => void Launch(), Stop };
}
