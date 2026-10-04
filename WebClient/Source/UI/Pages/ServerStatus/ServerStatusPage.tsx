import { PlayClick } from "../../../Core/Services/SoundEffects";
import { UseServerStatus } from "../../../Core/Hooks/UseServerStatus";
import { UsePagination } from "../../../Core/Hooks/UsePagination";
import { RefreshIcon } from "../../Controls/Icons/ShopIcons";
import { ServerCard } from "./ServerCard";
import { ServerFilters } from "./ServerFilters";
import { ServerPagination } from "./ServerPagination";

const ServersPerPage = 4;

export function ServerStatusPage() {
  const Servers = UseServerStatus();
  const Pages = UsePagination(Servers.Visible, ServersPerPage, `${Servers.Region}-${Servers.Phase}-${Servers.Visible.length}`);

  function Refresh() {
    PlayClick();
    Servers.Reload();
  }

  return (
    <div className="serverstatus">
      <div className="shop-bar">
        <div>
          <h2 className="shop-title">Server Status</h2>
        </div>
        <div className="shop-bar-actions">
          <button className="icon-button" aria-label="Refresh" onClick={Refresh}>
            <RefreshIcon />
          </button>
        </div>
      </div>

      <ServerFilters
        Summary={`${Servers.Visible.length} servers (${Servers.JoinableCount} joinable, ${Servers.InGameCount} in-game)`}
        Region={Servers.Region}
        Phase={Servers.Phase}
        OnRegion={Servers.SetRegion}
        OnPhase={Servers.SetPhase}
      />

      {Servers.Status === "loading" && (
        <div className="shop-center">
          <div className="splash-spinner" />
        </div>
      )}

      {Servers.Status === "error" && (
        <div className="shop-center">
          <p className="muted">Server status could not be loaded right now.</p>
          <button className="primary" onClick={Refresh}>Try again</button>
        </div>
      )}

      {Servers.Status === "ok" && Servers.Visible.length === 0 && (
        <p className="muted ss-empty">No servers are up right now.</p>
      )}

      {Servers.Status === "ok" && Servers.Visible.length > 0 && (
        <div className="ss-list">
          {Pages.Items.map((Server) => (
            <ServerCard key={Server.ServerId} Server={Server} />
          ))}
        </div>
      )}

      {Servers.Status === "ok" && Pages.PageCount > 1 && (
        <ServerPagination Page={Pages.Page} PageCount={Pages.PageCount} OnPrevious={Pages.Previous} OnNext={Pages.Next} />
      )}
    </div>
  );
}
