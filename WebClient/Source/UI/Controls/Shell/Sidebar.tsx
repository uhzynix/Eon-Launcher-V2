import { useRef } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Pages, type PageId } from "../../../Core/Configuration/PageDefinitions";
import { UseSidebarShader } from "../../../Core/Hooks/UseSidebarShader";

const LongLabelLength = 10;

interface SidebarProps {
  ActivePage: PageId;
  OnNavigate: (Page: PageId) => void;
}

export function Sidebar({ ActivePage, OnNavigate }: SidebarProps) {
  const ShaderRef = useRef<HTMLCanvasElement>(null);
  const NavigationPages = Pages.filter((Page) => Page.Id !== "settings");

  UseSidebarShader(ShaderRef);

  return (
    <nav className="app-sidebar">
      <canvas ref={ShaderRef} className="app-sidebar-shader" aria-hidden="true" />
      <LayoutGroup>
        <div className="app-sidebar-nav" data-tour="nav-group">
          <AnimatePresence initial={false}>
            {NavigationPages.map((Page, Index) => (
              <motion.button
                key={Page.Id}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.22, delay: 0.015 * Index, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.92 }}
                className={`app-sidebar-item ${Page.Id === ActivePage ? "active" : ""}`}
                data-tour={`nav-${Page.Id}`}
                aria-label={Page.Label}
                onClick={() => OnNavigate(Page.Id)}
              >
                {Page.Id === ActivePage && (
                  <motion.span layoutId="nav-active" className="nav-active-bg" transition={{ type: "spring", stiffness: 520, damping: 38 }} />
                )}
                <span className="nav-icon">
                  <Page.Icon size={19} />
                </span>
                <span className={`nav-label${Page.Label.length > LongLabelLength ? " nav-label-small" : ""}`}>{Page.Label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </nav>
  );
}
