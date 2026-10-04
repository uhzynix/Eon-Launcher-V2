import type { CSSProperties } from "react";
import { LeaderStats, RankAccent } from "../../../Core/Configuration/LeaderboardStats";
import { UseGlassPointer } from "../../../Core/Hooks/UseGlassPointer";
import type { LeaderRowProps } from "../../../Types/Leaderboard";

export function LeaderRow({ Entry, Image, IsPending, IsSearch }: LeaderRowProps) {
  const Glass = UseGlassPointer();
  const IsTop = Boolean(Entry.Rank) && (Entry.Rank ?? 0) <= 3 && !IsSearch;
  const Accent = IsTop ? ({ "--rank": RankAccent[(Entry.Rank ?? 1) - 1] } as CSSProperties) : undefined;

  return (
    <div
      className={`lb-row${IsTop ? " top" : ""}${IsSearch ? " search" : ""}`}
      style={Accent}
      onPointerMove={Glass.OnPointerMove}
      onPointerLeave={Glass.OnPointerLeave}
    >
      <span className="lb-rank">{Entry.Rank ?? "-"}</span>
      {Image ? (
        <img className="lb-avatar" src={Image} alt="" />
      ) : IsPending ? (
        <div className="lb-avatar lb-avatar-loading">
          <span className="lb-avatar-spinner" />
        </div>
      ) : (
        <div className="lb-avatar">{Entry.Username.charAt(0).toUpperCase()}</div>
      )}
      <div className="lb-main">
        <span className="lb-name">{Entry.Username}</span>
        <span className="lb-level">Lvl {Entry.Level}</span>
      </div>
      <div className="lb-right">
        {LeaderStats.map((Stat) => (
          <span key={Stat.Key} className={`lb-stat${IsSearch ? " pill" : ""}`}>
            <img className="lb-stat-icon" src={Stat.Icon} alt="" />
            {Entry[Stat.Key].toLocaleString()}
          </span>
        ))}
      </div>
    </div>
  );
}
