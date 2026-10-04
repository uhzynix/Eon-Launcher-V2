import { Invoke } from "../../Core/Bridge/Bridge";

export function IsGameRunning(): Promise<boolean> {
  return Invoke<boolean>("IsGameRunning");
}

export function LaunchGame(Path: string, Email: string, Password: string): Promise<void> {
  return Invoke("LaunchGame", { Path, Email, Password });
}

export function StopGame(): Promise<void> {
  return Invoke("StopGame");
}
