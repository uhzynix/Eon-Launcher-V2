import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { BrandLogo } from "../../../Core/Configuration/Assets";
import { Project } from "../../../Core/Services/ProjectStore";
import { UseAvatarGlow } from "../../../Core/Hooks/UseAvatarGlow";
import { UseCountdown } from "../../../Core/Hooks/UseCountdown";

interface WelcomeCardProps {
  Visible: boolean;
  Greeting: string;
  Username: string;
  SkinUrl: string;
  Duration: number;
  ErrorMessage?: string;
  OnRetry?: () => void;
}

export function WelcomeCard({ Visible, Greeting, Username, SkinUrl, Duration, ErrorMessage, OnRetry }: WelcomeCardProps) {
  const Avatar = UseAvatarGlow(SkinUrl);
  const Remaining = UseCountdown(Duration, Visible && !ErrorMessage);
  const IsWelcome = Visible && !ErrorMessage;
  const GlowStyle = Avatar.Color ? ({ "--avatar-glow": Avatar.Color } as CSSProperties) : undefined;

  return (
    <motion.div
      className="splash-card"
      initial={{ opacity: Visible ? 1 : 0 }}
      animate={{ opacity: Visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ pointerEvents: Visible ? "auto" : "none" }}
    >
      {IsWelcome ? (
        <div className="splash-avatar" style={GlowStyle}>
          {Avatar.Source || SkinUrl ? (
            <img src={Avatar.Source || SkinUrl} alt={Username || "Player"} />
          ) : (
            <span>{(Username || "P").charAt(0).toUpperCase()}</span>
          )}
        </div>
      ) : (
        <img className="splash-logo" src={BrandLogo} alt={Project().Name} />
      )}
      <h1 className="splash-title">
        {ErrorMessage ? `Couldn't Start ${Project().Name}` : Username ? `${Greeting}, ${Username}!` : "Welcome Back!"}
      </h1>
      <p className="splash-sub">{ErrorMessage ?? "Loading your profile and getting everything ready."}</p>
      {IsWelcome && (
        <div className="splash-progress">
          <div className="splash-bar splash-bar-wide is-timed" aria-hidden="true" style={{ "--fill-duration": `${Duration}ms` } as CSSProperties}>
            <span />
          </div>
          <span className="splash-countdown">{Remaining}s</span>
        </div>
      )}
      {ErrorMessage && OnRetry && (
        <button type="button" className="splash-retry" onClick={OnRetry}>Try Again</button>
      )}
    </motion.div>
  );
}
