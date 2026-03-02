"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage("新しいパスワードは8文字以上にしてください");
      setIsError(true);
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage("パスワードを変更しました");
        setIsError(false);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await res.json();
        setMessage(data.error || "変更に失敗しました");
        setIsError(true);
      }
    } catch {
      setMessage("変更に失敗しました");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="font-bold text-gray-900 mb-3">パスワード変更</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="現在のパスワード"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="新しいパスワード（8文字以上）"
          required
          minLength={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword}
            className="px-4 py-2 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? "変更中..." : "変更する"}
          </button>
          {message && (
            <p className={`text-sm ${isError ? "text-red-600" : "text-gray-600"}`}>{message}</p>
          )}
        </div>
      </form>
    </div>
  );
}
