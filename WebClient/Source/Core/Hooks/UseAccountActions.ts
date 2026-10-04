import { Invoke } from "../Bridge/Bridge";
import { SettingsFromAccount, type Account } from "../Configuration/AccountSettings";
import type { ThemeId } from "../Configuration/Themes";
import { PlayToggleOff, PlayToggleOn, SetSoundEnabled } from "../Services/SoundEffects";
import type { BootSequence } from "../../Types/Boot";

export interface AccountActions {
  Update: (Patch: Partial<Account>) => void;
  Toggle: (Key: keyof Account, Enabled: boolean) => void;
  ToggleSound: (Enabled: boolean) => void;
  SelectTheme: (Theme: ThemeId) => void;
  ResolveFolder: (Folder: string) => void;
}

export function UseAccountActions(Boot: BootSequence): AccountActions {
  function Persist(Next: Account, Folder: string, Theme: ThemeId) {
    void Invoke("SaveSettings", { Config: SettingsFromAccount(Next, Folder, Theme) });
  }

  function Update(Patch: Partial<Account>) {
    const Next = { ...Boot.Account, ...Patch };
    Boot.SetAccount(Next);
    Persist(Next, Boot.Folder, Boot.Theme);
  }

  function Toggle(Key: keyof Account, Enabled: boolean) {
    if (Enabled) PlayToggleOn();
    else PlayToggleOff();
    Update({ [Key]: Enabled } as Partial<Account>);
  }

  function ToggleSound(Enabled: boolean) {
    SetSoundEnabled(Enabled);
    if (Enabled) PlayToggleOn();
    else PlayToggleOff();
    Update({ IsSoundEnabled: Enabled });
  }

  function SelectTheme(Theme: ThemeId) {
    Boot.SetTheme(Theme);
    Persist(Boot.Account, Boot.Folder, Theme);
  }

  function ResolveFolder(Folder: string) {
    Boot.SetFolder(Folder);
    Persist(Boot.Account, Folder, Boot.Theme);
  }

  return { Update, Toggle, ToggleSound, SelectTheme, ResolveFolder };
}
