import { CreateGlows, CreateStars, GetGlowColors } from "./AmbientFactory";
import type { CanvasSize, Glow, Pointer, ShootingStar, Star } from "./AmbientTypes";

const MaxPixelRatio = 1.5;

export interface AmbientScene {
  Glows: Glow[];
  Stars: Star[];
  Shooting: ShootingStar[];
  Size: CanvasSize;
  Mouse: Pointer;
  NextShooting: number;
}

export function CreateScene(): AmbientScene {
  return {
    Glows: [],
    Stars: [],
    Shooting: [],
    Size: { Width: 0, Height: 0, DPR: 1 },
    Mouse: { X: 0, Y: 0, TargetX: 0, TargetY: 0 },
    NextShooting: 0,
  };
}

export function ResizeScene(Scene: AmbientScene, Canvas: HTMLCanvasElement, Bounds: DOMRect | null): void {
  const Width = Bounds?.width || window.innerWidth;
  const Height = Bounds?.height || window.innerHeight;
  const DPR = Math.min(window.devicePixelRatio || 1, MaxPixelRatio);

  Scene.Size = { Width, Height, DPR };
  Canvas.width = Math.max(1, Math.round(Width * DPR));
  Canvas.height = Math.max(1, Math.round(Height * DPR));
  Canvas.style.width = `${Width}px`;
  Canvas.style.height = `${Height}px`;

  Scene.Glows = CreateGlows(Width, Height, GetGlowColors());
  Scene.Stars = CreateStars(Width, Height);
  Scene.Shooting = [];

  if (Scene.NextShooting === 0) Scene.NextShooting = performance.now() + 1500 + Math.random() * 2500;

  if (Scene.Mouse.TargetX === 0 && Scene.Mouse.TargetY === 0) {
    Scene.Mouse = { X: Width / 2, Y: Height / 2, TargetX: Width / 2, TargetY: Height / 2 };
  }
}
