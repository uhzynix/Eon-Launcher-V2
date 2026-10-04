import type { ShopItem, ShopSection } from "../../Types/Shop";

const NodeSelector = "h2.shop-section-title, a.item-display.splash-card";

function ReadItem(Element: Element): ShopItem {
  const Href = Element.getAttribute("href") ?? "";
  const RarityMatch = Element.className.match(/rarity-([a-z0-9]+)/i);
  const TypeMatch = Href.match(/^\/([a-z]+)\//);
  const PriceText = Element.querySelector("p.item-price")?.textContent?.replace(/[^0-9]/g, "") ?? "0";

  return {
    Name: Element.querySelector("h4.item-name span")?.textContent?.trim() || "Item",
    Price: parseInt(PriceText, 10) || 0,
    Image: Element.querySelector("img.desktop-img")?.getAttribute("src") ?? "",
    Rarity: RarityMatch ? RarityMatch[1].toLowerCase() : "common",
    Type: TypeMatch ? TypeMatch[1].toLowerCase() : "item",
    Href,
  };
}

export function ParseShop(Html: string, LegacyNames: Set<string>): ShopSection[] {
  const Document = new DOMParser().parseFromString(Html, "text/html");
  const Sections: ShopSection[] = [];
  let Current: ShopSection | null = null;

  for (const Element of Array.from(Document.querySelectorAll(NodeSelector))) {
    if (Element.classList.contains("shop-section-title")) {
      Current = { Title: Element.textContent?.trim() || "Items", Items: [] };
      Sections.push(Current);
      continue;
    }

    if (!Current) continue;

    const Item = ReadItem(Element);
    if (Item.Type === "bundle") continue;
    if (LegacyNames.size > 0 && !LegacyNames.has(Item.Name.trim().toLowerCase())) continue;

    Current.Items.push(Item);
  }

  return Sections.filter((Section) => Section.Items.length > 0);
}
