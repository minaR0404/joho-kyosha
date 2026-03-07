import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">利用規約</h1>

      <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
        <p>
          本利用規約（以下「本規約」）は、情報強者（以下「当サイト」）の利用条件を定めるものです。
          ユーザーの皆さまには、本規約に同意いただいた上で当サイトをご利用いただきます。
        </p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第1条（適用）</h2>
          <p>
            本規約は、ユーザーと当サイト運営者との間の当サイトの利用に関わる一切の関係に適用されます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第2条（利用登録）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>利用登録は、申請者が本規約に同意の上、所定の方法で申請し、当サイトが承認することで完了します。</li>
            <li>当サイトは、以下の場合に利用登録を拒否することがあります。
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>虚偽の事項を届け出た場合</li>
                <li>本規約に違反したことがある者からの申請である場合</li>
                <li>その他、当サイトが適当でないと判断した場合</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第3条（投稿コンテンツ）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>ユーザーは、自らの責任において口コミ・体験談等のコンテンツ（以下「投稿コンテンツ」）を投稿するものとします。</li>
            <li>ユーザーは、投稿コンテンツについて、以下の事項に同意するものとします。
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>投稿コンテンツの著作権は投稿者に帰属しますが、当サイトに対して非独占的な利用許諾を付与するものとします。</li>
                <li>投稿コンテンツは、当サイト上での表示のほか、統計分析・情報提供等の目的で第三者に提供される場合があります。</li>
                <li>投稿コンテンツは、ユーザーが削除した後も、統計・分析・情報提供の目的で当サイトが保持・利用する場合があります。</li>
              </ul>
            </li>
            <li>ユーザーは、<Link href="/guidelines" className="text-blue-600 hover:underline">投稿ガイドライン</Link>を遵守するものとします。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第4条（禁止事項）</h2>
          <p>ユーザーは、以下の行為をしてはなりません。</p>
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>法令または公序良俗に違反する行為</li>
            <li>虚偽の情報を故意に投稿する行為</li>
            <li>特定の個人を識別できる情報（実名・住所・電話番号等）を本人の同意なく投稿する行為</li>
            <li>他のユーザーや第三者の知的財産権、プライバシー権、名誉権その他の権利を侵害する行為</li>
            <li>競合他社の評判を不当に貶める目的での投稿（いわゆるステルスマーケティングを含む）</li>
            <li>組織的に虚偽の高評価または低評価を投稿する行為</li>
            <li>スクレイピング、クローリング等の自動収集ツールを用いてデータを収集する行為</li>
            <li>当サイトのサーバーに過度の負荷をかける行為</li>
            <li>当サイトの運営を妨害する行為</li>
            <li>その他、当サイトが不適切と判断する行為</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第5条（コンテンツの削除）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>当サイトは、投稿コンテンツが本規約または投稿ガイドラインに違反すると判断した場合、事前の通知なく当該コンテンツを削除できるものとします。</li>
            <li>削除依頼は<Link href="/contact" className="text-blue-600 hover:underline">削除依頼フォーム</Link>より受け付けます。ただし、すべての依頼に応じることを保証するものではありません。</li>
            <li>当サイトは、投稿コンテンツの正確性、信頼性、適法性について保証するものではありません。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第6条（アカウントの停止・削除）</h2>
          <p>
            当サイトは、ユーザーが本規約に違反した場合、または不正利用が認められた場合、
            事前の通知なくアカウントの停止または削除を行うことができるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第7条（免責事項）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>当サイトは、投稿コンテンツの内容について一切の責任を負いません。投稿コンテンツはユーザー個人の意見・体験に基づくものであり、当サイトの見解を示すものではありません。</li>
            <li>当サイトは、ユーザー間または ユーザーと第三者との間で生じたトラブルについて一切の責任を負いません。</li>
            <li>当サイトは、サービスの中断・停止・終了、データの消失等により生じた損害について一切の責任を負いません。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第8条（サービスの変更・終了）</h2>
          <p>
            当サイトは、ユーザーに事前に通知することなく、サービスの内容を変更し、
            またはサービスの提供を終了することができるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第9条（規約の変更）</h2>
          <p>
            当サイトは、必要と判断した場合には、ユーザーに通知することなく本規約を変更できるものとします。
            変更後の利用規約は、当サイト上に掲示した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第10条（準拠法・管轄裁判所）</h2>
          <p>
            本規約の解釈にあたっては日本法を準拠法とします。
            当サイトに関して紛争が生じた場合には、当サイト運営者の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </section>

        <p className="text-gray-500 pt-4 border-t border-gray-200">
          制定日：2026年3月7日
        </p>
      </div>
    </div>
  );
}
