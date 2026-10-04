import { PlayClick } from "../../../Core/Services/SoundEffects";
import { UseLeaderboard } from "../../../Core/Hooks/UseLeaderboard";
import { RefreshIcon } from "../../Controls/Icons/ShopIcons";
import { LeaderSearch } from "./LeaderSearch";
import { LeaderFilters } from "./LeaderFilters";
import { LeaderRow } from "./LeaderRow";

export function LeaderboardPage() {
  const Board = UseLeaderboard();
  const ShowList = !Board.SearchResult;

  function Refresh() {
    PlayClick();
    if (Board.SearchResult) Board.ClearSearch();
    else Board.Load(Board.Filter);
  }

  return (
    <div className="leaderboard">
      <div className="shop-bar">
        <div>
          <h2 className="shop-title">Leaderboard</h2>
        </div>
        <div className="shop-bar-actions">
          <button className="icon-button" aria-label="Refresh" onClick={Refresh}>
            <RefreshIcon />
          </button>
        </div>
      </div>

      <LeaderSearch OnSearch={Board.Search} OnClear={Board.ClearSearch} />
      <LeaderFilters Active={Board.Filter} OnSelect={Board.Load} />

      {Board.SearchState === "loading" && <p className="muted lb-search-status">Searching...</p>}
      {Board.SearchState === "notfound" && <p className="muted lb-search-status">Player not found.</p>}

      {Board.SearchResult && (
        <LeaderRow
            Entry={Board.SearchResult}
            Image={Board.Images[Board.SearchResult.Username]}
            IsPending={Board.Pending.has(Board.SearchResult.Username)}
            IsSearch
        />
      )}

      {ShowList && Board.Status === "loading" && (
        <div className="shop-center">
          <div className="splash-spinner" />
        </div>
      )}

      {ShowList && Board.Status === "error" && (
        <div className="shop-center">
          <p className="muted">The leaderboard could not be loaded right now.</p>
          <button className="primary" onClick={() => { PlayClick(); Board.Load(Board.Filter); }}>Try again</button>
        </div>
      )}

      {ShowList && Board.Status === "ok" && (
        <div className="lb-list">
          {Board.Entries.map((Entry) => (
            <LeaderRow
              key={Entry.Username}
              Entry={Entry}
              Image={Board.Images[Entry.Username]}
              IsPending={Board.Pending.has(Entry.Username)}
              IsSearch={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
