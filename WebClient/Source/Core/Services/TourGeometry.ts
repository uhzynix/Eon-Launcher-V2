export interface HighlightBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface CardSize {
  width: number;
  height: number;
}

export interface CardPosition {
  top: number;
  left: number;
}

const Gap = 18;
const Margin = 18;

export function MeasureTargets(Selectors: string[]): DOMRect[] {
  return Selectors
    .map((Selector) => document.querySelector<HTMLElement>(Selector))
    .filter((Element): Element is HTMLElement => Element !== null)
    .map((Element) => Element.getBoundingClientRect())
    .filter((Rect) => Rect.width > 0 && Rect.height > 0);
}

export function AreRectsStable(Previous: DOMRect[], Next: DOMRect[]): boolean {
  if (Previous.length !== Next.length) return false;

  return Next.every((Rect, Index) => {
    const Before = Previous[Index];
    return (
      Math.abs(Rect.left - Before.left) < 1 &&
      Math.abs(Rect.top - Before.top) < 1 &&
      Math.abs(Rect.right - Before.right) < 1 &&
      Math.abs(Rect.bottom - Before.bottom) < 1
    );
  });
}

export function UnionBounds(Rects: DOMRect[]): HighlightBounds | null {
  if (Rects.length === 0) return null;

  return {
    left: Math.min(...Rects.map((Rect) => Rect.left)),
    top: Math.min(...Rects.map((Rect) => Rect.top)),
    right: Math.max(...Rects.map((Rect) => Rect.right)),
    bottom: Math.max(...Rects.map((Rect) => Rect.bottom)),
  };
}

function Clamp(Value: number, Lowest: number, Highest: number): number {
  return Math.max(Lowest, Math.min(Value, Highest));
}

export function PlaceCard(Bounds: HighlightBounds | null, Size: CardSize): CardPosition {
  const ViewportWidth = window.innerWidth;
  const ViewportHeight = window.innerHeight;
  const Centered = {
    top: Math.max(Margin, (ViewportHeight - Size.height) / 2),
    left: Math.max(Margin, (ViewportWidth - Size.width) / 2),
  };

  if (!Bounds) return Centered;

  const SpaceBelow = ViewportHeight - Bounds.bottom;
  const SpaceAbove = Bounds.top;
  const SpaceRight = ViewportWidth - Bounds.right;
  const SpaceLeft = Bounds.left;
  const AlignedLeft = Clamp(Bounds.left, Margin, ViewportWidth - Size.width - Margin);
  const AlignedTop = Clamp(Bounds.top, Margin, ViewportHeight - Size.height - Margin);

  let Position = Centered;

  if (SpaceBelow >= Size.height + Gap + Margin) {
    Position = { top: Bounds.bottom + Gap, left: AlignedLeft };
  } else if (SpaceAbove >= Size.height + Gap + Margin) {
    Position = { top: Bounds.top - Gap - Size.height, left: AlignedLeft };
  } else if (SpaceRight >= Size.width + Gap + Margin) {
    Position = { top: AlignedTop, left: Bounds.right + Gap };
  } else if (SpaceLeft >= Size.width + Gap + Margin) {
    Position = { top: AlignedTop, left: Bounds.left - Gap - Size.width };
  } else {
    Position = {
      top: SpaceBelow >= SpaceAbove ? Bounds.bottom + Gap : Bounds.top - Gap - Size.height,
      left: AlignedLeft,
    };
  }

  return {
    top: Clamp(Position.top, Margin, ViewportHeight - Size.height - Margin),
    left: Clamp(Position.left, Margin, ViewportWidth - Size.width - Margin),
  };
}
