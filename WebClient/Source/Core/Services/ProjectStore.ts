import { Invoke } from "../Bridge/Bridge";
import type { ProjectInfo } from "../../Types/Project";

let Current: ProjectInfo;

export function Project(): ProjectInfo {
  return Current;
}

export async function PrimeProject(): Promise<void> {
  Current = await Invoke<ProjectInfo>("GetProjectInfo");
}
