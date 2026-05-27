"use client";

import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadButtonProps {
  onUpload?: (file: File) => Promise<void>;
  uploading?: boolean;
}

export function UploadButton({ onUpload, uploading }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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

    await onUpload?.(file);

    // 重置 input 以允许重复选择同一文件
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <Button
        onClick={handleClick}
        disabled={uploading}
        size="sm"
        className="h-8 px-3 text-xs bg-rose-400 hover:bg-rose-500"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
        ) : (
          <Camera className="h-3.5 w-3.5 mr-1" />
        )}
        {uploading ? "上传中..." : "添加"}
      </Button>
    </>
  );
}