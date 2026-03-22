"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import CustomSelect from "./CustomSelect";

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

interface OrgResult {
  id: number;
  name: string;
  slug: string;
}

export default function PostForm({
  tags,
  orgId: presetOrgId,
  orgName: presetOrgName,
  categoryId: presetCategoryId,
}: {
  tags: Tag[];
  orgId?: number;
  orgName?: string;
  categoryId?: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(presetCategoryId ? String(presetCategoryId) : "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scamType, setScamType] = useState("");
  const [damageAmount, setDamageAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // Org search
  const [orgSearch, setOrgSearch] = useState("");
  const [orgResults, setOrgResults] = useState<OrgResult[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrgResult | null>(
    presetOrgId && presetOrgName ? { id: presetOrgId, name: presetOrgName, slug: "" } : null
  );
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  // Org search with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (orgSearch.length < 2) {
      setOrgResults([]);
      setShowOrgDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetch(`/api/orgs?q=${encodeURIComponent(orgSearch)}`)
        .then((res) => res.json())
        .then((data) => {
          const results = (data.orgs || []).slice(0, 10).map((o: { id: number; name: string; slug: string }) => ({
            id: o.id,
            name: o.name,
            slug: o.slug,
          }));
          setOrgResults(results);
          setShowOrgDropdown(results.length > 0);
        })
        .catch(() => {});
    }, 300);
  }, [orgSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target as Node)) {
        setShowOrgDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: Number(categoryId),
          title,
          body,
          scamType: scamType || undefined,
          damageAmount: damageAmount || undefined,
          period: period || undefined,
          relationship: relationship || undefined,
          isAnonymous,
          tagIds: selectedTagIds,
          orgId: selectedOrg?.id || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "投稿に失敗しました");
        return;
      }

      router.push(`/post/${data.postId}`);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          カテゴリ *
        </label>
        <CustomSelect
          value={categoryId}
          onChange={setCategoryId}
          options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
          placeholder="選択してください"
          disabled={!!presetCategoryId}
        />
      </div>

      {/* Organization (optional) */}
      {!presetOrgId ? (
        <div ref={orgDropdownRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            関連する組織（任意）
          </label>
          {selectedOrg ? (
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-md">
              <span className="text-base text-blue-800">{selectedOrg.name}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrg(null);
                  setOrgSearch("");
                }}
                className="ml-auto text-blue-400 hover:text-blue-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={orgSearch}
              onChange={(e) => setOrgSearch(e.target.value)}
              onFocus={() => orgResults.length > 0 && setShowOrgDropdown(true)}
              placeholder="組織名を検索（2文字以上）"
              className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {showOrgDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {orgResults.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrg(org);
                    setOrgSearch("");
                    setShowOrgDropdown(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  {org.name}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            該当する組織がない場合はそのまま空欄で投稿できます
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            関連する組織
          </label>
          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
            {presetOrgName}
          </div>
        </div>
      )}

      {/* Relationship (shown when org is selected) */}
      {(selectedOrg || presetOrgId) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            組織との関係
          </label>
          <CustomSelect
            value={relationship}
            onChange={setRelationship}
            placeholder="選択してください（任意）"
            options={[
              { value: "元会員", label: "元会員" },
              { value: "現会員", label: "現会員" },
              { value: "元従業員", label: "元従業員" },
              { value: "家族・知人が関与", label: "家族・知人が関与" },
              { value: "勧誘を受けた", label: "勧誘を受けた" },
              { value: "被害者", label: "被害者" },
              { value: "その他", label: "その他" },
            ]}
          />
        </div>
      )}

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
          className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          体験の詳細 *
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
          className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
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

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-xs text-gray-500 leading-relaxed">
        ※ 投稿内容は公開されます。投稿は<a href="/terms" className="text-blue-600 hover:underline">利用規約</a>および<a href="/guidelines" className="text-blue-600 hover:underline">投稿ガイドライン</a>に従ってください。
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 font-medium"
      >
        {loading ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
