"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

export default function HelpfulButton({
  reviewId,
  initialCount,
  initialVoted,
}: {
  reviewId: number;
  initialCount: number;
  initialVoted: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.helpfulCount);
        setVoted(!voted);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
        voted
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      <ThumbsUp className="w-3 h-3" />
      <span>参考になった</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
