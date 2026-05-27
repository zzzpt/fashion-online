"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Camera, Shirt } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useWardrobeStore, type ClothingCategory } from "@/stores/wardrobeStore";

const categories: { key: ClothingCategory | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "top", label: "上衣" },
  { key: "bottom", label: "下装" },
  { key: "dress", label: "连衣裙" },
  { key: "outerwear", label: "外套" },
  { key: "shoes", label: "鞋子" },
  { key: "accessory", label: "配饰" },
];

const categoryLabelMap: Record<string, string> = {
  top: "上衣", bottom: "下装", dress: "连衣裙",
  outerwear: "外套", shoes: "鞋子", bag: "包袋", accessory: "配饰",
};

export default function WardrobePage() {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const { items, setItems } = useWardrobeStore();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all") params.set("category", activeCategory);
      const data = await api.get(`api/clothing?${params}`).json<{ items: WardrobeItem[] }>();
      setItems(data.items.map(mapItem));
    } catch {
      // 静默处理，显示空状态
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, setItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const displayedItems = activeCategory === "all"
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="mx-auto max-w-lg">
      <TopBar
        title="我的衣柜"
        rightAction={
          <Button
            size="sm"
            className="h-8 px-3 text-xs bg-rose-400 hover:bg-rose-500"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            添加
          </Button>
        }
      />

      <div className="px-4 pt-4">
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`shrink-0 px-3.5 py-1.5 text-xs rounded-full border transition-colors ${
                activeCategory === cat.key
                  ? "bg-rose-400 text-white border-rose-400"
                  : "border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <Separator className="my-4" />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">加载中...</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <Shirt className="h-8 w-8 text-rose-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium">衣柜还是空的</p>
            <p className="text-xs text-gray-400 mt-1 mb-6">
              拍照上传你的第一件衣服吧
            </p>
            <Button className="bg-rose-400 hover:bg-rose-500 gap-2" size="sm">
              <Camera className="h-4 w-4" />
              拍照上传
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {displayedItems.map((item) => (
              <Link
                key={item.id}
                href={`/wardrobe/${item.id}`}
                className="group"
              >
                <div className="aspect-[3/4] rounded-xl bg-gray-100 overflow-hidden relative">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.category}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 480px) 33vw, 160px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Shirt className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                  {item.isFavorite && (
                    <span className="absolute top-1.5 right-1.5 text-xs">❤️</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1.5 truncate">
                  {categoryLabelMap[item.category] || item.category}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── helpers ──

interface WardrobeItem {
  id: string;
  image_url: string;
  image_no_bg_url?: string;
  category: string;
  sub_category?: string;
  color?: string;
  color_palette?: string[];
  material?: string;
  brand?: string;
  season?: string[];
  style_tags?: string[];
  ai_description?: string;
  is_favorite: boolean;
  wear_count: number;
  created_at: string;
  updated_at: string;
}

function mapItem(raw: WardrobeItem) {
  return {
    id: raw.id,
    userId: "",
    imageUrl: raw.image_url,
    imageNoBgUrl: raw.image_no_bg_url,
    category: raw.category as ClothingCategory,
    subCategory: raw.sub_category,
    color: raw.color,
    colorPalette: raw.color_palette,
    material: raw.material,
    brand: raw.brand,
    season: raw.season,
    styleTags: raw.style_tags,
    aiDescription: raw.ai_description,
    isFavorite: raw.is_favorite,
    wearCount: raw.wear_count,
    status: "ready" as const,
    createdAt: raw.created_at,
  };
}