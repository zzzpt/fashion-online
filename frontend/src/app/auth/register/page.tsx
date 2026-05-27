"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getSupabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendCode() {
    if (!phone || phone.length < 11) {
      toast.error("请输入正确的手机号");
      return;
    }
    setIsLoading(true);
    const { error } = await getSupabase().auth.signInWithOtp({
      phone: `+86${phone}`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("验证码已发送");
      setCodeSent(true);
    }
    setIsLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname) {
      toast.error("请输入昵称");
      return;
    }
    setIsLoading(true);
    const { error } = await getSupabase().auth.verifyOtp({
      phone: `+86${phone}`,
      token: code,
      type: "sms",
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    // 更新用户昵称到 Supabase user_metadata
    await getSupabase().auth.updateUser({ data: { nickname } });
    toast.success("注册成功");
    router.push("/");
    setIsLoading(false);
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-white">
      <header className="flex items-center h-12 px-4">
        <Link
          href="/"
          className="flex items-center justify-center h-8 w-8 -ml-1 rounded-full hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
      </header>

      <div className="px-6 pt-8">
        <h1 className="text-2xl font-bold text-gray-800">创建账号</h1>
        <p className="text-sm text-gray-400 mt-2">
          注册你的数字衣柜，开启 AI 穿搭之旅
        </p>

        <form onSubmit={handleRegister} className="mt-10 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-xs text-gray-500">
              昵称
            </Label>
            <Input
              id="nickname"
              type="text"
              placeholder="给自己取个名字吧"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs text-gray-500">
              手机号
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
              className="h-11 rounded-xl"
            />
          </div>

          {codeSent && (
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs text-gray-500">
                验证码
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="h-11 rounded-xl"
              />
            </div>
          )}

          {!codeSent ? (
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-rose-400 hover:bg-rose-500"
            >
              获取验证码
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || !code}
              className="w-full h-11 rounded-xl bg-rose-400 hover:bg-rose-500"
            >
              {isLoading ? "注册中..." : "注册"}
            </Button>
          )}
        </form>

        <Separator className="my-8" />

        <p className="text-center text-sm text-gray-400">
          已有账号？{" "}
          <Link
            href="/auth/login"
            className="text-rose-400 hover:text-rose-500 font-medium"
          >
            去登录
          </Link>
        </p>
      </div>
    </div>
  );
}