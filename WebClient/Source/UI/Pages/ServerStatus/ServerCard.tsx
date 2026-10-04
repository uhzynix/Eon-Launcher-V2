import { GetDisplayCount, GetPlayerLabel, GetStatus } from "../../../Core/Services/ServerStatus";
import { PlaylistName } from "../../../Core/Services/PlaylistNames";
import type { ServerEntry } from "../../../Types/ServerStatus";

interface ServerCardProps {
  Server: ServerEntry;
}

export function ServerCard({ Server }: ServerCardProps) {
  const Status = GetStatus(Server);
  const Count = GetDisplayCount(Server, Status);
  const Max = Server.MaxPlayers || 100;
  const Percentage = Math.min((Count / Max) * 100, 100);
  const Label = GetPlayerLabel(Server, Status, Count);

  return (
    <div className={`ss-card status-${Status.Class}${Status.Full ? " status-full" : ""}`}>
      <div className="ss-row">
        <div className="ss-top">
          <span className={`ss-badge ${Status.Class}${Status.Full ? " full" : ""}`}>{Status.Text}</span>
          <span className="ss-sep">&bull;</span>
          <span className="ss-playlist">{PlaylistName(Server.Playlist)}</span>
          <span className="ss-region">{Server.Region}</span>
        </div>
        <span className="ss-count">
          <span className="ss-num">{Count}</span>
          <span className="ss-max">/{Max}</span>
          {Label && <span className="ss-label"> {Label}</span>}
        </span>
      </div>
      {Status.Subtitle && <div className="ss-subtitle">{Status.Subtitle}</div>}
      <div className="ss-bar">
        <div className={`ss-bar-fill ${Status.Class}`} style={{ width: `${Percentage}%` }} />
      </div>
    </div>
  );
}
