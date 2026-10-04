import { useEffect, useState } from "react";
import { IsTourCompleted } from "../Services/LauncherStorage";
import type { BootSequence } from "../../Types/Boot";
import type { SplashMode } from "../../Types/Splash";
import type { WelcomeSplash } from "./UseWelcomeSplash";

const StartupSplashDelay = 400;

export interface LauncherBoot {
  StartupSplash: boolean;
  SplashMode: SplashMode;
  TourOpen: boolean;
  SetSplashMode: (Mode: SplashMode) => void;
  SetTourOpen: (Open: boolean) => void;
}

export function UseLauncherBoot(Boot: BootSequence, Welcome: WelcomeSplash): LauncherBoot {
  const [StartupSplash, SetStartupSplash] = useState(true);
  const [SplashMode, SetSplashMode] = useState<SplashMode>("loading");
  const [TourOpen, SetTourOpen] = useState(false);

  useEffect(() => {
    if (!StartupSplash || !Boot.Booted || Boot.ErrorMessage) return;

    Boot.MarkReady();
    const Timer = window.setTimeout(() => {
      SetStartupSplash(false);
      if (!Boot.LoggedIn) return;

      SetSplashMode("welcome");
      Welcome.Begin(() => SetTourOpen(Boot.ShouldOfferTour && !IsTourCompleted()));
    }, StartupSplashDelay);

    return () => window.clearTimeout(Timer);
  }, [StartupSplash, Boot.Booted, Boot.ErrorMessage, Boot.LoggedIn]);

  return { StartupSplash, SplashMode, TourOpen, SetSplashMode, SetTourOpen };
}
