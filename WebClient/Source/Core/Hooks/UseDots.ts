import { useEffect, useState } from "react";

const CycleMs = 500;
const MaxDots = 3;

export function UseDots(Active: boolean): string {
  const [Count, SetCount] = useState(1);

  useEffect(() => {
    SetCount(1);
    if (!Active) return;

    const Interval = setInterval(() => SetCount((Value) => (Value % MaxDots) + 1), CycleMs);
    return () => clearInterval(Interval);
  }, [Active]);

  return ".".repeat(Count);
}
