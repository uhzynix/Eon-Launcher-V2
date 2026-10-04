import type { ThemeId } from "./Themes";

export interface StoredSettings {
  FortnitePath?: string | null;
  Email?: string;
  Password?: string;
  Username?: string;
  SkinUrl?: string;
  IsSoundEnabled?: boolean;
  IsBubbleBuildsEnabled?: boolean;
  IsLiquidGlassEnabled?: boolean;
  MinimizeOnLaunch?: boolean;
  KeepOnTopOnLaunch?: boolean;
  RedirectProtected?: boolean;
  Theme?: string;
  RememberMe?: boolean;
}

export interface Account {
  Email: string;
  Password: string;
  Username: string;
  SkinUrl: string;
  IsSoundEnabled: boolean;
  IsBubbleBuildsEnabled: boolean;
  IsLiquidGlassEnabled: boolean;
  MinimizeOnLaunch: boolean;
  KeepOnTopOnLaunch: boolean;
  RedirectProtected: boolean;
  RememberMe: boolean;
}

export const EmptyAccount: Account = {
  Email: "",
  Password: "",
  Username: "",
  SkinUrl: "",
  IsSoundEnabled: true,
  IsBubbleBuildsEnabled: false,
  IsLiquidGlassEnabled: true,
  MinimizeOnLaunch: false,
  KeepOnTopOnLaunch: false,
  RedirectProtected: false,
  RememberMe: true,
};

export function AccountFromSettings(Settings: StoredSettings | null): Account {
  if (!Settings) return EmptyAccount;

  return {
    Email: Settings.Email ?? "",
    Password: Settings.Password ?? "",
    Username: Settings.Username ?? "",
    SkinUrl: Settings.SkinUrl ?? "",
    IsSoundEnabled: Settings.IsSoundEnabled ?? true,
    IsBubbleBuildsEnabled: Settings.IsBubbleBuildsEnabled ?? false,
    IsLiquidGlassEnabled: Settings.IsLiquidGlassEnabled ?? true,
    MinimizeOnLaunch: Settings.MinimizeOnLaunch ?? false,
    KeepOnTopOnLaunch: Settings.KeepOnTopOnLaunch ?? false,
    RedirectProtected: Settings.RedirectProtected ?? false,
    RememberMe: Settings.RememberMe ?? true,
  };
}

export function SettingsFromAccount(Value: Account, Folder: string, Theme: ThemeId): StoredSettings {
  return {
    Username: Value.Username,
    Email: Value.Email,
    Password: Value.Password,
    FortnitePath: Folder || null,
    IsSoundEnabled: Value.IsSoundEnabled,
    IsBubbleBuildsEnabled: Value.IsBubbleBuildsEnabled,
    IsLiquidGlassEnabled: Value.IsLiquidGlassEnabled,
    MinimizeOnLaunch: Value.MinimizeOnLaunch,
    KeepOnTopOnLaunch: Value.KeepOnTopOnLaunch,
    RedirectProtected: Value.RedirectProtected,
    SkinUrl: Value.SkinUrl,
    RememberMe: Value.RememberMe,
    Theme,
  };
}
