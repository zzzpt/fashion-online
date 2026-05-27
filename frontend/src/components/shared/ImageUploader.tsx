"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>;
  previewUrl?: string;
  onClear?: () => void;
}

export function ImageUploader({ onUpload, previewUrl, onClear }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [uploading, setUploading] = useState(false);

  function handleClick() {
    inputRef.current?.click();
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("图片不能超过 20MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    setUploading(true);
    try {
      await onUpload(file);
    } catch {
      toast.error("上传失败");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleClear() {
    setPreview(null);
    onClear?.();
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden">
          <Image
            src={preview}
            alt="预览"
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 480px"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          {!uploading && (
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 flex items-center justify-center"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={uploading}
          className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-rose-300 hover:bg-rose-50/50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-rose-300 animate-spin" />
              <p className="text-xs text-gray-400">上传中...</p>
            </>
          ) : (
            <>
              <Camera className="h-8 w-8 text-gray-300" />
              <p className="text-xs text-gray-400">拍照或选择图片</p>
            </>
          )}
        </button>
      )}
    </div>
  );
}