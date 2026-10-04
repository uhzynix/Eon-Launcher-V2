import { useCallback, useEffect, useRef, useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { GetStatus, StatusPriority } from "../Services/ServerStatus";
import { PrimePlaylistNames } from "../Services/PlaylistNames";
import { Project } from "../Services/ProjectStore";
import type { PhaseFilter, RegionFilter, ServerEntry } from "../../Types/ServerStatus";

const PollInterval = 10000;

function MatchesRegion(Server: ServerEntry, Region: RegionFilter): boolean {
  if (!Region) return true;
  return Region === "NA" ? Server.Region.includes("NA") : Server.Region === Region;
}

function MatchesPhase(Server: ServerEntry, Phase: PhaseFilter): boolean {
  if (Phase === "joinable") return Server.Joinable && !Server.MatchStarted;
  if (Phase === "ingame") return Server.MatchStarted;
  return true;
}

export interface ServerStatus {
  Status: "loading" | "ok" | "error";
  Visible: ServerEntry[];
  JoinableCount: number;
  InGameCount: number;
  Region: RegionFilter;
  Phase: PhaseFilter;
  SetRegion: (Value: RegionFilter) => void;
  SetPhase: (Value: PhaseFilter) => void;
  Reload: () => void;
}

export function UseServerStatus(): ServerStatus {
  const [Status, SetStatus] = useState<"loading" | "ok" | "error">("loading");
  const [Servers, SetServers] = useState<ServerEntry[]>([]);
  const [Region, SetRegion] = useState<RegionFilter>("");
  const [Phase, SetPhase] = useState<PhaseFilter>("");
  const Polling = useRef(false);

  const Reload = useCallback(() => {
    if (Polling.current) return;
    Polling.current = true;

    PrimePlaylistNames()
      .then(() => Invoke<string>("FetchRemotePage", { Url: Project().ServerStatusURL }))
      .then((Text) => {
        const Payload = JSON.parse(Text);
        SetServers(Array.isArray(Payload?.servers) ? Payload.servers : []);
        SetStatus("ok");
      })
      .catch(() => SetStatus("error"))
      .finally(() => {
        Polling.current = false;
      });
  }, []);

  useEffect(() => {
    Reload();
    const Interval = setInterval(Reload, PollInterval);
    return () => clearInterval(Interval);
  }, [Reload]);

  const Visible = Servers
    .filter((Server) => Server.Standby !== true)
    .filter((Server) => MatchesRegion(Server, Region))
    .filter((Server) => MatchesPhase(Server, Phase))
    .sort((Left, Right) => {
      const Difference = StatusPriority[GetStatus(Left).Class] - StatusPriority[GetStatus(Right).Class];
      if (Difference !== 0) return Difference;
      return Left.Region.localeCompare(Right.Region) || Left.Playlist.localeCompare(Right.Playlist);
    });

  return {
    Status,
    Visible,
    JoinableCount: Visible.filter((Server) => Server.Joinable && !Server.MatchStarted).length,
    InGameCount: Visible.filter((Server) => Server.MatchStarted && Server.matchStatus !== "ended" && Server.matchStatus !== "restarting").length,
    Region,
    Phase,
    SetRegion,
    SetPhase,
    Reload,
  };
}
