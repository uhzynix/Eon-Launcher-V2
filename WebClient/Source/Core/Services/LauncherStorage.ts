const TourStorageKey = "EonLauncherTourCompleted";
const ThemeStorageKey = "EonLauncherTheme";

export function IsTourCompleted(): boolean {
  try {
    return localStorage.getItem(TourStorageKey) === "true";
  } catch {
    return false;
  }
}

export function MarkTourCompleted(): void {
  try {
    localStorage.setItem(TourStorageKey, "true");
  } catch {
  }
}

export function GetCachedTheme(): string | null {
  try {
    return localStorage.getItem(ThemeStorageKey);
  } catch {
    return null;
  }
}

export function SetCachedTheme(Theme: string): void {
  try {
    localStorage.setItem(ThemeStorageKey, Theme);
  } catch {
  }
}
