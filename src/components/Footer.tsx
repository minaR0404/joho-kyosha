import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-3">情報強者</h3>
            <p className="text-sm leading-relaxed">
              みんなで情報を共有して騙されないように情報強者になろう。
              悪徳商法に入る前にまずはこのサイトを確認しよう。
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-3">カテゴリ</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <li><Link href="/category/info-products" className="hover:text-white transition-colors">情報商材</Link></li>
              <li><Link href="/category/mlm" className="hover:text-white transition-colors">マルチ商法(MLM)</Link></li>
              <li><Link href="/category/investment-school" className="hover:text-white transition-colors">投資スクール・セミナー</Link></li>
              <li><Link href="/category/crypto-fx" className="hover:text-white transition-colors">暗号資産・FX</Link></li>
              <li><Link href="/category/real-estate" className="hover:text-white transition-colors">不動産投資</Link></li>
              <li><Link href="/category/online-salon" className="hover:text-white transition-colors">オンラインサロン</Link></li>
              <li><Link href="/category/side-job" className="hover:text-white transition-colors">副業・在宅ワーク</Link></li>
              <li><Link href="/category/school" className="hover:text-white transition-colors">資格・スクール商法</Link></li>
              <li><Link href="/category/beauty-health" className="hover:text-white transition-colors">美容・健康</Link></li>
              <li><Link href="/category/marriage" className="hover:text-white transition-colors">結婚相談所</Link></li>
              <li><Link href="/category/door-to-door" className="hover:text-white transition-colors">訪問販売</Link></li>
              <li><Link href="/category/precious-metals" className="hover:text-white transition-colors">買取・貴金属</Link></li>
              <li><Link href="/category/factoring" className="hover:text-white transition-colors">ファクタリング・金融</Link></li>
              <li><Link href="/category/religion" className="hover:text-white transition-colors">宗教・スピリチュアル</Link></li>
              <li><Link href="/category/other" className="hover:text-white transition-colors">その他</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">リンク</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">このサイトについて</Link></li>
              <li><Link href="/testimonies" className="hover:text-white transition-colors">体験談一覧</Link></li>
              <li><Link href="/testimony/new" className="hover:text-white transition-colors">体験談を投稿</Link></li>
              <li><Link href="/org/new" className="hover:text-white transition-colors">組織を登録する</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">削除依頼・お問い合わせ</Link></li>
              <li>
                <a href="https://www.caa.go.jp/consumers/protect/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  消費者庁
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <div className="flex justify-center gap-4 mb-3">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">プライバシーポリシー</Link>
            <Link href="/guidelines" className="hover:text-gray-300 transition-colors">投稿ガイドライン</Link>
          </div>
          <p>&copy; 2026 情報強者 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
