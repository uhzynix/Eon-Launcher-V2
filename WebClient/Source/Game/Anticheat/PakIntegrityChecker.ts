import { Invoke } from "../../Core/Bridge/Bridge";

export function CheckIntegrity(Path: string, IsBubbleBuildsEnabled: boolean): Promise<boolean> {
  return Invoke<boolean>("CheckIntegrity", { Path, BubbleBuilds: IsBubbleBuildsEnabled });
}

export function DownloadRequiredFiles(Path: string, IsBubbleBuildsEnabled: boolean): Promise<void> {
  return Invoke("DownloadRequiredFiles", { Path, BubbleBuilds: IsBubbleBuildsEnabled });
}
