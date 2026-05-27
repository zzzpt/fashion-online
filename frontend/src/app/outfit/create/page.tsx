"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { OutfitCanvas } from "@/components/outfit/OutfitCanvas";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { ClothingItem } from "@/stores/wardrobeStore";
import type { CanvasItem } from "@/stores/outfitStore";

export default function OutfitCreatePage() {
  const router = useRouter();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const data = await api.get("api/clothing?limit=200").json<{
        items: { id: string; image_url: string; image_no_bg_url?: string; category: string }[];
      }>();
      setItems(
        data.items.map((raw) => ({
          id: raw.id,
          userId: "",
          imageUrl: raw.image_no_bg_url || raw.image_url,
          category: raw.category as ClothingItem["category"],
          isFavorite: false,
          wearCount: 0,
          status: "ready" as const,
          createdAt: "",
        })),
      );
    } catch {
      toast.error("加载衣物失败");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleSave(canvasItems: CanvasItem[]) {
    try {
      await api.post("api/looks", {
        json: {
          title: "我的搭配",
          items: canvasItems.map((ci) => ({
            clothing_id: ci.clothingId,
            position_x: ci.positionX,
            position_y: ci.positionY,
            scale: ci.scale,
            rotation: ci.rotation,
            z_index: ci.zIndex,
          })),
        },
      });
      toast.success("搭配已保存");
      router.push("/profile/looks");
    } catch {
      toast.error("保存失败");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg min-h-screen">
        <TopBar title="搭配画布" showBack />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen">
      <TopBar title="搭配画布" showBack />
      <div className="px-4 pt-4">
        <OutfitCanvas clothingItems={items} onSave={handleSave} />
      </div>
    </div>
  );
}