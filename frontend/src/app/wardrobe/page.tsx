"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Separator } from "@/components/ui/separator";
import { CategoryFilter } from "@/components/wardrobe/CategoryFilter";
import { ClothingGrid } from "@/components/wardrobe/ClothingGrid";
import { EmptyWardrobe } from "@/components/wardrobe/EmptyWardrobe";
import { UploadButton } from "@/components/wardrobe/UploadButton";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { api, uploadFile } from "@/lib/api";
import { toast } from "sonner";
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
      // 静默处理
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, setItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleUpload(file: File) {
    try {
      const result = await uploadFile("api/clothing/upload", file);
      const raw = result as WardrobeItem;
      useWardrobeStore.getState().addItem(mapItem(raw));
      toast.success("上传成功，AI 已自动识别");
    } catch {
      toast.error("上传失败");
    }
  }

  const displayedItems = activeCategory === "all"
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="mx-auto max-w-lg">
      <TopBar
        title="我的衣柜"
        rightAction={<UploadButton onUpload={handleUpload} />}
      />

      <div className="px-4 pt-4">
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <Separator className="my-4" />

        {isLoading ? (
          <LoadingSpinner />
        ) : displayedItems.length === 0 ? (
          <EmptyWardrobe onUpload={handleUpload} />
        ) : (
          <ClothingGrid items={displayedItems} />
        )}
      </div>
    </div>
  );
}