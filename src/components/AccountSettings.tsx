"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, Lock } from "lucide-react";

type OpenSection = null | "displayName" | "password";

export default function AccountSettings({ currentName, email }: { currentName: string; email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState<OpenSection>(null);

  // Display name state
  const [name, setName] = useState(currentName);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMessage, setNameMessage] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwIsError, setPwIsError] = useState(false);

  const toggle = (section: OpenSection) => {
    setOpen(open === section ? null : section);
    setNameMessage("");
    setPwMessage("");
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === currentName) return;
    setNameLoading(true);
    setNameMessage("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name.trim() }),
      });
      if (res.ok) {
        setNameMessage("更新しました");
        setOpen(null);
        router.refresh();
      } else {
        const data = await res.json();
        setNameMessage(data.error || "更新に失敗しました");
      }
    } catch {
      setNameMessage("更新に失敗しました");
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPwMessage("新しいパスワードは8文字以上にしてください");
      setPwIsError(true);
      return;
    }
    setPwLoading(true);
    setPwMessage("");

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPwMessage("パスワードを変更しました");
        setPwIsError(false);
        setCurrentPassword("");
        setNewPassword("");
        setOpen(null);
      } else {
        const data = await res.json();
        setPwMessage(data.error || "変更に失敗しました");
        setPwIsError(true);
      }
    } catch {
      setPwMessage("変更に失敗しました");
      setPwIsError(true);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
      {/* Display Name */}
      <div>
        <button
          onClick={() => toggle("displayName")}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Pencil className="w-4 h-4 text-gray-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">表示名</p>
              <p className="text-sm text-gray-500">{currentName}</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open === "displayName" ? "rotate-90" : ""}`} />
        </button>
        {open === "displayName" && (
          <form onSubmit={handleNameSubmit} className="px-5 pb-4 space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={nameLoading || !name.trim() || name === currentName}
                className="px-4 py-2 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {nameLoading ? "更新中..." : "保存"}
              </button>
              <button type="button" onClick={() => { setOpen(null); setName(currentName); }} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                キャンセル
              </button>
              {nameMessage && <p className="text-sm text-gray-600">{nameMessage}</p>}
            </div>
          </form>
        )}
      </div>

      {/* Email (read-only) */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-4 h-4" />
        <div>
          <p className="text-sm font-medium text-gray-900">メールアドレス</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* Password */}
      <div>
        <button
          onClick={() => toggle("password")}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-gray-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">パスワード</p>
              <p className="text-sm text-gray-500">••••••••</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open === "password" ? "rotate-90" : ""}`} />
        </button>
        {open === "password" && (
          <form onSubmit={handlePasswordSubmit} className="px-5 pb-4 space-y-3">
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
                disabled={pwLoading || !currentPassword || !newPassword}
                className="px-4 py-2 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {pwLoading ? "変更中..." : "保存"}
              </button>
              <button type="button" onClick={() => { setOpen(null); setCurrentPassword(""); setNewPassword(""); }} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                キャンセル
              </button>
              {pwMessage && (
                <p className={`text-sm ${pwIsError ? "text-red-600" : "text-gray-600"}`}>{pwMessage}</p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
