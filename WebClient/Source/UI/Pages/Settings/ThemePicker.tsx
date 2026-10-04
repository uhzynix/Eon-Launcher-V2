import { useState, type CSSProperties } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Themes, type ThemeId } from "../../../Core/Configuration/Themes";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { ThemePreview } from "../../Controls/Settings/ThemePreview";

interface ThemePickerProps {
  Theme: ThemeId;
  OnSelectTheme: (Theme: ThemeId) => void;
}

export function ThemePicker({ Theme, OnSelectTheme }: ThemePickerProps) {
  const [IsOpen, SetIsOpen] = useState(false);
  const Current = Themes.find((Option) => Option.Id === Theme) ?? Themes[0];

  return (
    <motion.section
      className="settings-list settings-list-about"
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.52, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <motion.div className="about-expander" layout>
        <button className="about-row about-toggle" type="button" aria-expanded={IsOpen} onClick={() => { PlayClick(); SetIsOpen((Open) => !Open); }}>
          <div className="about-heading">
            <span className="theme-current-preview" style={{ "--swatch-color": Current.Swatch } as CSSProperties} aria-hidden="true">
              <ThemePreview />
            </span>
            <div>
              <strong>Theme</strong>
              <span>{Current.Label}</span>
            </div>
          </div>
          <ChevronDown className={`about-chevron${IsOpen ? " is-open" : ""}`} size={18} strokeWidth={2.2} />
        </button>
        {IsOpen && (
          <div className="about-body">
            <div className="theme-body-inner">
              <LayoutGroup>
                <div className="theme-swatches">
                  {Themes.map((Option) => (
                    <button
                      key={Option.Id}
                      type="button"
                      className={`theme-swatch${Theme === Option.Id ? " active" : ""}`}
                      style={{ "--swatch-color": Option.Swatch } as CSSProperties}
                      aria-pressed={Theme === Option.Id}
                      onClick={() => { PlayClick(); OnSelectTheme(Option.Id); }}
                    >
                      <span className="theme-preview">
                        {Theme === Option.Id && (
                          <motion.span layoutId="theme-active-ring" className="theme-preview-ring" transition={{ type: "spring", stiffness: 520, damping: 38 }} />
                        )}
                        <ThemePreview />
                      </span>
                      <span className="theme-swatch-label">{Option.Label}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
