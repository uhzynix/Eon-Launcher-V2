import type { SettingsTab } from "../../Types/Settings";

export const SettingsSections: { Id: SettingsTab; Label: string; Caption: string }[] = [
  { Id: "General", Label: "General", Caption: "Launcher Behavior" },
  { Id: "Mods", Label: "Mods", Caption: "Addons" },
  { Id: "Appearance", Label: "Appearance", Caption: "Theme And Effects" },
  { Id: "About", Label: "About", Caption: "Version And Credits" },
];

export function SectionCaption(Tab: SettingsTab): string {
  return SettingsSections.find((Section) => Section.Id === Tab)?.Caption ?? "";
}
