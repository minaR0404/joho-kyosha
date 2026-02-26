import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">このサイトについて</h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">「情報強者」とは</h2>
          <p className="text-gray-700 leading-relaxed">
            情報強者は、情報商材・マルチ商法（MLM）・宗教・投資スクールなどに関する
            口コミ・評判を共有するプラットフォームです。
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            「みんなで情報を共有して騙されないように情報強者になろう。
            悪徳商法に入る前にまずはこのサイトを確認しよう」をコンセプトに、
            消費者同士が体験を共有し合える場を目指しています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">評価システム</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            各組織・商材は5つの軸で評価されます（各1〜5段階）:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="font-medium text-gray-900 w-32">危険度</span>
              <span className="text-gray-600">総合的なリスクの高さ</span>
            </div>
            <div className="flex gap-3">
              <span className="font-medium text-gray-900 w-32">金銭的リスク</span>
              <span className="text-gray-600">失う可能性のある金額の大きさ</span>
            </div>
            <div className="flex gap-3">
              <span className="font-medium text-gray-900 w-32">勧誘の強さ</span>
              <span className="text-gray-600">勧誘のしつこさ・圧力の度合い</span>
            </div>
            <div className="flex gap-3">
              <span className="font-medium text-gray-900 w-32">情報の不透明さ</span>
              <span className="text-gray-600">情報の隠蔽・欺瞞の度合い</span>
            </div>
            <div className="flex gap-3">
              <span className="font-medium text-gray-900 w-32">脱退の難しさ</span>
              <span className="text-gray-600">やめにくさ・退会障壁の高さ</span>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mt-3">
            総合スコアは5軸の平均値で算出されます。数値が高いほどリスクが高いことを意味します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">口コミの投稿について</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>口コミの投稿にはアカウント登録が必要です</li>
            <li>匿名での投稿が可能です（推奨）</li>
            <li>事実に基づいた体験を共有してください</li>
            <li>誹謗中傷や虚偽の情報は掲載できません</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">お困りの方へ</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            被害に遭われた方は、以下の公的機関にご相談ください:
          </p>
          <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
            <div>
              <span className="font-medium">消費者ホットライン:</span>{" "}
              <span className="text-blue-700 font-bold">188</span>（いやや!）
            </div>
            <div>
              <span className="font-medium">消費者庁:</span>{" "}
              <a
                href="https://www.caa.go.jp/consumers/protect/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://www.caa.go.jp/consumers/protect/
              </a>
            </div>
            <div>
              <span className="font-medium">警察相談専用電話:</span>{" "}
              <span className="text-blue-700 font-bold">#9110</span>
            </div>
          </div>
        </section>

        <div className="text-center pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
