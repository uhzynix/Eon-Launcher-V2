import { useEffect, useState } from "react";

export function UseCountdown(DurationMs: number, Active: boolean): number {
  const [Remaining, SetRemaining] = useState(() => Math.ceil(DurationMs / 1000));

  useEffect(() => {
    if (!Active || !DurationMs) return;
    const Interval = setInterval(() => SetRemaining((Value) => Math.max(0, Value - 1)), 1000);
    return () => clearInterval(Interval);
  }, [Active, DurationMs]);

  return Remaining;
}
