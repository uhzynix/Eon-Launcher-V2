import { useState } from "react";
import { OpenUrl } from "../../../Core/Bridge/Bridge";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { Project } from "../../../Core/Services/ProjectStore";
import { ItemBase } from "../../../Core/Configuration/ShopRarity";
import { UseItemShop } from "../../../Core/Hooks/UseItemShop";
import { ExternalLinkIcon, RefreshIcon } from "../../Controls/Icons/ShopIcons";
import { ShopCard } from "./ShopCard";
import { ShopItemModal } from "./ShopItemModal";
import type { ShopItem } from "../../../Types/Shop";

export function ItemShopPage() {
  const Shop = UseItemShop();
  const [PendingItem, SetPendingItem] = useState<ShopItem | null>(null);

  function OpenItem(Item: ShopItem) {
    PlayClick();
    void OpenUrl(ItemBase + Item.Href).catch(() => {});
    SetPendingItem(null);
  }

  function Refresh() {
    PlayClick();
    Shop.Reload();
  }

  return (
    <div className="shop">
      <div className="shop-bar">
        <div>
          <h2 className="shop-title">Item Shop</h2>
          <p className="muted">{Shop.RotationDate || "Loading the latest rotation..."}</p>
        </div>
        <div className="shop-bar-actions">
          <button className="icon-button" aria-label="Refresh" onClick={Refresh}>
            <RefreshIcon />
          </button>
          <a className="text-button" href={Project().ItemShopURL} target="_blank" rel="noreferrer" onClick={() => PlayClick()}>
            Open in store
            <ExternalLinkIcon />
          </a>
        </div>
      </div>

      {Shop.Status === "loading" && (
        <div className="shop-center">
          <div className="splash-spinner" />
        </div>
      )}

      {Shop.Status === "error" && (
        <div className="shop-center">
          <p className="muted">The item shop could not be loaded right now.</p>
          <button className="primary" onClick={Refresh}>Try again</button>
        </div>
      )}

      {Shop.Status === "ok" &&
        Shop.Sections.map((Section, SectionIndex) => (
          <section className="shop-section" key={`${Section.Title}-${SectionIndex}`}>
            <h2 className="shop-section-title">{Section.Title}</h2>
            <div className="shop-grid">
              {Section.Items.map((Item, Index) => (
                <ShopCard
                  key={`${Section.Title}-${Index}-${Item.Name}`}
                  Item={Item}
                  Interactive
                  OnOpen={(Value) => { PlayClick(); SetPendingItem(Value); }}
                />
              ))}
            </div>
          </section>
        ))}

      {PendingItem && <ShopItemModal Item={PendingItem} OnConfirm={OpenItem} OnCancel={() => SetPendingItem(null)} />}
    </div>
  );
}
