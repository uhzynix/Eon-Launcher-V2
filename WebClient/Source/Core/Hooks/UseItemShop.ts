import { useCallback, useEffect, useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { Project } from "../Services/ProjectStore";
import { GetLegacyItemNames } from "../Services/ShopCatalog";
import { ParseShop } from "../Services/ShopParser";
import type { ShopSection } from "../../Types/Shop";

export interface ItemShop {
  Status: "loading" | "ok" | "error";
  Sections: ShopSection[];
  RotationDate: string;
  Reload: () => void;
}

export function UseItemShop(): ItemShop {
  const [Status, SetStatus] = useState<"loading" | "ok" | "error">("loading");
  const [Sections, SetSections] = useState<ShopSection[]>([]);
  const [RotationDate, SetRotationDate] = useState("");

  const Reload = useCallback(() => {
    SetStatus("loading");

    Promise.all([Invoke<string>("FetchRemotePage", { Url: Project().ItemShopURL }), GetLegacyItemNames()])
      .then(([Html, LegacyNames]) => {
        SetSections(ParseShop(Html, LegacyNames));
        SetRotationDate(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
        SetStatus("ok");
      })
      .catch(() => SetStatus("error"));
  }, []);

  useEffect(() => {
    Reload();
  }, [Reload]);

  return { Status, Sections, RotationDate, Reload };
}
