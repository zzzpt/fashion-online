"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Edit3, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { toast } from "sonner";

const categoryLabelMap: Record<string, string> = {
  top: "上衣", bottom: "下装", dress: "连衣裙",
  outerwear: "外套", shoes: "鞋子", bag: "包袋", accessory: "配饰",
};

interface ClothingDetail {
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

export default function ClothingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ClothingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItem = useCallback(async () => {
    try {
      const data = await api.get(`api/clothing/${id}`).json<ClothingDetail>();
      setItem(data);
    } catch {
      toast.error("加载失败");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  async function handleToggleFavorite() {
    if (!item) return;
    const next = !item.is_favorite;
    try {
      await api.patch(`api/clothing/${id}`, { json: { is_favorite: next } });
      setItem({ ...item, is_favorite: next });
    } catch {
      toast.error("操作失败");
    }
  }

  async function handleDelete() {
    if (!confirm("确定删除这件衣物吗？")) return;
    try {
      await api.delete(`api/clothing/${id}`);
      toast.success("已删除");
      window.location.href = "/wardrobe";
    } catch {
      toast.error("删除失败");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg bg-white min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-lg bg-white min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">衣物不存在</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg bg-white min-h-screen">
      <header className="flex items-center justify-between h-12 px-4">
        <Link
          href="/wardrobe"
          className="flex items-center justify-center h-8 w-8 -ml-1 rounded-full hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleFavorite}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50"
          >
            <Heart
              className={`h-4 w-4 ${item.is_favorite ? "text-red-400 fill-red-400" : "text-gray-400"}`}
            />
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50">
            <Edit3 className="h-4 w-4 text-gray-400" />
          </button>
          <button
            onClick={handleDelete}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50"
          >
            <Trash2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden relative">
          <Image
            src={item.image_url}
            alt={item.category}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 480px"
          />
        </div>

        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            {categoryLabelMap[item.category] || item.category}
          </h1>
          {item.sub_category && (
            <p className="text-sm text-gray-400 mt-0.5">{item.sub_category}</p>
          )}
        </div>

        <Separator />

        {item.color && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">颜色</span>
            <span className="text-sm text-gray-600">{item.color}</span>
          </div>
        )}

        {item.style_tags && item.style_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.style_tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-rose-50 text-rose-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.ai_description && (
          <>
            <Separator />
            <p className="text-sm text-gray-500 leading-relaxed">
              {item.ai_description}
            </p>
          </>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-sm">
          {item.brand && (
            <div>
              <span className="text-xs text-gray-400">品牌</span>
              <p className="text-gray-600">{item.brand}</p>
            </div>
          )}
          {item.material && (
            <div>
              <span className="text-xs text-gray-400">材质</span>
              <p className="text-gray-600">{item.material}</p>
            </div>
          )}
          {item.season && item.season.length > 0 && (
            <div>
              <span className="text-xs text-gray-400">季节</span>
              <p className="text-gray-600">{item.season.join(" / ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}