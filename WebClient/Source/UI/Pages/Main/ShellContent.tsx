import { AnimatePresence, motion } from "framer-motion";
import { Pages, type PageId } from "../../../Core/Configuration/PageDefinitions";

const PlainPages: PageId[] = ["play", "shop", "leaderboard", "status", "settings"];

interface ShellContentProps {
  ActivePage: PageId;
  children: React.ReactNode;
}

export function ShellContent({ ActivePage, children }: ShellContentProps) {
  const Current = Pages.find((Page) => Page.Id === ActivePage) ?? Pages[0];
  const IsPlay = ActivePage === "play";
  const IsDownloads = ActivePage === "downloads";
  const ShowHeader = !PlainPages.includes(ActivePage);

  return (
    <section className={`content content-${ActivePage}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={ActivePage}
          initial={IsPlay ? false : { opacity: 0, y: IsDownloads ? 4 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={IsPlay ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: IsDownloads ? 0.1 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform, opacity" }}
        >
          {ShowHeader && (
            <div className="content-header">
              <div>
                {!IsDownloads && <span className="eyebrow">{Current.Label}</span>}
                <h1>{Current.Label}</h1>
              </div>
            </div>
          )}
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
