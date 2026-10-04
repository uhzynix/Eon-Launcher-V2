import { Project } from "../../../Core/Services/ProjectStore";
import { SectionCaption } from "../../../Core/Configuration/SettingsSections";
import { SettingToggle } from "../../Controls/Settings/SettingToggle";
import { SettingsTabs } from "./SettingsTabs";
import { GeneralSettings } from "./GeneralSettings";
import { ThemePicker } from "./ThemePicker";
import { AboutSection } from "./AboutSection";
import type { SettingsProps } from "../../../Types/Settings";

export type { SettingsTab } from "../../../Types/Settings";

export function SettingsPage(Props: SettingsProps) {
  return (
    <div className="settings">
      <div className="shop-bar">
        <div>
          <h2 className="shop-title">Settings</h2>
          <p className="muted">{SectionCaption(Props.ActiveSettingsTab)}</p>
        </div>
        <SettingsTabs ActiveTab={Props.ActiveSettingsTab} OnChange={Props.OnSettingsTabChange} />
      </div>

      {Props.ActiveSettingsTab === "General" && (
        <GeneralSettings
          IsSoundEnabled={Props.IsSoundEnabled}
          OnToggleSound={Props.OnToggleSound}
          IsMinimizeOnLaunch={Props.IsMinimizeOnLaunch}
          OnToggleMinimizeOnLaunch={Props.OnToggleMinimizeOnLaunch}
          IsKeepOnTopOnLaunch={Props.IsKeepOnTopOnLaunch}
          OnToggleKeepOnTopOnLaunch={Props.OnToggleKeepOnTopOnLaunch}
        />
      )}

      {Props.ActiveSettingsTab === "Mods" && (
        <section className="settings-list">
          <SettingToggle
            Title="Bubble Builds"
            Description="Changes your building textures to use a bubble wrap style in-game."
            Enabled={Props.IsBubbleBuildsEnabled}
            OnChange={Props.OnToggleBubbleBuilds}
          />
        </section>
      )}

      {Props.ActiveSettingsTab === "Appearance" && (
        <>
          <section className="settings-list">
            <SettingToggle
              Title="Liquid Glass"
              Description="Enables a glass visual effect on buttons and panels across the launcher."
              Enabled={Props.IsLiquidGlassEnabled}
              OnChange={Props.OnToggleLiquidGlass}
            />
          </section>
          <ThemePicker Theme={Props.Theme} OnSelectTheme={Props.OnSelectTheme} />
        </>
      )}

      {Props.ActiveSettingsTab === "About" && <AboutSection Info={Project()} />}
    </div>
  );
}