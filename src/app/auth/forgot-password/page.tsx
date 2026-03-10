"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSent(true);
    } catch {
      setError("送信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">メールを送信しました</h1>
        <p className="text-gray-600 mb-2">
          入力されたメールアドレスにパスワード再設定用のリンクを送信しました。
        </p>
        <p className="text-sm text-gray-500 mb-6">
          メールが届かない場合は、迷惑メールフォルダをご確認ください。
        </p>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
        >
          ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">パスワードの再設定</h1>
      <p className="text-gray-600 text-center mb-8">
        登録したメールアドレスを入力してください。パスワード再設定用のリンクを送信します。
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? "送信中..." : "リセットリンクを送信"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/auth/login" className="text-blue-700 hover:underline">
          ログインに戻る
        </Link>
      </p>
    </div>
  );
}
