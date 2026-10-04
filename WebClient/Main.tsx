import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import MainShellPage from "./Source/UI/Pages/Main/MainShellPage";
import { PrimeProject } from "./Source/Core/Services/ProjectStore";
import "./Styles.css";

function App() {
  useEffect(() => {
    if (import.meta.env.DEV) return;
    const PreventContextMenu = (Event: MouseEvent) => Event.preventDefault();
    const PreventInspectionShortcuts = (Event: KeyboardEvent) => {
      const IsInspectionShortcut =
        Event.key === "F12" ||
        (Event.ctrlKey && Event.shiftKey && ["I", "J", "C"].includes(Event.key.toUpperCase())) ||
        (Event.ctrlKey && Event.key.toUpperCase() === "U");
      if (IsInspectionShortcut) Event.preventDefault();
    };
    document.addEventListener("contextmenu", PreventContextMenu);
    document.addEventListener("keydown", PreventInspectionShortcuts);
    return () => {
      document.removeEventListener("contextmenu", PreventContextMenu);
      document.removeEventListener("keydown", PreventInspectionShortcuts);
    };
  }, []);

  return (
    <>
      <svg className="liquid-glass-definitions" aria-hidden="true">
        <defs>
          <filter id="liquid-glass-filter" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="23" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-20" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-24" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-28" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation="3" />
          </filter>
        </defs>
      </svg>
      <MainShellPage />
    </>
  );
}

void PrimeProject().then(() => {
  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
