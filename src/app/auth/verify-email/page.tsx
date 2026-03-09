"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Mail, AlertTriangle } from "lucide-react";

function ResendButton() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
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
      setSending(false);
    }
  };

  if (sent) {
    return <p className="text-sm text-green-700 mt-4">確認メールを再送信しました。</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm text-gray-500">メールが届かない場合:</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="登録したメールアドレス"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleResend}
        disabled={sending}
        className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
      >
        {sending ? "送信中..." : "確認メールを再送信する"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">確認リンクが無効です</h1>
        <p className="text-gray-600 mb-4">
          {error === "invalid"
            ? "確認リンクが無効または期限切れです。確認メールを再送信してください。"
            : "確認リンクが不正です。"}
        </p>
        <ResendButton />
        <div className="flex gap-3 justify-center mt-6">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium"
          >
            ログイン
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            新規登録
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">確認メールを送信しました</h1>
      <p className="text-gray-600 mb-2">
        ご登録いただいたメールアドレスに確認メールを送信しました。
        メールに記載されたリンクをクリックして、アカウントを有効化してください。
      </p>
      <p className="text-sm text-gray-500">
        迷惑メールフォルダもご確認ください。
      </p>
      <ResendButton />
      <Link
        href="/auth/login"
        className="inline-block px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-medium mt-6"
      >
        ログインページへ
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">読み込み中...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
