"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShieldAlert, Network, TrendingUp, Monitor, Landmark, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_CATEGORIES = [
  { slug: "info-products", name: "情報商材", icon: ShieldAlert },
  { slug: "mlm", name: "マルチ商法(MLM)", icon: Network },
  { slug: "investment", name: "投資スクール", icon: TrendingUp },
  { slug: "online-salon", name: "オンラインサロン", icon: Monitor },
  { slug: "religion", name: "宗教", icon: Landmark },
  { slug: "other", name: "その他", icon: LayoutGrid },
];

export default function Header() {
  const pathname = usePathname();
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
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              ログイン
            </Link>
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
                      <cat.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row gap-1">
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
