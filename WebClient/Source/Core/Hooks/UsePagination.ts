import { useEffect, useState } from "react";

export interface Pagination<Item> {
  Page: number;
  PageCount: number;
  Items: Item[];
  Previous: () => void;
  Next: () => void;
}

export function UsePagination<Item>(Source: Item[], PerPage: number, ResetKey: string): Pagination<Item> {
  const [Page, SetPage] = useState(0);
  const PageCount = Math.ceil(Source.length / PerPage);

  useEffect(() => {
    SetPage(0);
  }, [ResetKey]);

  const Start = Page * PerPage;

  return {
    Page,
    PageCount,
    Items: Source.slice(Start, Start + PerPage),
    Previous: () => SetPage((Value) => Math.max(0, Value - 1)),
    Next: () => SetPage((Value) => Math.min(PageCount - 1, Value + 1)),
  };
}
