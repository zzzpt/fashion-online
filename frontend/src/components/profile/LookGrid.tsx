"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface LookItem {
  id: string;
  title: string | null;
  cover_image_url: string | null;
}

interface LookGridProps {
  looks: LookItem[];
}

export function LookGrid({ looks }: LookGridProps) {
  if (looks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-rose-300" />
        </div>
        <p className="text-sm text-gray-400">还没有保存搭配</p>
        <p className="text-xs text-gray-300 mt-1">
          创建搭配后会自动保存在这里
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
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
  );
}