import { useEffect, useState } from "react";
import { Invoke } from "../Bridge/Bridge";

const RefreshInterval = 30000;

export function UsePlayerCount(): number | null {
  const [PlayersOnline, SetPlayersOnline] = useState<number | null>(null);

  useEffect(() => {
    let Cancelled = false;

    const Load = async () => {
      try {
        const Count = await Invoke<number>("FetchPlayerCount");
        if (!Cancelled) SetPlayersOnline(Count);
      } catch {
      }
    };

    void Load();
    const Interval = setInterval(() => void Load(), RefreshInterval);

    return () => {
      Cancelled = true;
      clearInterval(Interval);
    };
  }, []);

  return PlayersOnline;
}
