"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");

  async function handleSave() {
    // TODO: 对接后端 API 保存用户信息
    toast.success("保存成功");
    router.back();
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