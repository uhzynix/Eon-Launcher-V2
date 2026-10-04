import type { Pointer, Star } from "./AmbientTypes";

const FrameMs = 16.6667;
const WrapMargin = 8;

function Wrap(Value: number, Limit: number): number {
  if (Value < -WrapMargin) return Limit + WrapMargin;
  if (Value > Limit + WrapMargin) return -WrapMargin;
  return Value;
}

function PushOffset(Item: Star, Mouse: Pointer): { X: number; Y: number } {
  const DeltaX = Item.BaseX - Mouse.X;
  const DeltaY = Item.BaseY - Mouse.Y;
  const Distance = Math.hypot(DeltaX, DeltaY) || 1;
  const Radius = 150 + Item.Depth * 90;

  if (Distance >= Radius) return { X: 0, Y: 0 };

  const Ratio = Distance / Radius;
  const Eased = 1 - Ratio * Ratio * (3 - 2 * Ratio);
  const Push = Eased * Radius * 0.7;

  return { X: (DeltaX / Distance) * Push, Y: (DeltaY / Distance) * Push };
}

export function DrawStars(Context: CanvasRenderingContext2D, Stars: Star[], Time: number, Delta: number, Mouse: Pointer, Width: number, Height: number): void {
  const Step = Delta / FrameMs;

  for (const Item of Stars) {
    Item.BaseX = Wrap(Item.BaseX + Math.cos(Item.DriftAngle) * Item.DriftSpeed * Step, Width);
    Item.BaseY = Wrap(Item.BaseY + Math.sin(Item.DriftAngle) * Item.DriftSpeed * Step, Height);

    const Offset = PushOffset(Item, Mouse);
    Item.X = Item.BaseX + Offset.X;
    Item.Y = Item.BaseY + Offset.Y;

    const Twinkle = 0.55 + Math.sin(Time * Item.TwinkleSpeed + Item.Twinkle) * 0.45;
    const Alpha = Item.Alpha * Twinkle;

    if (Item.Radius > 1.1) {
      const Halo = Context.createRadialGradient(Item.X, Item.Y, 0, Item.X, Item.Y, Item.Radius * 4);
      Halo.addColorStop(0, `rgba(255, 255, 255, ${Alpha * 0.35})`);
      Halo.addColorStop(1, "rgba(255, 255, 255, 0)");
      Context.fillStyle = Halo;
      Context.beginPath();
      Context.arc(Item.X, Item.Y, Item.Radius * 4, 0, Math.PI * 2);
      Context.fill();
    }

    Context.beginPath();
    Context.fillStyle = `rgba(255, 255, 255, ${Alpha})`;
    Context.arc(Item.X, Item.Y, Item.Radius, 0, Math.PI * 2);
    Context.fill();
  }
}
