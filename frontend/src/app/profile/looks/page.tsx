"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { LookGrid } from "@/components/profile/LookGrid";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";

interface LookItem {
  id: string;
  title: string | null;
  cover_image_url: string | null;
}

export default function LooksPage() {
  const [looks, setLooks] = useState<LookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLooks = useCallback(async () => {
    try {
      const data = await api.get("api/looks").json<{ items: LookItem[] }>();
      setLooks(data.items);
    } catch {
      // 静默处理
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLooks();
  }, [fetchLooks]);

  return (
    <div className="mx-auto max-w-lg min-h-screen">
      <TopBar title="我的 Looks" showBack />
      <div className="px-4 pt-4">
        {isLoading ? <LoadingSpinner /> : <LookGrid looks={looks} />}
      </div>
    </div>
  );
}