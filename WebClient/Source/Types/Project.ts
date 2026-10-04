export interface CreditEntry {
  Name: string;
  Url: string;
}

export interface CreditGroup {
  Label: string;
  Members: CreditEntry[];
}

export interface ProjectInfo {
  Name: string;
  Chapter: string;
  Season: string;
  Build: string;
  ContentLevel: string;
  CurrentVersion: string;
  Discord: string;
  TikTok: string;
  DonationsURL: string;
  SupportServerURL: string;
  CreateAccountURL: string;
  DownloadBuildURL: string;
  ServerStatusURL: string;
  PlaylistNamesURL: string;
  ItemShopURL: string;
  LeaderboardURL: string;
  GitHub_Juri: string;
  GitHub_Greenwood: string;
  GitHub_Zynix: string;
  GitHub_Abstract: string;
}