import { Invoke } from "../Bridge/Bridge";

const CachePrefix = "eon-build-splash:";

interface BuildSplashResult {
  Data: string;
  Mime: string;
}

function CacheKey(Path: string): string {
  return `${CachePrefix}${Path.toLowerCase()}`;
}

export function ReadCachedSplash(Path: string): string | null {
  if (!Path) return null;

  try {
    return localStorage.getItem(CacheKey(Path));
  } catch {
    return null;
  }
}

export function ForgetSplash(Path: string): void {
  if (!Path) return;

  try {
    localStorage.removeItem(CacheKey(Path));
  } catch {
  }
}

export async function LoadSplash(Path: string): Promise<string | null> {
  if (!Path) return null;

  const Cached = ReadCachedSplash(Path);
  if (Cached) return Cached;

  const Splash = await Invoke<BuildSplashResult | null>("GetBuildSplash", { Path }).catch(() => null);
  if (!Splash) return null;

  const DataUrl = `data:${Splash.Mime};base64,${Splash.Data}`;

  try {
    localStorage.setItem(CacheKey(Path), DataUrl);
  } catch {
  }

  return DataUrl;
}
