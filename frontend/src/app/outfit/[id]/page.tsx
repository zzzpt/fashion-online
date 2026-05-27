"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface LookDetail {
  id: string;
  title: string | null;
  description: string | null;
  cover_image_url: string | null;
  scene: string | null;
  season: string | null;
  like_count: number;
  is_public: boolean;
  created_at: string;
  items: {
    id: string;
    clothing_id: string;
    position_x: number | null;
    position_y: number | null;
    scale: number;
    rotation: number;
    z_index: number;
    clothing?: {
      id: string;
      image_url: string;
      category: string;
    };
  }[];
}

export default function LookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [look, setLook] = useState<LookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLook = useCallback(async () => {
    try {
      const data = await api.get(`api/looks/${id}`).json<LookDetail>();
      setLook(data);
    } catch {
      toast.error("加载失败");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLook();
  }, [fetchLook]);

  async function handleLike() {
    if (!look) return;
    try {
      const updated = await api.post(`api/looks/${id}/like`).json<LookDetail>();
      setLook({ ...look, like_count: updated.like_count });
    } catch {
      toast.error("操作失败");
    }
  }

  async function handleDelete() {
    if (!confirm("确定删除这个搭配吗？")) return;
    try {
      await api.delete(`api/looks/${id}`);
      toast.success("已删除");
      router.push("/profile/looks");
    } catch {
      toast.error("删除失败");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg bg-white min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!look) {
    return (
      <div className="mx-auto max-w-lg bg-white min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">搭配不存在</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg bg-white min-h-screen">
      <header className="flex items-center justify-between h-12 px-4">
        <Link
          href="/outfit"
          className="flex items-center justify-center h-8 w-8 -ml-1 rounded-full hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className="h-8 px-2 flex items-center gap-0.5 rounded-full hover:bg-gray-50 text-xs text-gray-400"
          >
            <Heart className="h-4 w-4" />
            {look.like_count}
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50">
            <Share2 className="h-4 w-4 text-gray-400" />
          </button>
          <button
            onClick={handleDelete}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50"
          >
            <Trash2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden relative mb-6">
          {look.cover_image_url ? (
            <Image
              src={look.cover_image_url}
              alt={look.title || "搭配"}
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 480px"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm text-gray-300">搭配展示</span>
            </div>
          )}
        </div>

        <h1 className="text-lg font-semibold text-gray-800">
          {look.title || "未命名搭配"}
        </h1>
        {look.description && (
          <p className="text-sm text-gray-400 mt-1">{look.description}</p>
        )}

        <Separator className="my-6" />

        {look.items.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-600">使用单品</h2>
            <div className="grid grid-cols-3 gap-2">
              {look.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/wardrobe/${item.clothing_id}`}
                  className="aspect-square rounded-xl bg-gray-100 overflow-hidden relative"
                >
                  {item.clothing?.image_url ? (
                    <Image
                      src={item.clothing.image_url}
                      alt={item.clothing.category}
                      fill
                      className="object-cover"
                      sizes="(max-width: 480px) 33vw, 160px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs text-gray-400">单品</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}