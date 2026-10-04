import type { ServerEntry, StatusClass, StatusInfo } from "../../Types/ServerStatus";

export const StatusPriority: Record<StatusClass, number> = {
  open: 0,
  ingame: 1,
  restarting: 2,
  ended: 3,
  closed: 4,
};

export function GetStatus(Server: ServerEntry): StatusInfo {
  const Max = Server.MaxPlayers || 100;

  if (Server.matchStatus === "ended") {
    return { Text: "ENDED", Class: "ended", Subtitle: "Game has ended, servers are restarting in 5 seconds." };
  }

  if (Server.matchStatus === "restarting") {
    return { Text: "RESTARTING", Class: "restarting", Subtitle: "Matches restarting and will be available shortly in 30 seconds." };
  }

  if (Server.MatchStarted) {
    return { Text: "IN-GAME", Class: "ingame", Subtitle: "Match in progress, new game will start soon after this one ends." };
  }

  if (Server.Joinable === false) {
    return { Text: "CLOSED", Class: "closed", Subtitle: null };
  }

  const IsFull = Server.Joined >= Max;
  const Subtitle = Server.Joined === 0
    ? "Server online, awaiting players in an empty lobby."
    : IsFull
      ? "Match is full, waiting for match to start."
      : "Server online, filling up the match with players in the pre-game lobby.";

  return { Text: IsFull ? "FULL" : "JOINABLE", Class: "open", Full: IsFull, Subtitle };
}

export function GetDisplayCount(Server: ServerEntry, Status: StatusInfo): number {
  if (Status.Class === "ended" || Status.Class === "restarting") return 0;
  if (Server.MatchStarted && Server.PlayersRemaining !== undefined) return Server.PlayersRemaining;
  return Server.Joined || 0;
}

export function GetPlayerLabel(Server: ServerEntry, Status: StatusInfo, Count: number): string {
  const IsSolo = Server.Playlist.toLowerCase().includes("solo");

  if (Server.MatchStarted && Status.Class !== "ended" && Status.Class !== "restarting") {
    return IsSolo ? "Players Left" : "Teams Left";
  }

  if (Status.Class === "open") return Count === 0 ? "Awaiting Players" : "Pre-Lobby";

  return "";
}
