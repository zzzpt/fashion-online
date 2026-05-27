"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface ProfileData {
  nickname: string | null;
  city: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("api/users/me").json<ProfileData>().then((data) => {
      setNickname(data.nickname || "");
      setCity(data.city || "");
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  async function handleSave() {
    try {
      await api.patch("api/users/me", { json: { nickname: nickname || null, city: city || null } });
      toast.success("保存成功");
      router.back();
    } catch {
      toast.error("保存失败");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-white">
      <TopBar title="设置" showBack />

      <div className="px-4 pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-xs text-gray-500">
            昵称
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="输入昵称"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs text-gray-500">
            所在城市
          </Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="用于获取天气推荐（如：上海）"
            className="h-11 rounded-xl"
          />
        </div>

        <Separator />

        <Button
          onClick={handleSave}
          className="w-full h-11 rounded-xl bg-rose-400 hover:bg-rose-500"
        >
          保存
        </Button>
      </div>
    </div>
  );
}