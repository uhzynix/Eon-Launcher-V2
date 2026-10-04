import { PlayClick } from "../../../Core/Services/SoundEffects";
import type { PhaseFilter, RegionFilter } from "../../../Types/ServerStatus";

interface ServerFiltersProps {
  Summary: string;
  Region: RegionFilter;
  Phase: PhaseFilter;
  OnRegion: (Value: RegionFilter) => void;
  OnPhase: (Value: PhaseFilter) => void;
}

const Regions: RegionFilter[] = ["EU", "NA"];
const Phases: { Key: PhaseFilter; Label: string }[] = [
  { Key: "joinable", Label: "Joinable" },
  { Key: "ingame", Label: "In-Game" },
];

export function ServerFilters({ Summary, Region, Phase, OnRegion, OnPhase }: ServerFiltersProps) {
  return (
    <div className="ss-filters">
      <span className="lb-filter ss-summary-count">{Summary}</span>
      <span className="ss-filter-separator" aria-hidden="true">&bull;</span>
      {Regions.map((Value) => (
        <button
          key={Value}
          className={`lb-filter${Region === Value ? " active" : ""}`}
          onClick={() => { PlayClick(); OnRegion(Region === Value ? "" : Value); }}
        >
          Filter {Value}
        </button>
      ))}
      {Phases.map((Item) => (
        <button
          key={Item.Key}
          className={`lb-filter${Phase === Item.Key ? " active" : ""}`}
          onClick={() => { PlayClick(); OnPhase(Phase === Item.Key ? "" : Item.Key); }}
        >
          {Item.Label}
        </button>
      ))}
    </div>
  );
}
