import { useEffect, useRef, useState } from "react";
import { Minus, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BeginDrag, CloseWindow, MinimizeWindow, OpenUrl } from "../../../Core/Bridge/Bridge";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { Project } from "../../../Core/Services/ProjectStore";
import type { PageId } from "../../../Core/Configuration/PageDefinitions";

interface FrameProps {
  ActivePage?: string;
  OnNavigate?: (Page: PageId) => void;
  OnLogout?: () => void;
  CanGoBack?: boolean;
  CanGoForward?: boolean;
  OnGoBack?: () => void;
  OnGoForward?: () => void;
  Username?: string;
  SkinUrl?: string;
  PlayerCount?: number | null;
}

export function Frame({ ActivePage, OnNavigate, OnLogout, CanGoBack = false, CanGoForward = false, OnGoBack, OnGoForward, Username = "", SkinUrl = "", PlayerCount = null }: FrameProps) {
  const [ProfileMenuOpen, SetProfileMenuOpen] = useState(false);
  const [SignOutConfirming, SetSignOutConfirming] = useState(false);
  const ProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ProfileMenuOpen) return;
    const HandleOutsideClick = (Event: MouseEvent) => {
      if (Event.target instanceof Node && !ProfileRef.current?.contains(Event.target)) {
        SetProfileMenuOpen(false);
        SetSignOutConfirming(false);
      }
    };
    document.addEventListener("mousedown", HandleOutsideClick);
    return () => document.removeEventListener("mousedown", HandleOutsideClick);
  }, [ProfileMenuOpen]);

  return (
    <div className="window-header">
      <div className="window-drag-region" onPointerDown={BeginDrag} />
      {ActivePage && <div className="frame-tab-arrows" aria-label="Page navigation">
        <button className="frame-tab-arrow" type="button" aria-label="Previous page" disabled={!CanGoBack} onClick={() => { PlayClick(); OnGoBack?.(); }}>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="frame-tab-arrow" type="button" aria-label="Next page" disabled={!CanGoForward} onClick={() => { PlayClick(); OnGoForward?.(); }}>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>}
      <div className="frame-title">{Project().Name} Launcher</div>
      <div className="frame-right-actions">
        {ActivePage && <div className="frame-player-status" aria-label={`${PlayerCount ?? "..."} Players Online`}>
          <div className="frame-player-profile" ref={ProfileRef} data-tour="profile-menu">
            <button className="frame-player-avatar" type="button" aria-label="Open player menu" aria-expanded={ProfileMenuOpen} onClick={() => { PlayClick(); SetProfileMenuOpen((Open) => !Open); SetSignOutConfirming(false); }}>
              {SkinUrl ? <img src={SkinUrl} alt={Username || "Player"} /> : <span>{(Username || "P").charAt(0).toUpperCase()}</span>}
            </button>
            <AnimatePresence>
              {ProfileMenuOpen && (
                <motion.div
                  className="frame-player-menu"
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button className="frame-support-button" type="button" onClick={() => { PlayClick(); SetProfileMenuOpen(false); void OpenUrl(Project().SupportServerURL); }}><span className="material-symbols-outlined">help</span><span>Support</span><span className="material-symbols-outlined">open_in_new</span></button>
                  <button type="button" onClick={() => { PlayClick(); if (SignOutConfirming) { SetProfileMenuOpen(false); OnLogout?.(); return; } SetSignOutConfirming(true); }}>
                    <span className="material-symbols-outlined frame-logout-icon">logout</span>{SignOutConfirming ? "Are You Sure?" : "Sign Out"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="online-dot" />
          <strong>{PlayerCount ?? "..."}</strong>
          <span>Players Online</span>
        </div>}
        {ActivePage && <>
          <span className="frame-actions-divider" aria-hidden="true" />
          <button className="frame-settings-button" type="button" data-tour="settings-button" aria-label="Settings" onClick={() => { PlayClick(); OnNavigate?.("settings"); }}>
            <Settings size={15} />
          </button>
        </>}
        {ActivePage && <span className="frame-actions-divider" aria-hidden="true" />}
        <div className="window-controls-shell">
          <button className="frame-control" aria-label="Minimize" onClick={() => { PlayClick(); void MinimizeWindow(); }}>
            <Minus size={13} strokeWidth={2.25} />
          </button>
          <button className="frame-control frame-control-close" aria-label="Close" onClick={() => { PlayClick(); void CloseWindow(); }}>
            <X size={13} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
}
