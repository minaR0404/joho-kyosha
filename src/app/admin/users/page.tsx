"use client";

import { useEffect, useState, useCallback } from "react";
import { Ban, CheckCircle } from "lucide-react";

type User = {
  id: number;
  displayName: string;
  email: string | null;
  role: string;
  isBanned: boolean;
  createdAt: string;
  _count: { posts: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users);
    setTotal(data.total);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleBan(id: number, isBanned: boolean) {
    const message = isBanned
      ? "このユーザーをBANしますか？"
      : "このユーザーのBANを解除しますか？";
    if (!confirm(message)) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned }),
    });
    fetchUsers();
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ユーザー管理</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="名前・メールで検索..."
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
      ) : users.length === 0 ? (
        <p className="text-gray-500">ユーザーが見つかりません</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">名前</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">メール</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">投稿数</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">権限</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">状態</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">登録日</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {user.displayName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email || "-"}</td>
                    <td className="py-3 px-4 text-gray-600">{user._count.posts}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.isBanned ? (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                          BAN
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                          有効
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="py-3 px-4">
                      {user.role !== "ADMIN" && (
                        <>
                          {user.isBanned ? (
                            <button
                              onClick={() => handleBan(user.id, false)}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" />
                              BAN解除
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBan(user.id, true)}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                            >
                              <Ban className="w-3 h-3" />
                              BAN
                            </button>
                          )}
                        </>
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
