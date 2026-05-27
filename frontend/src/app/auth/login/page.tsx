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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendCode() {
    if (!email || !email.includes("@")) {
      toast.error("请输入正确的邮箱地址");
      return;
    }
    setIsLoading(true);
    const { error } = await getSupabase().auth.signInWithOtp({ email });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("验证码已发送到邮箱");
      setCodeSent(true);
    }
    setIsLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await getSupabase().auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("登录成功");
      router.push("/");
    }
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
        <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
        <p className="text-sm text-gray-400 mt-2">
          使用邮箱登录你的数字衣柜
        </p>

        <form onSubmit={handleLogin} className="mt-10 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-gray-500">
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? "登录中..." : "登录"}
            </Button>
          )}
        </form>

        <Separator className="my-8" />

        <p className="text-center text-sm text-gray-400">
          还没有账号？{" "}
          <Link
            href="/auth/register"
            className="text-rose-400 hover:text-rose-500 font-medium"
          >
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}