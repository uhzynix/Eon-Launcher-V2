import type { ThemeId } from "../Core/Configuration/Themes";

export type SettingsTab = "General" | "Mods" | "Appearance" | "About";

export interface SettingToggleProps {
  Title: string;
  Description: string;
  Enabled: boolean;
  OnChange: (Enabled: boolean) => void;
}

export interface SettingsTabsProps {
  ActiveTab: SettingsTab;
  OnChange: (Tab: SettingsTab) => void;
}

export interface GeneralSettingsProps {
  IsSoundEnabled: boolean;
  OnToggleSound: (Enabled: boolean) => void;
  IsMinimizeOnLaunch: boolean;
  OnToggleMinimizeOnLaunch: (Enabled: boolean) => void;
  IsKeepOnTopOnLaunch: boolean;
  OnToggleKeepOnTopOnLaunch: (Enabled: boolean) => void;
}

export interface AppearanceSettingsProps {
  IsLiquidGlassEnabled: boolean;
  OnToggleLiquidGlass: (Enabled: boolean) => void;
  Theme: ThemeId;
  OnSelectTheme: (Theme: ThemeId) => void;
}

export interface SettingsProps extends GeneralSettingsProps, AppearanceSettingsProps {
  IsBubbleBuildsEnabled: boolean;
  OnToggleBubbleBuilds: (Enabled: boolean) => void;
  ActiveSettingsTab: SettingsTab;
  OnSettingsTabChange: (Tab: SettingsTab) => void;
}
