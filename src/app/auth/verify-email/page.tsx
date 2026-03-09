"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Mail, AlertTriangle } from "lucide-react";

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
        <p className="text-gray-600 mb-8">
          {error === "invalid"
            ? "確認リンクが無効または期限切れです。再度登録するか、ログイン後に確認メールを再送信してください。"
            : "確認リンクが不正です。"}
        </p>
        <div className="flex gap-3 justify-center">
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
      <p className="text-gray-600 mb-8">
        ご登録いただいたメールアドレスに確認メールを送信しました。
        メールに記載されたリンクをクリックして、アカウントを有効化してください。
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">読み込み中...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
