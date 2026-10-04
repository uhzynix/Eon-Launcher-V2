import type { Glow } from "./AmbientTypes";

export function DrawGlows(Context: CanvasRenderingContext2D, Glows: Glow[], Time: number): void {
  for (const Item of Glows) {
    const X = Item.BaseX + Math.sin(Time * Item.Speed + Item.Phase) * Item.DriftX;
    const Y = Item.BaseY + Math.cos(Time * Item.Speed * 0.85 + Item.Phase) * Item.DriftY;
    const Pulse = 0.75 + Math.sin(Time * Item.Speed * 1.6 + Item.Phase) * 0.25;
    const Radius = Item.Radius * (0.92 + Pulse * 0.16);

    const Gradient = Context.createRadialGradient(X, Y, 0, X, Y, Radius);
    Gradient.addColorStop(0, `rgba(${Item.Hue}, ${Item.Alpha * Pulse})`);
    Gradient.addColorStop(0.55, `rgba(${Item.Hue}, ${Item.Alpha * Pulse * 0.35})`);
    Gradient.addColorStop(1, `rgba(${Item.Hue}, 0)`);

    Context.fillStyle = Gradient;
    Context.beginPath();
    Context.arc(X, Y, Radius, 0, Math.PI * 2);
    Context.fill();
  }
}
