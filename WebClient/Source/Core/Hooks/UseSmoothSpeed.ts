import { useEffect, useRef, useState } from "react";

const UpdateInterval = 1000;

export function UseSmoothSpeed(Speed: number): number {
  const Latest = useRef(Speed);
  const [Displayed, SetDisplayed] = useState(Speed);
  Latest.current = Speed;

  useEffect(() => {
    const Interval = setInterval(() => SetDisplayed(Latest.current), UpdateInterval);
    return () => clearInterval(Interval);
  }, []);

  return Displayed;
}
