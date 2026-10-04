import { useEffect } from "react";
import { DefaultThemeId, type ThemeId } from "../Configuration/Themes";
import { SetCachedTheme } from "../Services/LauncherStorage";

export function UseLauncherTheme(Theme: ThemeId, LiquidGlass: boolean): void {
  useEffect(() => {
    SetCachedTheme(Theme);

    if (Theme === DefaultThemeId) {
      document.documentElement.removeAttribute("data-theme");
      return;
    }

    document.documentElement.setAttribute("data-theme", Theme);
  }, [Theme]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-liquid-glass", LiquidGlass);
  }, [LiquidGlass]);
}
