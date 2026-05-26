import { Plus, Camera, Shirt } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const categories = [
  { key: "all", label: "全部" },
  { key: "top", label: "上衣" },
  { key: "bottom", label: "下装" },
  { key: "dress", label: "连衣裙" },
  { key: "outerwear", label: "外套" },
  { key: "shoes", label: "鞋子" },
  { key: "accessory", label: "配饰" },
];

export default function WardrobePage() {
  return (
    <div className="mx-auto max-w-lg">
      <TopBar
        title="我的衣柜"
        rightAction={
          <Button
            size="sm"
            className="h-8 px-3 text-xs bg-rose-400 hover:bg-rose-500"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            添加
          </Button>
        }
      />

      <div className="px-4 pt-4">
        {/* 分类筛选 */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="shrink-0 px-3.5 py-1.5 text-xs rounded-full border border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-400 transition-colors first:bg-rose-400 first:text-white first:border-rose-400"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <Separator className="my-4" />

        {/* 空状态 */}
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
            <Shirt className="h-8 w-8 text-rose-300" />
          </div>
          <p className="text-sm text-gray-500 font-medium">衣柜还是空的</p>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            拍照上传你的第一件衣服吧
          </p>
          <Button
            className="bg-rose-400 hover:bg-rose-500 gap-2"
            size="sm"
          >
            <Camera className="h-4 w-4" />
            拍照上传
          </Button>
        </div>
      </div>
    </div>
  );
}