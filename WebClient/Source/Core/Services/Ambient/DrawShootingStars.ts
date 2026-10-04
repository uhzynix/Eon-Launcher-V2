import type { ShootingStar } from "./AmbientTypes";

const FrameMs = 16.6667;
const OffscreenMargin = 100;

export function DrawShootingStars(Context: CanvasRenderingContext2D, Items: ShootingStar[], Delta: number, Width: number, Height: number): ShootingStar[] {
  const Step = Delta / FrameMs;

  return Items.filter((Item) => {
    Item.Life += Step;
    Item.X += Item.VelocityX * Step;
    Item.Y += Item.VelocityY * Step;

    const Ratio = Item.Life / Item.MaxLife;
    if (Ratio >= 1 || Item.X > Width + OffscreenMargin || Item.Y > Height + OffscreenMargin) return false;

    const Alpha = Math.min(Ratio * 6, 1) * (1 - Math.max((Ratio - 0.7) / 0.3, 0));
    const Speed = Math.hypot(Item.VelocityX, Item.VelocityY) || 1;
    const TailX = Item.X - (Item.VelocityX / Speed) * Item.Length;
    const TailY = Item.Y - (Item.VelocityY / Speed) * Item.Length;

    const Trail = Context.createLinearGradient(Item.X, Item.Y, TailX, TailY);
    Trail.addColorStop(0, `rgba(255, 255, 255, ${Alpha})`);
    Trail.addColorStop(1, "rgba(255, 255, 255, 0)");

    Context.strokeStyle = Trail;
    Context.lineWidth = 1.6;
    Context.lineCap = "round";
    Context.beginPath();
    Context.moveTo(Item.X, Item.Y);
    Context.lineTo(TailX, TailY);
    Context.stroke();

    return true;
  });
}
