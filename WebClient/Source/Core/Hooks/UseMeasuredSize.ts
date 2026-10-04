import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { CardSize } from "../Services/TourGeometry";

export function UseMeasuredSize(Target: RefObject<HTMLElement | null>, Key: number, Fallback: CardSize): CardSize {
  const Sizes = useRef<Map<number, CardSize>>(new Map());
  const [, Redraw] = useState(0);

  useLayoutEffect(() => {
    const Element = Target.current;
    if (!Element) return;

    const Measure = () => {
      const Rect = Element.getBoundingClientRect();
      if (Rect.width === 0 || Rect.height === 0) return;
      Sizes.current.set(Key, { width: Rect.width, height: Rect.height });
      Redraw((Value) => Value + 1);
    };

    Measure();
    const Observer = new ResizeObserver(Measure);
    Observer.observe(Element);
    return () => Observer.disconnect();
  }, [Key]);

  return Sizes.current.get(Key) ?? Fallback;
}
