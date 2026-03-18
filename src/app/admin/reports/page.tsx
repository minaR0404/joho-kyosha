"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

type Report = {
  id: number;
  targetType: string;
  targetId: number;
  reason: string;
  detail: string | null;
  status: string;
  createdAt: string;
  reporter: { id: number; displayName: string; email: string | null };
};

const REASON_LABELS: Record<string, string> = {
  SPAM: "スパム",
  FALSE_INFO: "虚偽情報",
  DEFAMATION: "誹謗中傷",
  INAPPROPRIATE: "不適切な内容",
  OTHER: "その他",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/reports?status=${statusFilter}&page=${page}`
    );
    const data = await res.json();
    setReports(data.reports);
    setTotal(data.total);
    setLoading(false);
  }, [statusFilter, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function handleAction(id: number, action: "RESOLVED" | "DISMISSED") {
    await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchReports();
  }

  function getTargetUrl(type: string, id: number) {
    if (type === "POST") return `/post/${id}`;
    if (type === "ORGANIZATION") return `/org/${id}`;
    return "#";
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">通報管理</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["PENDING", "RESOLVED", "DISMISSED"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "PENDING" && "未対応"}
            {s === "RESOLVED" && "対応済み"}
            {s === "DISMISSED" && "却下"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500">通報はありません</p>
      ) : (
        <>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {report.targetType === "POST" ? "投稿" : "組織"}
                      </span>
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-orange-100 text-orange-700">
                        {REASON_LABELS[report.reason] || report.reason}
                      </span>
                      <a
                        href={getTargetUrl(report.targetType, report.targetId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                      >
                        対象を確認 <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {report.detail && (
                      <p className="text-sm text-gray-700 mb-1">
                        {report.detail}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      通報者: {report.reporter.displayName} ・{" "}
                      {new Date(report.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>

                  {statusFilter === "PENDING" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(report.id, "RESOLVED")}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        対応済み
                      </button>
                      <button
                        onClick={() => handleAction(report.id, "DISMISSED")}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        却下
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
