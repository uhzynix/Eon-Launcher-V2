import type { ComponentType } from "react";
import { createElement } from "react";

export type PageId = "play" | "downloads" | "shop" | "leaderboard" | "status" | "settings";

export interface PageDefinition {
  Id: PageId;
  Label: string;
  Icon: ComponentType<{ size?: number }>;
}

function CreateMaterialIcon(Name: string): ComponentType<{ size?: number }> {
  return ({ size = 19 }) => createElement("span", { className: "material-symbols-outlined page-material-icon", style: { fontSize: size } }, Name);
}

const HomeIcon = CreateMaterialIcon("home");
const LibraryIcon = CreateMaterialIcon("folder");
const ShopIcon = CreateMaterialIcon("shopping_cart");
const LeaderboardIcon = CreateMaterialIcon("leaderboard");
const ServerStatusIcon = CreateMaterialIcon("dns");
const SettingsIcon = CreateMaterialIcon("settings");

export const Pages: PageDefinition[] = [
  { Id: "play", Label: "Home", Icon: HomeIcon },
  { Id: "downloads", Label: "Library", Icon: LibraryIcon },
  { Id: "shop", Label: "Shop", Icon: ShopIcon },
  { Id: "leaderboard", Label: "Leaderboard", Icon: LeaderboardIcon },
  { Id: "status", Label: "Servers", Icon: ServerStatusIcon },
  { Id: "settings", Label: "Settings", Icon: SettingsIcon },
];
