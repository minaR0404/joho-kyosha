"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Search, User, LogOut, Home, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/category-config";

const MENU_CATEGORIES = [
  { slug: "info-products", name: "情報商材" },
  { slug: "mlm", name: "マルチ商法(MLM)" },
  { slug: "investment", name: "投資・金融" },
  { slug: "online-salon", name: "オンラインサロン" },
  { slug: "side-job-school", name: "副業・スクール" },
  { slug: "beauty-health", name: "美容・健康" },
  { slug: "door-to-door", name: "訪問販売・買取" },
  { slug: "religion", name: "宗教・スピリチュアル" },
  { slug: "other", name: "その他" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="メニュー"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-800">情報強者</span>
              <span className="text-xs text-gray-500 hidden sm:block">
                騙される前に、まずチェック。
              </span>
            </Link>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/search"
              className={cn(
                "text-sm px-3 py-2 rounded-md transition-colors",
                pathname === "/search"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Search className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">検索</span>
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm px-3 py-2 rounded-md transition-colors hidden sm:block",
                pathname === "/about"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              このサイトについて
            </Link>
            {session?.user ? (
              <Link
                href="/mypage"
                className={cn(
                  "text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-1.5",
                  pathname === "/mypage"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">マイページ</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
              >
                ログイン
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">カテゴリ</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {MENU_CATEGORIES.map((cat) => {
                  const active = pathname === `/category/${cat.slug}`;
                  const Icon = getCategoryIcon(cat.slug);
                  return (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">投稿</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                <Link
                  href="/posts"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === "/posts"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <MessageSquareText className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  投稿一覧
                </Link>
                <Link
                  href="/post/new"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  投稿する
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row gap-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Home className="w-4 h-4" />
                ホーム
              </Link>
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Search className="w-4 h-4" />
                検索
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 sm:hidden"
              >
                このサイトについて
              </Link>
              <Link
                href="/org/new"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                組織を登録する
              </Link>
              {session?.user && (
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  ログアウト
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
