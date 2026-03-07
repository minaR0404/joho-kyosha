"use client";

import { useState } from "react";
import type { Metadata } from "next";

const REASONS = [
  { value: "DELETE_REVIEW", label: "口コミの削除依頼" },
  { value: "DELETE_TESTIMONY", label: "体験談の削除依頼" },
  { value: "DELETE_ORG", label: "組織情報の削除依頼" },
  { value: "CORRECTION", label: "情報の訂正依頼" },
  { value: "INQUIRY", label: "その他のお問い合わせ" },
];

export default function ContactPage() {
  const [reason, setReason] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `【情報強者】${REASONS.find((r) => r.value === reason)?.label || "お問い合わせ"}`
    );
    const body = encodeURIComponent(
      [
        `■ 種別: ${REASONS.find((r) => r.value === reason)?.label}`,
        `■ お名前: ${name || "未記入"}`,
        `■ メールアドレス: ${email}`,
        targetUrl ? `■ 対象URL: ${targetUrl}` : "",
        ``,
        `■ 詳細:`,
        detail,
      ]
        .filter(Boolean)
        .join("\n")
    );

    window.location.href = `mailto:contact@johokyosha.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">送信準備が完了しました</h1>
          <p className="text-gray-600 mb-2">
            メールアプリが開きます。内容を確認の上、送信してください。
          </p>
          <p className="text-sm text-gray-500">
            メールアプリが開かない場合は、直接
            <span className="font-medium text-gray-700"> contact@johokyosha.com </span>
            までご連絡ください。
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-sm text-blue-600 hover:underline"
          >
            フォームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">削除依頼・お問い合わせ</h1>
      <p className="text-gray-600 text-sm mb-8">
        口コミ・体験談・組織情報の削除依頼、情報の訂正依頼、その他のお問い合わせを受け付けています。
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            お問い合わせ種別 <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">選択してください</option>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Target URL */}
        {reason && reason !== "INQUIRY" && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              対象ページのURL
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://johokyosha.com/org/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">該当するページのURLを貼り付けてください</p>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            お名前（任意）
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="山田太郎"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">ご返信先のメールアドレスを入力してください</p>
        </div>

        {/* Detail */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            詳細 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
            rows={6}
            placeholder="削除を希望する理由や、具体的な内容をご記入ください。"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Notice */}
        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
          <p>・すべての削除依頼に応じることを保証するものではありません。</p>
          <p>・内容を確認の上、原則7営業日以内にご返信いたします。</p>
          <p>・虚偽の申告による削除依頼は対応いたしかねます。</p>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm font-medium"
        >
          送信する
        </button>
      </form>
    </div>
  );
}
