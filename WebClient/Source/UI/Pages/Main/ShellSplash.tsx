import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "../../Controls/Splash/SplashScreen";
import { WelcomeSplashDuration } from "../../../Core/Hooks/UseWelcomeSplash";
import type { BootSequence } from "../../../Types/Boot";
import type { SplashMode } from "../../../Types/Splash";
import type { WelcomeSplash } from "../../../Core/Hooks/UseWelcomeSplash";

interface ShellSplashProps {
  Boot: BootSequence;
  Welcome: WelcomeSplash;
  StartupSplash: boolean;
  Mode: SplashMode;
  OnRetry: () => void;
}

export function ShellSplash({ Boot, Welcome, StartupSplash, Mode, OnRetry }: ShellSplashProps) {
  return (
    <AnimatePresence>
      {(!Boot.Booted || StartupSplash || Welcome.IsVisible) && (
        <SplashScreen
          key="splash"
          Mode={Mode}
          Stage={Boot.Stage}
          Progress={Boot.Progress}
          Username={Boot.Account.Username}
          SkinUrl={Boot.Account.SkinUrl}
          Duration={WelcomeSplashDuration}
          ErrorMessage={Boot.ErrorMessage}
          OnSkip={Welcome.IsVisible ? Welcome.Finish : undefined}
          OnRetry={OnRetry}
        />
      )}
    </AnimatePresence>
  );
}
