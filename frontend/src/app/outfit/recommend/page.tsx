"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecItem {
  id: string;
  image_url: string;
  image_no_bg_url?: string;
  category: string;
  color?: string;
  style_tags?: string[];
}

interface Recommendation {
  weather: { city: string; temp: number; condition: string };
  look_title: string;
  description: string;
  items: RecItem[];
  style_note: string;
}

const categoryLabelMap: Record<string, string> = {
  top: "上衣", bottom: "下装", dress: "连衣裙",
  outerwear: "外套", shoes: "鞋子", bag: "包袋", accessory: "配饰",
};

export default function AIRecommendPage() {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRec = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get("api/ai/recommend").json<Recommendation>();
      setRec(data);
    } catch {
      // 静默
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRec();
  }, [fetchRec]);

  return (
    <div className="mx-auto max-w-lg min-h-screen">
      <TopBar
        title="AI 今日推荐"
        showBack
        rightAction={
          <Button variant="ghost" size="sm" onClick={fetchRec} className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4 text-gray-400" />
          </Button>
        }
      />

      <div className="px-4 pt-4 pb-8">
        {isLoading ? (
          <LoadingSpinner text="AI 正在分析你的衣柜..." />
        ) : !rec ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles className="h-8 w-8 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">暂无推荐数据</p>
            <p className="text-xs text-gray-300 mt-1">先上传几件衣服试试吧</p>
          </div>
        ) : (
          <>
            {/* 天气信息 */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-rose-400" />
                  <span className="text-xs font-medium text-rose-500">AI 推荐</span>
                </div>
                <span className="text-xs text-gray-400">
                  {rec.weather.city} {rec.weather.temp}°C {rec.weather.condition}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {rec.look_title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
              <p className="text-xs text-rose-400 mt-2">✨ {rec.style_note}</p>
            </div>

            {/* 推荐单品 */}
            {rec.items.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {rec.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/wardrobe/${item.id}`}
                    className="group"
                  >
                    <div className="aspect-[3/4] rounded-xl bg-gray-100 overflow-hidden relative">
                      <Image
                        src={`http://localhost:8000${item.image_url}`}
                        alt={item.category}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 480px) 33vw, 160px"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 truncate">
                      {categoryLabelMap[item.category] || item.category}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}