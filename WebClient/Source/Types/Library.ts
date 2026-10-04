export interface InstallFolderResult {
  Path: string;
}

export interface BuildLibrary {
  Splash: string | null;
  Installed: boolean | null;
  Busy: boolean;
  Confirming: boolean;
  Unsupported: boolean;
  SetUnsupported: (Value: boolean) => void;
  PickFolder: () => Promise<string>;
  Adopt: (Path: string) => Promise<boolean>;
  Forget: () => void;
  Cancel: () => void;
  MarkInstalled: () => void;
}
