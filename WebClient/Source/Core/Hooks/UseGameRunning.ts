import { useCallback, useEffect, useRef, useState } from "react";
import { Invoke } from "../Bridge/Bridge";

const PollInterval = 3000;

export interface GameRunningState {
  IsRunning: boolean;
  Refresh: () => void;
}

export function UseGameRunning(): GameRunningState {
  const [IsRunning, SetIsRunning] = useState(false);
  const Cancelled = useRef(false);

  const Refresh = useCallback(() => {
    void Invoke<boolean>("IsGameRunning")
      .then((Running) => {
        if (!Cancelled.current) SetIsRunning(Running);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    Cancelled.current = false;
    Refresh();
    const Interval = setInterval(Refresh, PollInterval);

    return () => {
      Cancelled.current = true;
      clearInterval(Interval);
    };
  }, [Refresh]);

  return { IsRunning, Refresh };
}
