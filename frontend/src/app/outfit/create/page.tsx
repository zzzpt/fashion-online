import { TopBar } from "@/components/layout/TopBar";

export default function OutfitCreatePage() {
  return (
    <div className="mx-auto max-w-lg min-h-screen">
      <TopBar title="搭配画布" showBack />
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-gray-400">拖拽搭配画布（Phase 2 实现）</p>
      </div>
    </div>
  );
}