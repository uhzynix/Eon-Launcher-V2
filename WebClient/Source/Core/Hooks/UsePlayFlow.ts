import { MinimizeWindow } from "../Bridge/Bridge";
import { PlayConfirm } from "../Services/SoundEffects";
import { CheckIntegrity, DownloadRequiredFiles } from "../../Game/Anticheat/PakIntegrityChecker";
import { LaunchGame } from "../../Game/Client/GameLauncher";
import type { Account } from "../Configuration/AccountSettings";
import type { AuxiliaryDownload } from "./UseAuxiliaryDownload";
import type { GameRunningState } from "./UseGameRunning";

const VerifyFailure = "The required build files could not be verified. Please try Play again to repair them.";

export function UsePlayFlow(Account: Account, Folder: string, Auxiliary: AuxiliaryDownload, Game: GameRunningState): () => Promise<void> {
  return async function Play() {
    if (!Folder) return;

    PlayConfirm();
    Auxiliary.Begin();

    try {
      await DownloadRequiredFiles(Folder, Account.IsBubbleBuildsEnabled);

      if (!(await CheckIntegrity(Folder, Account.IsBubbleBuildsEnabled))) {
        throw new Error(VerifyFailure);
      }

      await LaunchGame(Folder, Account.Email, Account.Password);
      Game.Refresh();
      if (Account.MinimizeOnLaunch) await MinimizeWindow();
    } finally {
      Auxiliary.End();
    }
  };
}
