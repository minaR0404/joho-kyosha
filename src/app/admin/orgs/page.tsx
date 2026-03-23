"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Ban, CheckCircle, Pencil, X } from "lucide-react";

type Org = {
  id: number;
  slug: string;
  name: string;
  approvalStatus: string;
  postCount: number;
  createdAt: string;
  category: { name: string };
  _count: { posts: number };
};

type OrgDetail = {
  id: number;
  name: string;
  nameKana: string | null;
  aliases: string | null;
  categoryId: number;
  description: string | null;
  website: string | null;
  representative: string | null;
  founded: string | null;
  address: string | null;
};

type Category = {
  id: number;
  name: string;
};

function EditModal({
  orgId,
  categories,
  onClose,
  onSaved,
}: {
  orgId: number;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<OrgDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orgs/${orgId}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch(() => setError("読み込みに失敗しました"));
  }, [orgId]);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orgs/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          nameKana: form.nameKana,
          aliases: form.aliases,
          categoryId: form.categoryId,
          description: form.description,
          website: form.website,
          representative: form.representative,
          founded: form.founded,
          address: form.address,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "更新に失敗しました");
        return;
      }
      onSaved();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof OrgDetail, value: string | number) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">組織を編集</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!form ? (
          <div className="px-6 py-8 text-center text-gray-500">
            {error || "読み込み中..."}
          </div>
        ) : (
          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">組織名 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">読み（カナ）</label>
              <input
                type="text"
                value={form.nameKana || ""}
                onChange={(e) => update("nameKana", e.target.value)}
                placeholder="例: アムウェイ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">別名・略称</label>
              <input
                type="text"
                value={form.aliases || ""}
                onChange={(e) => update("aliases", e.target.value)}
                placeholder="例: Amway, アム"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">概要</label>
              <textarea
                value={form.description || ""}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公式サイト</label>
                <input
                  type="text"
                  value={form.website || ""}
                  onChange={(e) => update("website", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">代表者</label>
                <input
                  type="text"
                  value={form.representative || ""}
                  onChange={(e) => update("representative", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">設立年</label>
                <input
                  type="text"
                  value={form.founded || ""}
                  onChange={(e) => update("founded", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
                <input
                  type="text"
                  value={form.address || ""}
                  onChange={(e) => update("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form}
            className="px-4 py-2 text-sm text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrgsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingOrgId, setEditingOrgId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/orgs?categoriesOnly=1")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const fetchOrgs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/orgs?${params}`);
    const data = await res.json();
    setOrgs(data.orgs);
    setTotal(data.total);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  async function handleStatusChange(id: number, approvalStatus: string) {
    await fetch(`/api/admin/orgs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus }),
    });
    fetchOrgs();
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">組織管理</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="組織名で検索..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : orgs.length === 0 ? (
        <p className="text-gray-500">組織が見つかりません</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">組織名</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">カテゴリ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">投稿数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">ステータス</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">作成日</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org) => (
                  <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <a
                        href={`/org/${org.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {org.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{org.category.name}</td>
                    <td className="py-3 px-4 text-gray-600">{org._count.posts}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                          org.approvalStatus === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {org.approvalStatus === "APPROVED" ? "公開" : "非表示"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(org.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingOrgId(org.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          編集
                        </button>
                        {org.approvalStatus === "APPROVED" ? (
                          <button
                            onClick={() => handleStatusChange(org.id, "REJECTED")}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                          >
                            <Ban className="w-3 h-3" />
                            非表示
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(org.id, "APPROVED")}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            公開
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                前へ
              </button>
              <span className="px-3 py-1 text-sm text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}

      {editingOrgId && (
        <EditModal
          orgId={editingOrgId}
          categories={categories}
          onClose={() => setEditingOrgId(null)}
          onSaved={() => {
            setEditingOrgId(null);
            fetchOrgs();
          }}
        />
      )}
    </div>
  );
}
