"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({ text = "加载中...", size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20">
      <Loader2 className={`${sizeMap[size]} text-rose-300 animate-spin`} />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}