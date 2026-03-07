"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  slug: string;
  name: string;
  sortOrder: number;
}

export default function TestimonyForm({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scamType, setScamType] = useState("");
  const [damageAmount, setDamageAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/orgs?categoriesOnly=1")
      .then((res) => res.json())
      .then((data) => {
        const cats: Category[] = data.categories || [];
        cats.sort((a, b) => a.sortOrder - b.sortOrder);
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/testimonies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: Number(categoryId),
          title,
          body,
          scamType: scamType || undefined,
          damageAmount: damageAmount || undefined,
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

      router.push(`/testimony/${data.testimonyId}`);
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

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリ *
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Scam Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          被害の種類
        </label>
        <input
          type="text"
          value={scamType}
          onChange={(e) => setScamType(e.target.value)}
          maxLength={50}
          placeholder="例: SNSで知り合った個人による投資詐欺"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Damage Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          被害額（概算）
        </label>
        <input
          type="text"
          value={damageAmount}
          onChange={(e) => setDamageAmount(e.target.value)}
          maxLength={30}
          placeholder="例: 30万円"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          被害に遭った時期
        </label>
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          maxLength={20}
          placeholder="例: 2024年9月"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {period.length > 16 && (
          <p className={`text-xs text-right mt-1 ${period.length >= 20 ? "text-red-500" : "text-gray-400"}`}>
            {period.length}/20
          </p>
        )}
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
        {title.length > 80 && (
          <p className={`text-xs text-right mt-1 ${title.length >= 100 ? "text-red-500" : "text-gray-400"}`}>
            {title.length}/100
          </p>
        )}
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          体験談 *
        </label>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value.slice(0, 4000));
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          required
          maxLength={4000}
          rows={6}
          placeholder="何が起きたか、どのような手口だったかを具体的に書いてください。組織名がわからなくても構いません。"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
        />
        {body.length > 3600 && (
          <p className={`text-xs text-right mt-1 ${body.length >= 4000 ? "text-red-500" : "text-gray-400"}`}>
            {body.length}/4000
          </p>
        )}
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
        {loading ? "投稿中..." : "体験談を投稿する"}
      </button>
    </form>
  );
}
