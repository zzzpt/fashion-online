import { ArrowLeft, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function LookDetailPage() {
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
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-400" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50">
            <Share2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="aspect-[3/4] rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
          <span className="text-sm text-gray-400">搭配展示</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-800">穿搭标题</h1>
        <p className="text-sm text-gray-400 mt-1">穿搭描述和搭配理由</p>
        <Separator className="my-6" />
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-600">使用单品</h2>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center"
              >
                <span className="text-xs text-gray-400">单品 {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}