"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Trash2 } from "lucide-react";

type Post = {
  id: number;
  title: string;
  createdAt: string;
  deletedAt: string | null;
  user: { id: number; displayName: string };
  category: { name: string };
  org: { name: string; slug: string } | null;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (showDeleted) params.set("deleted", "true");
    const res = await fetch(`/api/admin/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts);
    setTotal(data.total);
    setLoading(false);
  }, [page, search, showDeleted]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleDelete(id: number) {
    if (!confirm("この投稿を削除しますか？")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">投稿管理</h1>

      <div className="flex gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="タイトルで検索..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => {
              setShowDeleted(e.target.checked);
              setPage(1);
            }}
            className="rounded"
          />
          削除済みを表示
        </label>
      </div>

      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">投稿が見つかりません</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">タイトル</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">投稿者</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">カテゴリ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">組織</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">投稿日</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <a
                        href={`/post/${post.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <span className="truncate max-w-xs">{post.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{post.user.displayName}</td>
                    <td className="py-3 px-4 text-gray-600">{post.category.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {post.org ? post.org.name : "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="py-3 px-4">
                      {!post.deletedAt && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          削除
                        </button>
                      )}
                      {post.deletedAt && (
                        <span className="text-xs text-gray-400">削除済み</span>
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
