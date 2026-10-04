import { useCallback, useEffect, useRef, useState } from "react";
import { FetchAvatar, FetchPlayer, FetchRankings } from "../Services/LeaderboardApi";
import type { LeaderEntry, LeaderboardFilter } from "../../Types/Leaderboard";

export interface Leaderboard {
  Status: "loading" | "ok" | "error";
  Entries: LeaderEntry[];
  Filter: LeaderboardFilter;
  Images: Record<string, string>;
  Pending: Set<string>;
  SearchResult: LeaderEntry | null;
  SearchState: "idle" | "loading" | "notfound";
  Load: (Filter: LeaderboardFilter) => void;
  Search: (Name: string) => void;
  ClearSearch: () => void;
}

export function UseLeaderboard(): Leaderboard {
  const [Status, SetStatus] = useState<"loading" | "ok" | "error">("loading");
  const [Entries, SetEntries] = useState<LeaderEntry[]>([]);
  const [Filter, SetFilter] = useState<LeaderboardFilter>("points");
  const [Images, SetImages] = useState<Record<string, string>>({});
  const [Pending, SetPending] = useState<Set<string>>(new Set());
  const [SearchResult, SetSearchResult] = useState<LeaderEntry | null>(null);
  const [SearchState, SetSearchState] = useState<"idle" | "loading" | "notfound">("idle");
  const FirstLoad = useRef(true);
  const Cache = useRef<Record<string, string>>({});

  const ResolveAvatar = useCallback(async (Entry: LeaderEntry) => {
    if (!Cache.current[Entry.Username]) {
      const Image = await FetchAvatar(Entry.AthenaCharacter?.CosmeticId);

      if (Image) {
        Cache.current[Entry.Username] = Image;
        SetImages((Previous) => ({ ...Previous, [Entry.Username]: Image }));
      }
    }

    SetPending((Previous) => {
      if (!Previous.has(Entry.Username)) return Previous;
      const Next = new Set(Previous);
      Next.delete(Entry.Username);
      return Next;
    });
  }, []);

  const Load = useCallback((Next: LeaderboardFilter) => {
    SetStatus("loading");
    SetFilter(Next);

    FetchRankings(Next)
      .then(async (Rows) => {
        SetEntries(Rows);
        SetStatus("ok");
        SetPending(new Set(Rows.filter((Entry) => !Cache.current[Entry.Username]).map((Entry) => Entry.Username)));
        await Promise.all(Rows.map(ResolveAvatar));
      })
      .catch(() => SetStatus("error"));
  }, [ResolveAvatar]);

  const Search = useCallback((Name: string) => {
    const Term = Name.trim();
    if (!Term) return ClearSearch();

    SetSearchState("loading");

    FetchPlayer(Term)
      .then(async (Row) => {
        if (!Row) {
          SetSearchResult(null);
          SetSearchState("notfound");
          return;
        }

        SetSearchResult(Row);
        SetSearchState("idle");
        if (!Cache.current[Row.Username]) SetPending((Previous) => new Set(Previous).add(Row.Username));
        await ResolveAvatar(Row);
      })
      .catch(() => {
        SetSearchResult(null);
        SetSearchState("notfound");
      });
  }, [ResolveAvatar]);

  function ClearSearch() {
    SetSearchResult(null);
    SetSearchState("idle");
  }

  useEffect(() => {
    if (!FirstLoad.current) return;
    FirstLoad.current = false;
    Load("points");
  }, [Load]);

  return { Status, Entries, Filter, Images, Pending, SearchResult, SearchState, Load, Search, ClearSearch };
}
