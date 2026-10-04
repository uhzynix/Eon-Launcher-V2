import { Invoke } from "../Bridge/Bridge";
import { Project } from "./ProjectStore";
import type { PlaylistTable } from "../../Types/ServerStatus";

const BranchPattern = /includes\(\s*["']([^"']+)["']\s*\)\s*\?\s*["']([^"']*)["']/g;

let Modes: PlaylistTable = [];
let Types: PlaylistTable = [];
let Loaded = false;

function ReadBlock(Script: string, Name: string): PlaylistTable {
  const Start = Script.indexOf(`const ${Name} =`);
  if (Start < 0) return [];

  const End = Script.indexOf(";", Start);
  if (End < 0) return [];

  const Pairs: PlaylistTable = [];
  for (const Match of Script.slice(Start, End).matchAll(BranchPattern)) {
    if (Match[2]) Pairs.push([Match[1].toLowerCase(), Match[2]]);
  }

  return Pairs;
}

export function MatchName(Playlist: string, Names: PlaylistTable): string {
  const Lower = Playlist.toLowerCase();
  return Names.find(([Token]) => Lower.includes(Token))?.[1] ?? "";
}

export function PlaylistName(Playlist: string): string {
  return `${MatchName(Playlist, Types)} ${MatchName(Playlist, Modes)}`.trim() || Playlist;
}

export async function PrimePlaylistNames(): Promise<void> {
  if (Loaded) return;
  Loaded = true;

  const Script = await Invoke<string>("FetchRemotePage", { Url: Project().PlaylistNamesURL });

  Modes = ReadBlock(Script, "Mode");
  Types = ReadBlock(Script, "Type");
}
