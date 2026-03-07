"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

export default function HelpfulButton({
  reviewId,
  testimonyId,
  initialCount,
  initialVoted,
  size = "sm",
}: {
  reviewId?: number;
  testimonyId?: number;
  initialCount: number;
  initialVoted: boolean;
  size?: "sm" | "md";
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  const [showLoginHint, setShowLoginHint] = useState(false);

  const voteUrl = testimonyId
    ? `/api/testimonies/${testimonyId}/vote`
    : `/api/reviews/${reviewId}/vote`;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setShowLoginHint(false);
    try {
      const res = await fetch(voteUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.helpfulCount);
        setVoted(!voted);
      } else if (res.status === 401) {
        setShowLoginHint(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center rounded transition-colors cursor-pointer disabled:opacity-50 ${
        size === "md"
          ? `gap-1.5 px-3 py-1 text-sm border ${voted ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`
          : `gap-1 px-2 py-0.5 text-xs ${voted ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`
      }`}
    >
      <ThumbsUp className={size === "md" ? "w-4 h-4" : "w-3 h-3"} />
      <span>参考になった</span>
      {count > 0 && <span>{count}</span>}
    </button>
    {showLoginHint && (
      <span className="text-xs text-gray-400 ml-1">
        <a href="/auth/login" className="hover:underline" onClick={(e) => e.stopPropagation()}>ログイン</a>すると投票できます
      </span>
    )}
    </>
  );
}
