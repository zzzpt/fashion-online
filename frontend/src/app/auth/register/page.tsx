"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getSupabase } from "@/lib/supabase";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 处理 magic link 回调：URL 带 token_hash 时自动验证
  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    if (tokenHash && type === "email") {
      const saved = sessionStorage.getItem("registerData");
      if (saved) {
        const { email: savedEmail, nickname: savedNickname } = JSON.parse(saved);
        handleVerifyAndUpdate(savedEmail, tokenHash, savedNickname);
      }
    }
  }, [searchParams]);

  async function handleVerifyAndUpdate(
    savedEmail: string,
    tokenHash: string,
    savedNickname: string,
  ) {
    setIsLoading(true);
    const { error } = await getSupabase().auth.verifyOtp({
      email: savedEmail,
      token_hash: tokenHash,
      type: "email",
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    if (savedNickname) {
      await getSupabase().auth.updateUser({ data: { nickname: savedNickname } });
    }
    sessionStorage.removeItem("registerData");
    toast.success("注册成功");
    router.push("/");
    setIsLoading(false);
  }

  async function handleSendCode() {
    if (!email || !email.includes("@")) {
      toast.error("请输入正确的邮箱地址");
      return;
    }
    setIsLoading(true);
    sessionStorage.setItem(
      "registerData",
      JSON.stringify({ email, nickname }),
    );

    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/register` },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("验证码已发送，请检查邮箱");
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
      email,
      token: code,
      type: "email",
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    await getSupabase().auth.updateUser({ data: { nickname } });
    sessionStorage.removeItem("registerData");
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

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}