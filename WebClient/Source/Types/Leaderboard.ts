export interface LeaderEntry {
  Username: string;
  Kills: number;
  Victory: number;
  Level: number;
  Points: number;
  AthenaCharacter?: { CosmeticId: string };
  Rank?: number;
}

export type LeaderboardFilter = "points" | "kills" | "wins";

export interface LeaderStat {
  Key: "Kills" | "Victory" | "Points";
  Label: string;
  Icon: string;
  Filter: LeaderboardFilter;
}

export interface LeaderRowProps {
  Entry: LeaderEntry;
  Image?: string;
  IsPending: boolean;
  IsSearch: boolean;
}
