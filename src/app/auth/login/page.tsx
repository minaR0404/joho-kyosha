"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const verified = searchParams.get("verified") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email) errors.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "正しいメールアドレスを入力してください";
    if (!password) errors.password = "パスワードを入力してください";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);

    try {
      // 先にメール確認状態をチェック
      const checkRes = await fetch("/api/auth/check-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const checkData = await checkRes.json();

      if (checkData.status === "unverified") {
        setUnverified(true);
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {verified && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-4">
          メールアドレスが確認されました。ログインしてください。
        </div>
      )}
      {unverified && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm mb-4">
          <p className="font-medium">メールアドレスが未確認です</p>
          <p className="mt-1">登録時に送信された確認メールのリンクをクリックしてください。</p>
          <Link href="/auth/verify-email" className="text-yellow-900 underline hover:text-yellow-700 mt-1 inline-block">
            確認メールについて
          </Link>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.email ? "border-red-400" : "border-gray-300"}`}
          />
          {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <PasswordInput
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
          />
          {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <div className="text-right mt-2">
        <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
          パスワードを忘れた方
        </Link>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        アカウントをお持ちでない方は
        <Link href="/auth/register" className="text-blue-600 hover:underline ml-1">
          新規登録
        </Link>
      </p>

      <div className="mt-6 p-4 bg-gray-50 rounded-md text-xs text-gray-500">
        <p className="font-medium mb-1">デモアカウント:</p>
        <p>メール: demo@example.com / パスワード: password123</p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">ログイン</h1>
      <p className="text-gray-600 text-center mb-8">
        口コミを投稿するにはログインが必要です
      </p>
      <Suspense fallback={<div className="text-center text-gray-500">読み込み中...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
