export interface Glow {
  BaseX: number;
  BaseY: number;
  Radius: number;
  Hue: string;
  Alpha: number;
  Speed: number;
  Phase: number;
  DriftX: number;
  DriftY: number;
}

export interface Star {
  BaseX: number;
  BaseY: number;
  X: number;
  Y: number;
  Radius: number;
  Depth: number;
  Alpha: number;
  Twinkle: number;
  TwinkleSpeed: number;
  DriftAngle: number;
  DriftSpeed: number;
}

export interface ShootingStar {
  X: number;
  Y: number;
  VelocityX: number;
  VelocityY: number;
  Life: number;
  MaxLife: number;
  Length: number;
}

export interface Pointer {
  X: number;
  Y: number;
  TargetX: number;
  TargetY: number;
}

export interface CanvasSize {
  Width: number;
  Height: number;
  DPR: number;
}
