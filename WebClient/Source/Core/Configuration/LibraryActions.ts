export type GameAction = "uninstall";

export interface ActionCopy {
  Title: string;
  Message: string;
  Confirm: string;
}

export function ActionCopyFor(Build: string): ActionCopy {
  return {
    Title: "Uninstall this build?",
    Message: `Fortnite v${Build} will be deleted from your computer. This action cannot be undone.`,
    Confirm: "Uninstall",
  };
}
