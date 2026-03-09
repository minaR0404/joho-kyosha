"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function EmailVerificationBanner() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
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

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-800 font-medium">
            メールアドレスが未確認です
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            投稿するにはメールアドレスの確認が必要です。登録時に送信された確認メールをご確認ください。
          </p>
          {sent ? (
            <p className="text-sm text-green-700 mt-2">確認メールを再送信しました。</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={sending}
              className="text-sm text-yellow-800 underline hover:text-yellow-900 mt-2 disabled:opacity-50"
            >
              {sending ? "送信中..." : "確認メールを再送信する"}
            </button>
          )}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
