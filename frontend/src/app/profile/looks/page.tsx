import { TopBar } from "@/components/layout/TopBar";
import { Sparkles } from "lucide-react";

export default function LooksPage() {
  return (
    <div className="mx-auto max-w-lg min-h-screen">
      <TopBar title="我的 Looks" showBack />

      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-rose-300" />
        </div>
        <p className="text-sm text-gray-400">还没有保存搭配</p>
        <p className="text-xs text-gray-300 mt-1">
          创建搭配后会自动保存在这里
        </p>
      </div>
    </div>
  );
}