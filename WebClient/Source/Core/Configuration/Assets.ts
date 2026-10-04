const TextureRoot = "/Content/Texture";

export const BrandLogo = `${TextureRoot}/Branding/Eon.png`;
export const SplashArt = `${TextureRoot}/UI/Backgrounds/SplashArt.png`;

export const StatIcons = {
  Kills: `${TextureRoot}/UI/Stats/Kills.png`,
  Wins: `${TextureRoot}/UI/Stats/Wins.png`,
  Hype: `${TextureRoot}/UI/Stats/Hype.png`,
} as const;

export const TrailerSources = [`${TextureRoot}/UI/Trailers/TrailerMain.mp4`, `${TextureRoot}/UI/Trailers/TrailerAlt.mp4`];

export function ServiceIcon(Name: string): string {
  return `${TextureRoot}/Icons/${Name}`;
}
