"use client";

import type { ClothingItem } from "@/stores/wardrobeStore";
import { ClothingCard } from "./ClothingCard";

const categoryLabelMap: Record<string, string> = {
  top: "上衣", bottom: "下装", dress: "连衣裙",
  outerwear: "外套", shoes: "鞋子", bag: "包袋", accessory: "配饰",
};

interface ClothingGridProps {
  items: ClothingItem[];
}

export function ClothingGrid({ items }: ClothingGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <ClothingCard
          key={item.id}
          id={item.id}
          imageUrl={item.imageUrl}
          category={item.category}
          isFavorite={item.isFavorite}
          categoryLabel={categoryLabelMap[item.category] || item.category}
        />
      ))}
    </div>
  );
}