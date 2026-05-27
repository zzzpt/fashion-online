"use client";

import type { ClothingCategory } from "@/stores/wardrobeStore";

interface CategoryFilterProps {
  categories: { key: ClothingCategory | "all"; label: string }[];
  active: ClothingCategory | "all";
  onChange: (key: ClothingCategory | "all") => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`shrink-0 px-3.5 py-1.5 text-xs rounded-full border transition-colors ${
            active === cat.key
              ? "bg-rose-400 text-white border-rose-400"
              : "border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-400"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}