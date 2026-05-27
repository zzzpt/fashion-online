import { Shirt } from "lucide-react";
import { UploadButton } from "./UploadButton";

interface EmptyWardrobeProps {
  onUpload?: (file: File) => Promise<void>;
}

export function EmptyWardrobe({ onUpload }: EmptyWardrobeProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <Shirt className="h-8 w-8 text-rose-300" />
      </div>
      <p className="text-sm text-gray-500 font-medium">衣柜还是空的</p>
      <p className="text-xs text-gray-400 mt-1 mb-6">
        拍照上传你的第一件衣服吧
      </p>
      <UploadButton onUpload={onUpload} />
    </div>
  );
}