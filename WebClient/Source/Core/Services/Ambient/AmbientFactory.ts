import type { Glow, ShootingStar, Star } from "./AmbientTypes";

const DefaultGlowColors = ["155, 93, 229", "48, 217, 138", "10, 132, 255"];
const GlowCount = 4;
const MaxStars = 180;

export function GetGlowColors(): string[] {
  if (!document.documentElement.hasAttribute("data-theme")) return DefaultGlowColors;

  const Accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  const Match = Accent.match(/^#([0-9a-f]{6})$/i);
  if (!Match) return DefaultGlowColors;

  const Value = Match[1];
  const Red = parseInt(Value.slice(0, 2), 16);
  const Green = parseInt(Value.slice(2, 4), 16);
  const Blue = parseInt(Value.slice(4, 6), 16);

  return [`${Red}, ${Green}, ${Blue}`];
}

export function CreateGlows(Width: number, Height: number, Colors: string[]): Glow[] {
  return Array.from({ length: GlowCount }, (_, Index) => ({
    BaseX: Math.random() * Width,
    BaseY: Math.random() * Height,
    Radius: 300 + Math.random() * 260,
    Hue: Colors[Index % Colors.length],
    Alpha: 0.22 + Math.random() * 0.16,
    Speed: 0.00028 + Math.random() * 0.00032,
    Phase: Math.random() * Math.PI * 2,
    DriftX: 160 + Math.random() * 220,
    DriftY: 120 + Math.random() * 170,
  }));
}

export function CreateStars(Width: number, Height: number): Star[] {
  const Count = Math.min(MaxStars, Math.round((Width * Height) / 10000));

  return Array.from({ length: Count }, () => {
    const StartX = Math.random() * Width;
    const StartY = Math.random() * Height;
    const Depth = Math.random() * 0.8 + 0.2;

    return {
      BaseX: StartX,
      BaseY: StartY,
      X: StartX,
      Y: StartY,
      Radius: Math.random() * 1.5 + 0.4,
      Depth,
      Alpha: Math.random() * 0.55 + 0.3,
      Twinkle: Math.random() * Math.PI * 2,
      TwinkleSpeed: 0.0012 + Math.random() * 0.0022,
      DriftAngle: Math.random() * Math.PI * 2,
      DriftSpeed: 0.12 + Depth * 0.22,
    };
  });
}

export function CreateShootingStar(Width: number, Height: number): ShootingStar {
  const FromTop = Math.random() < 0.5;
  const Angle = Math.PI / 5 + Math.random() * (Math.PI / 10);
  const Speed = 9 + Math.random() * 6;

  return {
    X: FromTop ? Math.random() * Width : -40,
    Y: FromTop ? -40 : Math.random() * Height * 0.5,
    VelocityX: Math.cos(Angle) * Speed,
    VelocityY: Math.sin(Angle) * Speed,
    Life: 0,
    MaxLife: 60 + Math.random() * 40,
    Length: 70 + Math.random() * 60,
  };
}
