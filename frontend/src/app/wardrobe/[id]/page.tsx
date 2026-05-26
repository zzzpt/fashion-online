import { ArrowLeft, Heart, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function ClothingDetailPage() {
  return (
    <div className="mx-auto max-w-lg bg-white min-h-screen">
      <header className="flex items-center justify-between h-12 px-4">
        <Link
          href="/wardrobe"
          className="flex items-center justify-center h-8 w-8 -ml-1 rounded-full hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex items-center gap-1">
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-400" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50">
            <Edit3 className="h-4 w-4 text-gray-400" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50">
            <Trash2 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="aspect-[3/4] rounded-2xl bg-gray-100 flex items-center justify-center">
          <span className="text-sm text-gray-400">单品图片</span>
        </div>
      </div>
    </div>
  );
}