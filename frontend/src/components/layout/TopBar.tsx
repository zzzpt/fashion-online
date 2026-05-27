"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  rightAction?: React.ReactNode;
}

export function TopBar({ title, showBack, showSearch = true, rightAction }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-lg items-center justify-between px-4">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-8 w-8 -ml-1 rounded-full hover:bg-gray-50 transition-colors"
              aria-label="返回"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
          )}
          <h1 className="text-base font-semibold text-gray-800 truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {showSearch && <SearchBar />}
          {rightAction}
        </div>
      </div>
    </header>
  );
}