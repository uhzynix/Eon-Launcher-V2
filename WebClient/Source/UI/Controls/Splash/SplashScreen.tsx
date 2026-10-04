import { useRef, useState, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { BeginDrag } from "../../../Core/Bridge/Bridge";
import { UseDots } from "../../../Core/Hooks/UseDots";
import { AmbientBackground } from "../Shell/AmbientBackground";
import { PreparingPanel } from "./PreparingPanel";
import { WelcomeCard } from "./WelcomeCard";
import type { SplashScreenProps } from "../../../Types/Splash";

const Greetings = ["Hello", "Welcome back", "Hey", "What's up", "Greetings", "Hi", "Howdy", "Good to see you"];
const ClickThreshold = 4;

export function SplashScreen({ Mode, Username = "", SkinUrl = "", Stage = "", Progress = 0, Duration = 0, ErrorMessage, OnRetry, OnSkip }: SplashScreenProps) {
  const [Greeting] = useState(() => Greetings[Math.floor(Math.random() * Greetings.length)]);
  const PointerStart = useRef<{ X: number; Y: number } | null>(null);

  const IsPreparing = Mode === "loading" && !ErrorMessage;
  const Dots = UseDots(IsPreparing);

  function HandlePointerDown(Event: PointerEvent<HTMLElement>) {
    PointerStart.current = { X: Event.screenX, Y: Event.screenY };
    BeginDrag(Event);
  }

  function HandleClick(Event: { screenX: number; screenY: number }) {
    if (!OnSkip) return;
    const Start = PointerStart.current;
    if (Start && Math.hypot(Event.screenX - Start.X, Event.screenY - Start.Y) > ClickThreshold) return;
    OnSkip();
  }

  return (
    <motion.div
      className="splash-screen"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onPointerDown={HandlePointerDown}
      onClick={HandleClick}
    >
      <div className="splash-bg" />
      <div className="splash-overlay" />
      <AmbientBackground />
      <div className="splash-stage">
        <PreparingPanel Visible={IsPreparing} Stage={Stage} Dots={Dots} Progress={Progress} />
        <WelcomeCard
          Visible={!IsPreparing}
          Greeting={Greeting}
          Username={Username}
          SkinUrl={SkinUrl}
          Duration={Duration}
          ErrorMessage={ErrorMessage}
          OnRetry={OnRetry}
        />
      </div>
      {!IsPreparing && OnSkip && (
        <motion.span
          className="splash-skip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
        >
          Click anywhere to skip
        </motion.span>
      )}
    </motion.div>
  );
}
