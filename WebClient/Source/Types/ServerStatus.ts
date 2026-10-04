export type PlaylistTable = [string, string][];

export interface ServerEntry {
  ServerId: string;
  ServerName: string;
  Region: string;
  Playlist: string;
  phase?: string;
  Joinable: boolean;
  MatchStarted: boolean;
  Joined: number;
  PlayersRemaining?: number;
  MaxPlayers: number;
  matchStatus?: string;
  Standby?: boolean;
}

export type StatusClass = "open" | "ingame" | "ended" | "restarting" | "closed";

export type RegionFilter = "" | "EU" | "NA";

export type PhaseFilter = "" | "joinable" | "ingame";

export interface StatusInfo {
  Text: string;
  Class: StatusClass;
  Full?: boolean;
  Subtitle: string | null;
}
