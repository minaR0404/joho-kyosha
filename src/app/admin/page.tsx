"use client";

import { useEffect, useState } from "react";
import { Flag, FileText, Building2, Users } from "lucide-react";

type Stats = {
  userCount: number;
  postCount: number;
  orgCount: number;
  pendingReportCount: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-gray-500">読み込み中...</p>;
  }

  const cards = [
    {
      label: "未対応の通報",
      value: stats.pendingReportCount,
      icon: Flag,
      color: stats.pendingReportCount > 0 ? "text-red-600 bg-red-50" : "text-gray-600 bg-gray-50",
      href: "/admin/reports",
    },
    {
      label: "投稿数",
      value: stats.postCount,
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
      href: "/admin/posts",
    },
    {
      label: "組織数",
      value: stats.orgCount,
      icon: Building2,
      color: "text-green-600 bg-green-50",
      href: "/admin/orgs",
    },
    {
      label: "ユーザー数",
      value: stats.userCount,
      icon: Users,
      color: "text-purple-600 bg-purple-50",
      href: "/admin/users",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="block p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
