import { Settings, Grid3X3, Heart, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const menuItems = [
  { icon: Grid3X3, label: "我的 Looks", href: "/profile/looks" },
  { icon: Heart, label: "我的收藏", href: "/profile/looks?filter=favorite" },
  { icon: Settings, label: "设置", href: "/profile/settings" },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-lg">
      <TopBar title="我的" />

      <div className="px-4 pt-6">
        {/* 用户信息区域 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-2xl">🌸</span>
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-800">时尚达人</p>
            <p className="text-xs text-gray-400 mt-0.5">查看并编辑个人资料</p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "衣物", value: "0" },
            { label: "搭配", value: "0" },
            { label: "点赞", value: "0" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-3 rounded-xl bg-gray-50"
            >
              <p className="text-xl font-bold text-gray-700">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* 菜单列表 */}
        <div className="mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-b-0"
            >
              <item.icon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 flex-1">
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </Link>
          ))}
        </div>

        {/* 退出登录 */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            className="text-xs text-gray-400 hover:text-gray-500"
          >
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
}