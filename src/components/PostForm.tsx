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
  const [scamTypeCustom, setScamTypeCustom] = useState("");
  const [damageAmount, setDamageAmount] = useState("");
  const [periodYear, setPeriodYear] = useState("");
  const [periodSeason, setPeriodSeason] = useState("");
  const [periodEndYear, setPeriodEndYear] = useState("");
  const [periodEndSeason, setPeriodEndSeason] = useState("");
  const [periodOldYear, setPeriodOldYear] = useState("");
  const [showPeriodRange, setShowPeriodRange] = useState(false);
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
    if (orgSearch.length < 1) {
      setOrgResults([]);
      setShowOrgDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams({ q: orgSearch });
      if (categoryId) params.set("categoryId", categoryId);
      fetch(`/api/orgs?${params}`)
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
  }, [orgSearch, categoryId]);

  // Load suggested orgs on focus
  const loadSuggestedOrgs = () => {
    if (orgSearch.length >= 1 || !categoryId) {
      if (orgResults.length > 0) setShowOrgDropdown(true);
      return;
    }
    fetch(`/api/orgs?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        const results = (data.orgs || []).map((o: { id: number; name: string; slug: string }) => ({
          id: o.id,
          name: o.name,
          slug: o.slug,
        }));
        if (results.length > 0) {
          setOrgResults(results);
          setShowOrgDropdown(true);
        }
      })
      .catch(() => {});
  };

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

  const selectedCategorySlug = categories.find((c) => String(c.id) === categoryId)?.slug || "";

  const scamTypeMap: Record<string, { value: string; label: string }[]> = {
    "info-products": [
      { value: "高額な情報商材の購入", label: "高額な情報商材の購入" },
      { value: "再現性のないノウハウ販売", label: "再現性のないノウハウ販売" },
      { value: "バックエンド商品への誘導", label: "バックエンド商品への誘導" },
      { value: "返金保証の不履行", label: "返金保証の不履行" },
      { value: "特商法表記の不備・虚偽", label: "特商法表記の不備・虚偽" },
    ],
    mlm: [
      { value: "マルチ商法・ネットワークビジネス", label: "マルチ商法・ネットワークビジネス" },
      { value: "勧誘による人間関係の悪化", label: "勧誘による人間関係の悪化" },
      { value: "在庫の買い込み強要", label: "在庫の買い込み強要" },
      { value: "セミナー参加費の負担", label: "セミナー参加費の負担" },
      { value: "退会・解約の妨害", label: "退会・解約の妨害" },
    ],
    investment: [
      { value: "投資詐欺（暗号資産・FX等）", label: "投資詐欺（暗号資産・FX等）" },
      { value: "ポンジスキーム", label: "ポンジスキーム" },
      { value: "未公開株・未上場トークン", label: "未公開株・未上場トークン" },
      { value: "自動売買ツールの購入", label: "自動売買ツールの購入" },
      { value: "出金拒否・口座凍結", label: "出金拒否・口座凍結" },
    ],
    "online-salon": [
      { value: "内容が広告と異なる", label: "内容が広告と異なる" },
      { value: "サロン内での別案件勧誘", label: "サロン内での別案件勧誘" },
      { value: "退会手続きの困難", label: "退会手続きの困難" },
      { value: "成果の誇大広告", label: "成果の誇大広告" },
      { value: "やりがい搾取（無報酬の作業）", label: "やりがい搾取（無報酬の作業）" },
    ],
    "side-job-school": [
      { value: "高額なスクール・セミナー", label: "高額なスクール・セミナー" },
      { value: "副業・在宅ワーク詐欺", label: "副業・在宅ワーク詐欺" },
      { value: "転職保証の不履行", label: "転職保証の不履行" },
      { value: "紹介報酬型（マルチ構造）", label: "紹介報酬型（マルチ構造）" },
      { value: "初期費用の詐取", label: "初期費用の詐取" },
    ],
    "beauty-health": [
      { value: "定期購入の解約困難", label: "定期購入の解約困難" },
      { value: "効果の誇大広告", label: "効果の誇大広告" },
      { value: "無料体験からの高額契約", label: "無料体験からの高額契約" },
      { value: "施術の健康被害", label: "施術の健康被害" },
      { value: "カウンセリング商法", label: "カウンセリング商法" },
    ],
    "door-to-door": [
      { value: "訪問販売・押し売り", label: "訪問販売・押し売り" },
      { value: "貴金属の押し買い", label: "貴金属の押し買い" },
      { value: "点検商法（屋根・床下等）", label: "点検商法（屋根・床下等）" },
      { value: "契約の強要・威圧", label: "契約の強要・威圧" },
      { value: "クーリングオフの妨害", label: "クーリングオフの妨害" },
    ],
    religion: [
      { value: "霊感商法・スピリチュアル", label: "霊感商法・スピリチュアル" },
      { value: "寄付・献金の強要", label: "寄付・献金の強要" },
      { value: "脱会の妨害・孤立化", label: "脱会の妨害・孤立化" },
      { value: "家族の引き離し", label: "家族の引き離し" },
      { value: "開運グッズの高額販売", label: "開運グッズの高額販売" },
    ],
  };

  const commonScamTypes = [
    { value: "個人情報の悪用・脅迫", label: "個人情報の悪用・脅迫" },
    { value: "other", label: "その他（自由入力）" },
  ];

  const scamTypeOptions = selectedCategorySlug && selectedCategorySlug !== "other"
    ? [...(scamTypeMap[selectedCategorySlug] || []), ...commonScamTypes]
    : commonScamTypes;

  const yearOptions = [
    { value: "2026", label: "2026年" },
    { value: "2025", label: "2025年" },
    { value: "2024", label: "2024年" },
    { value: "2023", label: "2023年" },
    { value: "2022", label: "2022年" },
    { value: "2021", label: "2021年" },
    { value: "2020", label: "2020年" },
    { value: "old", label: "2019年以前" },
    { value: "unknown", label: "覚えていない" },
  ];

  const oldYearOptions = [
    { value: "2019", label: "2019年" },
    { value: "2018", label: "2018年" },
    { value: "2017", label: "2017年" },
    { value: "2016", label: "2016年" },
    { value: "2015", label: "2015年" },
    { value: "older", label: "2014年以前" },
  ];

  const seasonOptions = [
    { value: "前半", label: "前半（1〜6月）" },
    { value: "後半", label: "後半（7〜12月）" },
    { value: "不明", label: "覚えていない" },
  ];

  const buildPeriodString = () => {
    if (!periodYear) return "";
    if (periodYear === "unknown") return "時期不明";

    const year = periodYear === "old"
      ? (periodOldYear === "older" ? "2014年以前" : periodOldYear ? `${periodOldYear}年` : "2019年以前")
      : `${periodYear}年`;
    const season = periodSeason && periodSeason !== "不明" ? ` ${periodSeason}` : "";
    const start = `${year}${season}`;

    if (!showPeriodRange || !periodEndYear) return start;

    const endYear = periodEndYear === "old"
      ? (periodOldYear ? `${periodOldYear}年` : "2019年以前")
      : periodEndYear === "unknown" ? "" : `${periodEndYear}年`;
    if (!endYear) return start;
    const endSeason = periodEndSeason && periodEndSeason !== "不明" ? ` ${periodEndSeason}` : "";
    return `${start}〜${endYear}${endSeason}`;
  };

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
          scamType: (scamType === "other" ? scamTypeCustom : scamType) || undefined,
          damageAmount: damageAmount || undefined,
          period: buildPeriodString() || undefined,
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
          onChange={(v) => {
            setCategoryId(v);
            setScamType("");
            setScamTypeCustom("");
          }}
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
              onFocus={loadSuggestedOrgs}
              placeholder="組織名を検索"
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
        <CustomSelect
          value={scamType}
          onChange={(v) => {
            setScamType(v);
            if (v !== "other") setScamTypeCustom("");
          }}
          placeholder="選択してください（任意）"
          options={scamTypeOptions}
        />
        {scamType === "other" && (
          <input
            type="text"
            value={scamTypeCustom}
            onChange={(e) => setScamTypeCustom(e.target.value)}
            maxLength={50}
            placeholder="被害の種類を入力してください"
            className="w-full mt-2 px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Damage Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          被害額（概算）
        </label>
        <CustomSelect
          value={damageAmount}
          onChange={setDamageAmount}
          placeholder="選択してください（任意）"
          options={[
            { value: "1万円未満", label: "1万円未満" },
            { value: "1〜5万円", label: "1〜5万円" },
            { value: "5〜10万円", label: "5〜10万円" },
            { value: "10〜30万円", label: "10〜30万円" },
            { value: "30〜50万円", label: "30〜50万円" },
            { value: "50〜100万円", label: "50〜100万円" },
            { value: "100〜300万円", label: "100〜300万円" },
            { value: "300〜500万円", label: "300〜500万円" },
            { value: "500〜1000万円", label: "500〜1000万円" },
            { value: "1000万円以上", label: "1000万円以上" },
          ]}
        />
      </div>

      {/* Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          被害に遭った時期
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <CustomSelect
              value={periodYear}
              onChange={(v) => {
                setPeriodYear(v);
                if (v !== "old") setPeriodOldYear("");
                if (v === "unknown") { setPeriodSeason(""); setShowPeriodRange(false); }
              }}
              placeholder="年を選択"
              options={yearOptions}
            />
          </div>
          {periodYear && periodYear !== "unknown" && (
            <div className="flex-1">
              <CustomSelect
                value={periodSeason}
                onChange={setPeriodSeason}
                placeholder="時期を選択"
                options={seasonOptions}
              />
            </div>
          )}
        </div>
        {periodYear === "old" && (
          <div className="mt-3">
            <CustomSelect
              value={periodOldYear}
              onChange={setPeriodOldYear}
              placeholder="具体的な年（任意）"
              options={oldYearOptions}
            />
          </div>
        )}
        {periodYear && periodYear !== "unknown" && !showPeriodRange && (
          <button
            type="button"
            onClick={() => setShowPeriodRange(true)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            期間が長い場合はこちら
          </button>
        )}
        {showPeriodRange && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">終了時期</span>
              <button
                type="button"
                onClick={() => { setShowPeriodRange(false); setPeriodEndYear(""); setPeriodEndSeason(""); }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                閉じる
              </button>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <CustomSelect
                  value={periodEndYear}
                  onChange={(v) => {
                    setPeriodEndYear(v);
                    if (v === "unknown") setPeriodEndSeason("");
                  }}
                  placeholder="年を選択"
                  options={yearOptions.filter((o) => o.value !== "unknown")}
                />
              </div>
              {periodEndYear && periodEndYear !== "unknown" && (
                <div className="flex-1">
                  <CustomSelect
                    value={periodEndSeason}
                    onChange={setPeriodEndSeason}
                    placeholder="時期を選択"
                    options={seasonOptions}
                  />
                </div>
              )}
            </div>
          </div>
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
