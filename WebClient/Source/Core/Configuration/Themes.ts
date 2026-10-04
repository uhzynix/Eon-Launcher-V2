export type ThemeId =
  | "default"
  | "crimson"
  | "azure"
  | "emerald"
  | "sunset"
  | "monochrome"
  | "gold"
  | "cyan"
  | "lime"
  | "magenta"
  | "ice"
  | "indigo"
  | "coral"
  | "teal"
  | "amber"
  | "red"
  | "mint"
  | "hotpink"
  | "orchid"
  | "plasma";

export interface ThemeDefinition {
  Id: ThemeId;
  Label: string;
  Swatch: string;
}

export const Themes: ThemeDefinition[] = [
  { Id: "default", Label: "Eon Purple", Swatch: "#9b5de5" },
  { Id: "crimson", Label: "Crimson", Swatch: "#ef4463" },
  { Id: "azure", Label: "Azure", Swatch: "#0a84ff" },
  { Id: "emerald", Label: "Emerald", Swatch: "#22c55e" },
  { Id: "sunset", Label: "Sunset", Swatch: "#ff8a3d" },
  { Id: "monochrome", Label: "Monochrome", Swatch: "#9ca3af" },
  { Id: "gold", Label: "Gold", Swatch: "#f5c451" },
  { Id: "cyan", Label: "Cyan", Swatch: "#22d3ee" },
  { Id: "lime", Label: "Lime", Swatch: "#a3e635" },
  { Id: "magenta", Label: "Magenta", Swatch: "#e879f9" },
  { Id: "ice", Label: "Ice", Swatch: "#7dd3fc" },
  { Id: "indigo", Label: "Indigo", Swatch: "#6366f1" },
  { Id: "coral", Label: "Coral", Swatch: "#ff6b5a" },
  { Id: "teal", Label: "Teal", Swatch: "#2dd4bf" },
  { Id: "amber", Label: "Amber", Swatch: "#f59e0b" },
  { Id: "red", Label: "Red", Swatch: "#ef4444" },
  { Id: "mint", Label: "Mint", Swatch: "#34d399" },
  { Id: "hotpink", Label: "Hot Pink", Swatch: "#ec4899" },
  { Id: "orchid", Label: "Orchid", Swatch: "#c084fc" },
  { Id: "plasma", Label: "Plasma", Swatch: "#f97316" },
];

export const DefaultThemeId: ThemeId = "default";

export function IsValidThemeId(Value: string | undefined | null): Value is ThemeId {
  return !!Value && Themes.some((Theme) => Theme.Id === Value);
}
