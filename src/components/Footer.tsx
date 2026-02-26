import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">情報強者</h3>
            <p className="text-sm leading-relaxed">
              みんなで情報を共有して騙されないように情報強者になろう。
              悪徳商法に入る前にまずはこのサイトを確認しよう。
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">カテゴリ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/info-products" className="hover:text-white transition-colors">情報商材</Link></li>
              <li><Link href="/category/mlm" className="hover:text-white transition-colors">マルチ商法(MLM)</Link></li>
              <li><Link href="/category/religion" className="hover:text-white transition-colors">宗教</Link></li>
              <li><Link href="/category/investment" className="hover:text-white transition-colors">投資スクール</Link></li>
              <li><Link href="/category/online-salon" className="hover:text-white transition-colors">オンラインサロン</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">リンク</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">このサイトについて</Link></li>
              <li><Link href="/org/new" className="hover:text-white transition-colors">組織を登録する</Link></li>
              <li>
                <a href="https://www.caa.go.jp/consumers/protect/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  消費者庁
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 情報強者 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
