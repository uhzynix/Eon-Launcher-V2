import { useRef, useState } from "react";
import type { PageId } from "../Configuration/PageDefinitions";
import { PlayClick } from "../Services/SoundEffects";

export interface PageHistory {
  ActivePage: PageId;
  CanGoBack: boolean;
  CanGoForward: boolean;
  Navigate: (Page: PageId) => void;
  GoBack: () => void;
  GoForward: () => void;
  Reset: () => void;
}

export function UsePageHistory(Initial: PageId): PageHistory {
  const [ActivePage, SetActivePage] = useState<PageId>(Initial);
  const Entries = useRef<PageId[]>([Initial]);
  const Index = useRef(0);

  function Navigate(Page: PageId) {
    if (Page === ActivePage) return;
    PlayClick();
    SetActivePage(Page);
    const Next = Entries.current.slice(0, Index.current + 1);
    Next.push(Page);
    Entries.current = Next;
    Index.current = Next.length - 1;
  }

  function GoBack() {
    if (Index.current === 0) return;
    Index.current -= 1;
    SetActivePage(Entries.current[Index.current] ?? Initial);
  }

  function GoForward() {
    if (Index.current >= Entries.current.length - 1) return;
    Index.current += 1;
    SetActivePage(Entries.current[Index.current] ?? Initial);
  }

  function Reset() {
    Entries.current = [Initial];
    Index.current = 0;
    SetActivePage(Initial);
  }

  return {
    ActivePage,
    CanGoBack: Index.current > 0,
    CanGoForward: Index.current < Entries.current.length - 1,
    Navigate,
    GoBack,
    GoForward,
    Reset,
  };
}
