"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomSelect from "@/components/CustomSelect";

interface Category {
  id: number;
  slug: string;
  name: string;
  sortOrder: number;
}

export default function NewOrgPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [representative, setRepresentative] = useState("");
  const [founded, setFounded] = useState("");
  const [nameKana, setNameKana] = useState("");
  const [aliases, setAliases] = useState("");
  const [showExtra, setShowExtra] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          categoryId: Number(categoryId),
          description: description || undefined,
          website: website || undefined,
          representative: representative || undefined,
          founded: founded || undefined,
          nameKana: nameKana || undefined,
          aliases: aliases || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登録に失敗しました");
        return;
      }

      router.push(`/org/${encodeURIComponent(data.slug)}`);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <span className="text-gray-900">組織を登録する</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">新しい組織・商材を登録</h1>
      <p className="text-gray-600 mb-6">
        まだ登録されていない組織や商材を追加して、口コミを集めましょう。
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">組織・商材名 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ *</label>
          <CustomSelect
            value={categoryId}
            onChange={(v) => setCategoryId(v)}
            options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
            placeholder="選択してください"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">概要</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="この組織・商材の概要を簡単に記載してください"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公式サイト</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">代表者</label>
            <input
              type="text"
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">設立年</label>
          <input
            type="text"
            value={founded}
            onChange={(e) => setFounded(e.target.value)}
            placeholder="例: 2020年"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowExtra(!showExtra)}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          {showExtra ? "検索用の情報を閉じる" : "検索用の情報を追加する（任意）"}
        </button>
        {showExtra && (
          <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-xs text-gray-500">検索でヒットしやすくなります（任意）</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">読み（カナ）</label>
              <input
                type="text"
                value={nameKana}
                onChange={(e) => setNameKana(e.target.value)}
                placeholder="例: アムウェイ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">別名・略称</label>
              <input
                type="text"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="例: Amway, アム"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">カンマ区切りで複数入力できます</p>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? "登録中..." : "組織を登録する"}
        </button>
      </form>
    </div>
  );
}
