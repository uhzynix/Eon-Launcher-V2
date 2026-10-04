import { createPortal } from "react-dom";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { ShopCard } from "./ShopCard";
import type { ShopItem } from "../../../Types/Shop";

interface ShopItemModalProps {
  Item: ShopItem;
  OnConfirm: (Item: ShopItem) => void;
  OnCancel: () => void;
}

export function ShopItemModal({ Item, OnConfirm, OnCancel }: ShopItemModalProps) {
  return createPortal(
    <div className="logout-modal-backdrop" role="presentation" onMouseDown={OnCancel}>
      <section
        className="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-item-confirm-title"
        onMouseDown={(Event) => Event.stopPropagation()}
      >
        <div className="shop-confirm-layout">
          <ShopCard Item={Item} Interactive={false} Extra=" shop-confirm-card" />
          <div className="shop-confirm-copy">
            <h2 id="shop-item-confirm-title">Open item link?</h2>
            <p>Open {Item.Name} in your browser?</p>
            <div className="logout-modal-actions">
              <button className="secondary" onClick={() => { PlayClick(); OnCancel(); }}>Cancel</button>
              <button className="play-confirm-button" onClick={() => OnConfirm(Item)}>Open link</button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
