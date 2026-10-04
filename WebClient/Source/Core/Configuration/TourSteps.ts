import type { PageId } from "./PageDefinitions";

export interface TourStep {
  Title: string;
  Description: string;
  Page?: PageId;
  Targets?: string[];
}

export const TourSteps: TourStep[] = [
  {
    Title: "Want A Quick Tour?",
    Description: "We'll walk you through everything you need to know to get up and running.",
  },
  {
    Title: "Navigate The Launcher",
    Description: "Home, Library, Item Shop, Leaderboard and Servers are all accessible from the sidebar.",
    Page: "play",
    Targets: ["[data-tour='nav-group']"],
  },
  {
    Title: "Fortnite Already Installed?",
    Description: "Open this section to point the launcher to the folder where your build is installed.",
    Page: "downloads",
    Targets: ["[data-tour='installation-path']"],
  },
  {
    Title: "Don't Have Fortnite Yet?",
    Description: "Pick one from Available Downloads and the launcher will handle the installation for you.",
    Page: "downloads",
    Targets: ["[data-tour='installation-build']"],
  },
  {
    Title: "Your Home Screen",
    Description: "This is your main page. Launch the game, watch the trailer and see how many players are online.",
    Page: "play",
    Targets: ["[data-tour='home-hero']"],
  },
  {
    Title: "Customize In Settings",
    Description: "Adjust sound, themes, addons and launch behavior all from this button.",
    Page: "play",
    Targets: ["[data-tour='settings-button']"],
  },
  {
    Title: "Your Account",
    Description: "Click your avatar to access support links or sign out of your account.",
    Page: "play",
    Targets: ["[data-tour='profile-menu']"],
  },
  {
    Title: "You're All Set",
    Description: "Once everything is installed, press Play here to launch the game and drop in.",
    Page: "play",
    Targets: ["[data-tour='play-button']"],
  },
];

export function StepTargets(Step: TourStep | undefined): string[] {
  return Step?.Targets ?? [];
}
