import { useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { PlayClick, PlayConfirm } from "../Services/SoundEffects";
import { UseBuildLibrary } from "./UseBuildLibrary";
import type { GameAction } from "../Configuration/LibraryActions";
import type { BuildLibrary } from "../../Types/Library";

export interface LibraryFlow {
  Library: BuildLibrary;
  Action: GameAction | null;
  ImportOpen: boolean;
  ImportPath: string;
  SetAction: (Value: GameAction | null) => void;
  SetImportOpen: (Value: boolean) => void;
  OpenImport: () => void;
  BrowseImport: () => void;
  ConfirmImport: () => void;
  ChangePath: () => void;
  RunAction: () => Promise<void>;
}

export function UseLibraryFlow(Folder: string, OnResolved: (Path: string) => void): LibraryFlow {
  const Library = UseBuildLibrary(Folder, OnResolved);
  const [Action, SetAction] = useState<GameAction | null>(null);
  const [ImportOpen, SetImportOpen] = useState(false);
  const [ImportPath, SetImportPath] = useState("");

  async function ChangePath() {
    PlayClick();
    const Picked = await Library.PickFolder();
    if (Picked && Picked !== Folder) await Library.Adopt(Picked);
  }

  async function BrowseImport() {
    PlayClick();
    const Picked = await Library.PickFolder();
    if (Picked) SetImportPath(Picked);
  }

  async function ConfirmImport() {
    PlayConfirm();
    SetImportOpen(false);
    await Library.Adopt(ImportPath);
  }

  function OpenImport() {
    PlayClick();
    SetImportPath("");
    SetImportOpen(true);
  }

  async function RunAction() {
    PlayConfirm();
    SetAction(null);

    await Invoke("UninstallGame", { Path: Folder }).catch(() => {});
    OnResolved("");
  }

  return {
    Library,
    Action,
    ImportOpen,
    ImportPath,
    SetAction,
    SetImportOpen,
    OpenImport,
    BrowseImport: () => void BrowseImport(),
    ConfirmImport: () => void ConfirmImport(),
    ChangePath: () => void ChangePath(),
    RunAction,
  };
}
