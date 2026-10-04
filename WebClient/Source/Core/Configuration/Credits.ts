import type { CreditEntry, CreditGroup, ProjectInfo } from "../../Types/Project";

export function BuildCreditGroups(Info: ProjectInfo): CreditGroup[] {
  return [
    { Label: "Main Core Functions", Members: [{ Name: "Jurij15", Url: Info.GitHub_Juri }, { Name: "Greenwood", Url: Info.GitHub_Greenwood }] },
    { Label: "New Design And New Functions", Members: [{ Name: "Zynix", Url: Info.GitHub_Zynix }, { Name: "Abstract", Url: Info.GitHub_Abstract }] },
  ];
}

export function BuildSocialLinks(Info: ProjectInfo): CreditEntry[] {
  return [
    { Name: "Discord", Url: Info.Discord },
    { Name: "TikTok", Url: Info.TikTok },
  ];
}
