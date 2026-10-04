import { useState } from "react";
import { Search, X } from "lucide-react";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { UseGlassPointer } from "../../../Core/Hooks/UseGlassPointer";

interface LeaderSearchProps {
  OnSearch: (Name: string) => void;
  OnClear: () => void;
}

export function LeaderSearch({ OnSearch, OnClear }: LeaderSearchProps) {
  const [Query, SetQuery] = useState("");
  const Glass = UseGlassPointer();

  function Clear() {
    PlayClick();
    SetQuery("");
    OnClear();
  }

  function Run() {
    PlayClick();
    OnSearch(Query);
  }

  return (
    <div className="lb-search" onPointerMove={Glass.OnPointerMove} onPointerLeave={Glass.OnPointerLeave}>
      <Search size={15} strokeWidth={2.2} />
      <input
        type="text"
        placeholder="Search player..."
        value={Query}
        onChange={(Event) => SetQuery(Event.target.value)}
        onKeyDown={(Event) => Event.key === "Enter" && Run()}
      />
      {Query && (
        <button className="lb-search-clear" aria-label="Clear" onClick={Clear}>
          <X size={15} strokeWidth={2.2} />
        </button>
      )}
      <button className="lb-search-btn" onClick={Run}>Search</button>
    </div>
  );
}
