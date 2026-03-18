"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Ban, CheckCircle } from "lucide-react";

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

export default function AdminOrgsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
    </div>
  );
}
