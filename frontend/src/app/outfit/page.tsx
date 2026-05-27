"use client";

import Link from "next/link";
import { Sparkles, Wand2, Palette } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function OutfitPage() {
  return (
    <div className="mx-auto max-w-lg">
      <TopBar title="搭配" />

      <div className="px-4 pt-6">
        <section className="mb-8 space-y-3">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-xs font-medium text-rose-500">AI 今日推荐</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">今天穿什么？</p>
              <p className="text-sm text-gray-500 mt-1">
                AI 根据天气和你的衣柜智能推荐搭配
              </p>
              <Link href="/outfit/recommend">
              <Button size="sm" className="mt-3 bg-rose-400 hover:bg-rose-500">
                查看推荐
              </Button>
            </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 p-5 flex flex-col justify-between">
              <Wand2 className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-gray-700">一键搭配</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  选一件，AI 帮你搭整套
                </p>
              </div>
            </div>
            <div className="aspect-square rounded-2xl bg-gradient-to-b from-purple-50 to-purple-100 p-5 flex flex-col justify-between">
              <Palette className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-gray-700">灵感生成</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  AI 生成穿搭灵感图
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">自由搭配</h2>
            <Link href="/outfit/create">
              <Button variant="ghost" size="sm" className="text-xs text-rose-400">
                新建画布
              </Button>
            </Link>
          </div>

          <Link href="/outfit/create">
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 rounded-2xl hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
              <Sparkles className="h-6 w-6 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">拖拽衣物到此处开始搭配</p>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}