import { SettingToggle } from "../../Controls/Settings/SettingToggle";
import type { GeneralSettingsProps } from "../../../Types/Settings";

export function GeneralSettings(Props: GeneralSettingsProps) {
  return (
    <section className="settings-list">
      <SettingToggle
        Title="Sound Effects"
        Description="Play sound effects while navigating the launcher."
        Enabled={Props.IsSoundEnabled}
        OnChange={Props.OnToggleSound}
      />
      <SettingToggle
        Title="Minimize on Launch"
        Description="Automatically minimize the launcher when the game starts."
        Enabled={Props.IsMinimizeOnLaunch}
        OnChange={Props.OnToggleMinimizeOnLaunch}
      />
      <SettingToggle
        Title="Always on Top"
        Description="Keep the launcher window above all other windows while the game is running."
        Enabled={Props.IsKeepOnTopOnLaunch}
        OnChange={Props.OnToggleKeepOnTopOnLaunch}
      />
    </section>
  );
}