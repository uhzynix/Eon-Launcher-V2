import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlayClick } from "../../../Core/Services/SoundEffects";

interface ServerPaginationProps {
  Page: number;
  PageCount: number;
  OnPrevious: () => void;
  OnNext: () => void;
}

export function ServerPagination({ Page, PageCount, OnPrevious, OnNext }: ServerPaginationProps) {
  return (
    <div className="ss-pagination">
      <button className="icon-button" type="button" aria-label="Previous page" disabled={Page === 0} onClick={() => { PlayClick(); OnPrevious(); }}>
        <ChevronLeft size={18} />
      </button>
      <span>Page {Page + 1} of {PageCount}</span>
      <button className="icon-button" type="button" aria-label="Next page" disabled={Page >= PageCount - 1} onClick={() => { PlayClick(); OnNext(); }}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
