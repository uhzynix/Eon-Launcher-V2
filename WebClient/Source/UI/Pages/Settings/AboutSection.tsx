import { useState } from "react";
import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { OpenUrl } from "../../../Core/Bridge/Bridge";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { BrandLogo } from "../../../Core/Configuration/Assets";
import { BuildCreditGroups, BuildSocialLinks } from "../../../Core/Configuration/Credits";
import { GitHubMark } from "../../Controls/Icons/GitHubMark";
import { DiscordMark } from "../../Controls/Icons/DiscordMark";
import { TikTokMark } from "../../Controls/Icons/TikTokMark";
import type { ProjectInfo } from "../../../Types/Project";

const SocialMarks: Record<string, () => ReactElement> = {
  Discord: DiscordMark,
  TikTok: TikTokMark,
};

interface AboutSectionProps {
  Info: ProjectInfo;
}

export function AboutSection({ Info }: AboutSectionProps) {
  const [IsOpen, SetIsOpen] = useState(false);

  function Open(Url: string) {
    PlayClick();
    void OpenUrl(Url);
  }

  return (
    <motion.section
      className="settings-list settings-list-about"
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.52, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <motion.div className="about-expander" layout>
        <button className="about-row about-toggle" type="button" aria-expanded={IsOpen} onClick={() => { PlayClick(); SetIsOpen((Value) => !Value); }}>
          <div className="about-heading">
            <img className="about-icon" src={BrandLogo} alt="" />
            <div>
              <strong>About {Info.Name} Launcher</strong>
              <span>Version {Info.CurrentVersion}</span>
            </div>
          </div>
          <ChevronDown className={`about-chevron${IsOpen ? " is-open" : ""}`} size={18} strokeWidth={2.2} />
        </button>
        <AnimatePresence initial={false}>
          {IsOpen && (
            <motion.div
              className="about-body"
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="about-body-inner">
                {BuildCreditGroups(Info).map((Group) => (
                  <div className="about-credit-group" key={Group.Label}>
                    <span className="about-credit-label">{Group.Label}</span>
                    <div className="about-credit-names">
                      {Group.Members.map((Member) => (
                        <button className="text-button" key={Member.Name} onClick={() => Open(Member.Url)}>
                          <GitHubMark />
                          {Member.Name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="about-footer">
                  {BuildSocialLinks(Info).map((Link) => {
                    const Mark = SocialMarks[Link.Name];
                    return (
                      <button className="text-button" key={Link.Name} onClick={() => Open(Link.Url)}>
                        <Mark />
                        {Link.Name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}