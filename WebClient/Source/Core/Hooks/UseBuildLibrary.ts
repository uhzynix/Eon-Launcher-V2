import { useEffect, useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { ForgetSplash, LoadSplash, ReadCachedSplash } from "../Services/BuildSplash";
import type { BuildLibrary, InstallFolderResult } from "../../Types/Library";

export function UseBuildLibrary(Folder: string, OnResolved: (Path: string) => void): BuildLibrary {
  const [Splash, SetSplash] = useState<string | null>(() => ReadCachedSplash(Folder));
  const [Installed, SetInstalled] = useState<boolean | null>(() => Boolean(Folder));
  const [Busy, SetBusy] = useState(false);
  const [Confirming, SetConfirming] = useState(false);
  const [Unsupported, SetUnsupported] = useState(false);

  useEffect(() => {
    if (!Folder) {
      SetSplash(null);
      SetInstalled(false);
      return;
    }

    let Cancelled = false;
    void LoadSplash(Folder).then((Value) => {
      if (!Cancelled && Value) SetSplash(Value);
    });

    return () => {
      Cancelled = true;
    };
  }, [Folder]);

  async function PickFolder(): Promise<string> {
    SetBusy(true);
    try {
      const Result = await Invoke<InstallFolderResult | null>("PickAndValidateInstallFolder");
      return Result?.Path ?? "";
    } catch {
      return "";
    } finally {
      SetBusy(false);
    }
  }

  async function Adopt(Path: string): Promise<boolean> {
    if (!Path) return false;

    SetUnsupported(false);
    SetConfirming(true);
    const Supported = await Invoke<boolean>("IsBuildInstalled", { Path }).catch(() => false);
    SetConfirming(false);

    if (!Supported) {
      SetInstalled(false);
      SetUnsupported(true);
      return false;
    }

    const Value = await LoadSplash(Path);
    if (Value) SetSplash(Value);
    SetInstalled(true);
    OnResolved(Path);
    return true;
  }

  function Forget() {
    ForgetSplash(Folder);
    SetSplash(null);
    SetInstalled(false);
    OnResolved("");
  }

  function Cancel() {
    SetConfirming(false);
    SetUnsupported(false);
    SetBusy(false);
  }

  return { Splash, Installed, Busy, Confirming, Unsupported, SetUnsupported, PickFolder, Adopt, Forget, Cancel, MarkInstalled: () => SetInstalled(true) };
}
