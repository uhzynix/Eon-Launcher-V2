import { useEffect, useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { AccountFromSettings, EmptyAccount, type Account, type StoredSettings } from "../Configuration/AccountSettings";
import { DefaultThemeId, IsValidThemeId, type ThemeId } from "../Configuration/Themes";
import { GetCachedTheme } from "../Services/LauncherStorage";
import { SetSoundEnabled } from "../Services/SoundEffects";
import { TryAutoLogin } from "../Services/AutoLogin";
import type { BootSequence } from "../../Types/Boot";

export function UseBootSequence(): BootSequence {
  const [Booted, SetBooted] = useState(false);
  const [Attempt, SetAttempt] = useState(0);
  const [Stage, SetStage] = useState("Starting up");
  const [Progress, SetProgress] = useState(0);
  const [ErrorMessage, SetErrorMessage] = useState<string | undefined>(undefined);
  const [LoginNotice, SetLoginNotice] = useState("");
  const [LoggedIn, SetLoggedIn] = useState(false);
  const [Account, SetAccount] = useState<Account>(EmptyAccount);
  const [Theme, SetTheme] = useState<ThemeId>(() => {
    const Cached = GetCachedTheme();
    return IsValidThemeId(Cached) ? Cached : DefaultThemeId;
  });
  const [Folder, SetFolder] = useState("");
  const [ShouldOfferTour, SetShouldOfferTour] = useState(false);

  useEffect(() => {
      SetErrorMessage(undefined);
      SetStage("Getting things ready");
      SetProgress(10);

      Invoke<StoredSettings>("LoadSettings")
        .then(async (Settings) => {
          SetStage("Applying your settings");
          SetProgress(30);

          const Loaded = AccountFromSettings(Settings);
          SetFolder(Settings?.FortnitePath ?? "");
          SetAccount(Loaded);
          SetSoundEnabled(Loaded.IsSoundEnabled);
          SetTheme(IsValidThemeId(Settings?.Theme) ? Settings.Theme : DefaultThemeId);

          SetStage("Checking for updates");
          SetProgress(50);
          const Result = await TryAutoLogin(Loaded);
          if (!Result) return;

          SetStage("Signing you in");
          SetProgress(70);

          if (!Result.Signed) {
            SetLoginNotice(Result.Notice);
            return;
          }

          SetAccount((Previous) => ({
            ...Previous,
            Email: Result.Email ?? Previous.Email,
            Username: Result.Username ?? Previous.Username,
            SkinUrl: Result.SkinUrl ?? Previous.SkinUrl,
          }));
          SetLoggedIn(true);
          SetShouldOfferTour(!Settings?.FortnitePath);
        })
        .catch((Error) => SetErrorMessage((Current) => Current ?? String(Error)))
        .finally(() => {
          SetStage("Almost there");
          SetProgress(90);
          SetBooted(true);
        });
  }, [Attempt]);

  function MarkReady() {
    SetStage("Ready");
    SetProgress(100);
  }

  function Retry() {
    SetErrorMessage(undefined);
    SetBooted(false);
    SetAttempt((Value) => Value + 1);
  }

  return { Booted, Stage, Progress, ErrorMessage, LoginNotice, LoggedIn, Account, Theme, Folder, ShouldOfferTour, SetAccount, SetTheme, SetFolder, SetLoggedIn, MarkReady, Retry };
}
