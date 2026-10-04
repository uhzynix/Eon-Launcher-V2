export interface ShopItem {
  Name: string;
  Price: number;
  Image: string;
  Rarity: string;
  Type: string;
  Href: string;
}

export interface ShopSection {
  Title: string;
  Items: ShopItem[];
}

export interface ShopCardProps {
  Item: ShopItem;
  Interactive: boolean;
  Extra?: string;
  OnOpen?: (Item: ShopItem) => void;
}
