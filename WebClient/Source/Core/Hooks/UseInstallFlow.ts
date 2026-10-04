import { useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { PlayClick, PlayConfirm } from "../Services/SoundEffects";

export interface InstallFlow {
  Open: boolean;
  Path: string;
  Begin: () => void;
  Close: () => void;
  Browse: () => void;
  Confirm: () => void;
}

export function UseInstallFlow(OnStart: (Folder: string) => void): InstallFlow {
  const [Open, SetOpen] = useState(false);
  const [Path, SetPath] = useState("");

  async function Browse() {
    PlayClick();
    const Folder = await Invoke<string | null>("PickBuildInstallFolder").catch(() => null);
    if (Folder) SetPath(Folder);
  }

  function Begin() {
    PlayClick();
    SetPath("");
    SetOpen(true);
  }

  function Confirm() {
    if (!Path) return;

    PlayConfirm();
    SetOpen(false);
    OnStart(Path);
  }

  return {
    Open,
    Path,
    Begin,
    Close: () => SetOpen(false),
    Browse: () => void Browse(),
    Confirm,
  };
}
