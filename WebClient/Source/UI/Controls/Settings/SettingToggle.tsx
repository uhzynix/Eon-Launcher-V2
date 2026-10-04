import type { SettingToggleProps } from "../../../Types/Settings";

export function SettingToggle({ Title, Description, Enabled, OnChange }: SettingToggleProps) {
  return (
    <div className="setting-row">
      <div>
        <strong>{Title}</strong>
        <span>{Description}</span>
      </div>
      <label className="switch">
        <input type="checkbox" checked={Enabled} onChange={(Event) => OnChange(Event.target.checked)} />
        <span />
      </label>
    </div>
  );
}
