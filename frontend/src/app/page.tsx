"use client";

import Link from "next/link";
import { Sparkles, CloudSun, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="mx-auto max-w-lg">
      <TopBar title="Fashion Online" showSearch={false} />

      <div className="px-4 pt-6 pb-8">
        {/* 今日推荐区域 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">今日推荐</h2>
            <span className="text-xs text-rose-400 flex items-center gap-1">
              <CloudSun className="h-3.5 w-3.5" />
              上海 24° 晴
            </span>
          </div>

          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-rose-100 to-rose-50">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="h-8 w-8 text-rose-300 mb-3" />
              {user ? (
                <>
                  <p className="text-sm text-rose-400 font-medium">
                    去看看今天穿什么
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    AI 会根据天气和场景为你推荐搭配
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-rose-400 font-medium">
                    上传你的第一件衣服
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    AI 会根据天气和场景为你推荐搭配
                  </p>
                  <Link href="/auth/login" className="mt-4">
                    <Button size="sm" className="bg-rose-400 hover:bg-rose-500">
                      登录 / 注册
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 灵感流区域 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">搭配灵感</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-rose-400 hover:text-rose-500"
            >
              查看更多
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl bg-gray-100 flex items-center justify-center"
              >
                <Sparkles className="h-5 w-5 text-gray-300" />
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 py-8 text-center">
          <p className="text-sm text-gray-400">还没有搭配灵感？</p>
          <p className="text-xs text-gray-300 mt-1">
            上传衣物后 AI 会为你生成专属搭配
          </p>
        </div>
      </div>
    </div>
  );
}