import { StatIcons } from "./Assets";
import type { LeaderStat, LeaderboardFilter } from "../../Types/Leaderboard";

export const CosmeticSearchUrl = "https://fortnite-api.com/v2/cosmetics/br/search";
export const RankAccent = ["#ffd24a", "#cfd6e4", "#e08a4a"];
export const MaxRows = 50;

export const LeaderStats: LeaderStat[] = [
  { Key: "Kills", Label: "Kills", Icon: StatIcons.Kills, Filter: "kills" },
  { Key: "Victory", Label: "Wins", Icon: StatIcons.Wins, Filter: "wins" },
  { Key: "Points", Label: "Hype", Icon: StatIcons.Hype, Filter: "points" },
];

export const LeaderboardFilters: { Key: LeaderboardFilter; Label: string; Icon: string }[] = LeaderStats.map((Stat) => ({
  Key: Stat.Filter,
  Label: Stat.Label,
  Icon: Stat.Icon,
}));

export function FilterLabel(Filter: LeaderboardFilter): string {
  return LeaderboardFilters.find((Entry) => Entry.Key === Filter)?.Label ?? Filter;
}
