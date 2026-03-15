"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  apiEndpoint,
  redirectTo,
}: {
  apiEndpoint: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, { method: "DELETE" });
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "削除に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirming(true); }}
        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3 h-3" />
        削除
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <span className="text-xs text-red-600">本当に削除しますか？</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "削除中..." : "削除する"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
      >
        キャンセル
      </button>
    </div>
  );
}
