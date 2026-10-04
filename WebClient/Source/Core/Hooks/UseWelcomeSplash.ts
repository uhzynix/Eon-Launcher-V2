import { useRef, useState } from "react";

export const WelcomeSplashDuration = 3000;

export interface WelcomeSplash {
  IsVisible: boolean;
  Begin: (OnComplete: () => void) => void;
  Finish: () => void;
}

export function UseWelcomeSplash(): WelcomeSplash {
  const [IsVisible, SetIsVisible] = useState(false);
  const Timer = useRef<number | null>(null);
  const Complete = useRef<() => void>(() => {});

  function Finish() {
    if (Timer.current !== null) {
      clearTimeout(Timer.current);
      Timer.current = null;
    }

    const Pending = Complete.current;
    Complete.current = () => {};
    Pending();
  }

  function Begin(OnComplete: () => void) {
    Complete.current = () => {
      SetIsVisible(false);
      OnComplete();
    };
    SetIsVisible(true);
    Timer.current = window.setTimeout(Finish, WelcomeSplashDuration);
  }

  return { IsVisible, Begin, Finish };
}
