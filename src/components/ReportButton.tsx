"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

const REASONS = [
  { value: "SPAM", label: "スパム・宣伝" },
  { value: "FALSE_INFO", label: "虚偽の情報" },
  { value: "DEFAMATION", label: "誹謗中傷" },
  { value: "INAPPROPRIATE", label: "不適切な内容" },
  { value: "OTHER", label: "その他" },
];

export default function ReportButton({
  targetType,
  targetId,
}: {
  targetType: "REVIEW" | "TESTIMONY" | "ORGANIZATION";
  targetId: number;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "duplicate" | "error" | null>(null);

  const handleSubmit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, detail: detail || undefined }),
      });
      if (res.ok) {
        setResult("success");
      } else if (res.status === 409) {
        setResult("duplicate");
      } else if (res.status === 401) {
        window.location.href = "/auth/login";
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  if (result === "success") {
    return <span className="text-xs text-gray-400">通報を受け付けました</span>;
  }

  if (result === "duplicate") {
    return <span className="text-xs text-gray-400">すでに通報済みです</span>;
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        <Flag className="w-3 h-3" />
        通報
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 right-0 w-64 bg-white rounded-lg border border-gray-200 shadow-lg p-3 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm font-medium text-gray-900 mb-2">通報理由</p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded mb-2"
          >
            <option value="">選択してください</option>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="詳細（任意）"
            rows={2}
            className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded mb-2 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="flex-1 text-sm py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "送信中..." : "送信"}
            </button>
            <button
              onClick={() => { setOpen(false); setResult(null); }}
              className="text-sm py-1 px-3 text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
          {result === "error" && (
            <p className="text-xs text-red-500 mt-1">通報に失敗しました</p>
          )}
        </div>
      )}
    </div>
  );
}
