"use client";

import { useCallback, useEffect, useState } from "react";
import { Settings, Grid3X3, Heart, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UserStats } from "@/components/profile/UserStats";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
  { icon: Grid3X3, label: "我的 Looks", href: "/profile/looks" },
  { icon: Heart, label: "我的收藏", href: "/profile/looks?filter=favorite" },
  { icon: Settings, label: "设置", href: "/profile/settings" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [nickname, setNickname] = useState<string>("");
  const [stats, setStats] = useState([
    { label: "衣物", value: "0" },
    { label: "搭配", value: "0" },
    { label: "点赞", value: "0" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [profile, s] = await Promise.all([
        api.get("api/users/me").json<{ nickname: string | null }>(),
        api.get("api/users/me/stats").json<{ clothing_count: number; look_count: number; total_likes: number }>(),
      ]);
      setNickname(profile.nickname || user?.user_metadata?.nickname || "时尚达人");
      setStats([
        { label: "衣物", value: String(s.clothing_count) },
        { label: "搭配", value: String(s.look_count) },
        { label: "点赞", value: String(s.total_likes) },
      ]);
    } catch {
      setStats([
        { label: "衣物", value: "0" },
        { label: "搭配", value: "0" },
        { label: "点赞", value: "0" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  async function handleLogout() {
    await signOut();
    toast.success("已退出登录");
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg">
        <TopBar title="我的" />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <TopBar title="我的" />

      <div className="px-4 pt-6">
        <Link href="/profile/settings" className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-2xl">🌸</span>
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-800">{nickname}</p>
            <p className="text-xs text-gray-400 mt-0.5">查看并编辑个人资料</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </Link>

        <UserStats stats={stats} />

        <Separator />

        <div className="mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-b-0"
            >
              <item.icon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 flex-1">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            className="text-xs text-gray-400 hover:text-gray-500"
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}