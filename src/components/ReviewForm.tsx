"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RatingIconsInput } from "./RatingIcons";
import { RATING_AXES, RELATIONSHIPS } from "@/lib/utils";

interface Tag {
  id: number;
  name: string;
}

export default function ReviewForm({ orgId, orgSlug, tags }: { orgId: number; orgSlug: string; tags: Tag[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState({
    ratingDanger: 0,
    ratingCost: 0,
    ratingPressure: 0,
    ratingTransparency: 0,
    ratingExit: 0,
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [relationship, setRelationship] = useState("");
  const [period, setPeriod] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId,
          ...ratings,
          title,
          body,
          relationship,
          period: period || undefined,
          isAnonymous,
          tagIds: selectedTagIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "投稿に失敗しました");
        return;
      }

      router.push(`/org/${orgSlug}`);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Ratings */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-4">評価（各1〜5）</h3>
        <div className="space-y-3">
          {RATING_AXES.map((axis) => (
            <RatingIconsInput
              key={axis.key}
              label={axis.label}
              value={ratings[axis.key as keyof typeof ratings]}
              onChange={(v) => setRatings((prev) => ({ ...prev, [axis.key]: v }))}
            />
          ))}
        </div>
      </div>

      {/* Relationship */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          この組織との関係 *
        </label>
        <select
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          関わった時期
        </label>
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="例: 2023年6月"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タイトル *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          placeholder="一言で体験を要約してください"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          口コミ本文 *
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          placeholder="具体的な体験を共有してください。他の方が判断する際の参考になります。"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            該当するタグ（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() =>
                    setSelectedTagIds((prev) =>
                      selected ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selected
                      ? "bg-red-50 text-red-700 border-red-300"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Anonymous */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-gray-700">匿名で投稿する</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 font-medium"
      >
        {loading ? "投稿中..." : "口コミを投稿する"}
      </button>
    </form>
  );
}
