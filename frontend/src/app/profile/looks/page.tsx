"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/layout/TopBar";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api";

interface LookItem {
  id: string;
  title: string | null;
  cover_image_url: string | null;
  like_count: number;
  is_public: boolean;
  created_at: string;
}

export default function LooksPage() {
  const [looks, setLooks] = useState<LookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLooks = useCallback(async () => {
    try {
      const data = await api.get("api/looks").json<{ items: LookItem[] }>();
      setLooks(data.items);
    } catch {
      // 静默处理
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLooks();
  }, [fetchLooks]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen">
      <TopBar title="我的 Looks" showBack />

      {looks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-rose-300" />
          </div>
          <p className="text-sm text-gray-400">还没有保存搭配</p>
          <p className="text-xs text-gray-300 mt-1">
            创建搭配后会自动保存在这里
          </p>
        </div>
      ) : (
        <div className="px-4 pt-4 grid grid-cols-2 gap-3">
          {looks.map((look) => (
            <Link key={look.id} href={`/outfit/${look.id}`} className="group">
              <div className="aspect-[3/4] rounded-xl bg-gray-100 overflow-hidden relative">
                {look.cover_image_url ? (
                  <Image
                    src={look.cover_image_url}
                    alt={look.title || "搭配"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 480px) 50vw, 240px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Sparkles className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1.5 truncate">
                {look.title || "未命名搭配"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}