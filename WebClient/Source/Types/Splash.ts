export type SplashMode = "loading" | "welcome";

export interface SplashScreenProps {
  Mode: SplashMode;
  Username?: string;
  SkinUrl?: string;
  Stage?: string;
  Progress?: number;
  Duration?: number;
  ErrorMessage?: string;
  OnRetry?: () => void;
  OnSkip?: () => void;
}
