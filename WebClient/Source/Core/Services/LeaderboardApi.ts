import { Invoke } from "../Bridge/Bridge";
import { CosmeticSearchUrl, MaxRows } from "../Configuration/LeaderboardStats";
import { Project } from "./ProjectStore";
import type { LeaderEntry, LeaderboardFilter } from "../../Types/Leaderboard";

export async function FetchAvatar(CosmeticId?: string): Promise<string | null> {
  if (!CosmeticId) return null;

  try {
    const Response = await fetch(`${CosmeticSearchUrl}?id=${encodeURIComponent(CosmeticId)}`);
    const Payload = await Response.json();
    return Payload?.data?.images?.icon ?? null;
  } catch {
    return null;
  }
}

export async function FetchRankings(Filter: LeaderboardFilter): Promise<LeaderEntry[]> {
  const Text = await Invoke<string>("FetchRemotePage", { Url: `${Project().LeaderboardURL}?filter=${Filter}` });
  const Payload = JSON.parse(Text);
  const Data: LeaderEntry[] = Payload?.Success && Array.isArray(Payload.Data) ? Payload.Data : [];

  return Data.slice(0, MaxRows).map((Entry, Index) => ({ ...Entry, Rank: Index + 1 }));
}

export async function FetchPlayer(Name: string): Promise<LeaderEntry | null> {
  const Text = await Invoke<string>("FetchRemotePage", { Url: `${Project().LeaderboardURL}?username=${encodeURIComponent(Name)}` });
  const Payload = JSON.parse(Text);
  const Found = Payload?.UserSearch;

  if (!Payload?.Success || !Found?.Found || !Found.UserData) return null;

  return { ...Found.UserData, Rank: Found.Rank ?? 0 };
}
