import { LeaderboardFilters } from "../../../Core/Configuration/LeaderboardStats";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { UseGlassPointer } from "../../../Core/Hooks/UseGlassPointer";
import type { LeaderboardFilter } from "../../../Types/Leaderboard";

interface LeaderFiltersProps {
  Active: LeaderboardFilter;
  OnSelect: (Filter: LeaderboardFilter) => void;
}

export function LeaderFilters({ Active, OnSelect }: LeaderFiltersProps) {
  const Glass = UseGlassPointer();

  return (
    <div className="lb-filters">
      {LeaderboardFilters.map((Filter) => (
        <button
          key={Filter.Key}
          className={`lb-filter${Active === Filter.Key ? " active" : ""}`}
          onPointerMove={Glass.OnPointerMove}
          onPointerLeave={Glass.OnPointerLeave}
          onClick={() => { PlayClick(); OnSelect(Filter.Key); }}
        >
          <img className="lb-filter-icon" src={Filter.Icon} alt="" />
          {Filter.Label}
        </button>
      ))}
    </div>
  );
}
