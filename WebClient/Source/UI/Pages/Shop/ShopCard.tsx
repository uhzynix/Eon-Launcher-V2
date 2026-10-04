import type { CSSProperties, KeyboardEvent } from "react";
import { DefaultRarityColor, RarityColor, RarityGradient, TypeLabel, VBuckIcon } from "../../../Core/Configuration/ShopRarity";
import { ToPascal } from "../../../Core/Services/TextCase";
import type { ShopCardProps } from "../../../Types/Shop";

export function ShopCard({ Item, Interactive, Extra = "", OnOpen }: ShopCardProps) {
  const Style = {
    "--card": RarityColor[ToPascal(Item.Rarity)] ?? DefaultRarityColor,
    "--card-bg": RarityGradient[ToPascal(Item.Rarity)] ?? RarityGradient.Epic,
  } as CSSProperties;

  function HandleKeyDown(Event: KeyboardEvent<HTMLElement>) {
    if (Event.key !== "Enter" && Event.key !== " ") return;
    OnOpen?.(Item);
  }

  const Interaction = Interactive && OnOpen ? { role: "button", tabIndex: 0, onClick: () => OnOpen(Item), onKeyDown: HandleKeyDown } : {};

  return (
    <article className={`shop-card${Extra}`} style={Style} {...Interaction}>
      {Item.Image ? (
        <img className="shop-card-img" src={Item.Image} alt={Item.Name} loading="lazy" />
      ) : (
        <div className="shop-card-img shop-card-img--empty" />
      )}
      <span className="shop-card-rarity-bar" />
      <div className="shop-card-overlay">
        <span className="shop-card-rarity" style={{ color: RarityColor[ToPascal(Item.Rarity)] ?? "#fff" }}>
          {TypeLabel[ToPascal(Item.Type)] ?? Item.Type}
        </span>
        <h3 className="shop-card-name">{Item.Name}</h3>
        <div className="shop-card-foot">
          <span className="shop-price">
            <img src={VBuckIcon} alt="" />
            {Item.Price.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
