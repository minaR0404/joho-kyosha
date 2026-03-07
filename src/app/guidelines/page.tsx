import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "投稿ガイドライン",
};

export default function GuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">投稿ガイドライン</h1>

      <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
        <p>
          当サイトは、悪徳商法や詐欺的なビジネスに関する情報を共有し、被害を未然に防ぐことを目的としています。
          この目的を達成するため、以下のガイドラインに沿った投稿をお願いします。
        </p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">投稿してほしい内容</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>実体験に基づく情報</strong>
              <p className="mt-1">自分自身が体験したこと、または身近な人から直接聞いた情報を投稿してください。</p>
            </li>
            <li>
              <strong>具体的な事実</strong>
              <p className="mt-1">「いつ」「どこで」「何が起きたか」をできるだけ具体的に記載してください。曖昧な噂や伝聞は避けてください。</p>
            </li>
            <li>
              <strong>客観的な記述</strong>
              <p className="mt-1">感情的な表現よりも、事実に基づいた冷静な記述を心がけてください。</p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">禁止されている投稿</h2>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 mb-2">個人情報の投稿</h3>
              <p>
                組織の代表者名等の公開情報を除き、個人の実名・住所・電話番号・メールアドレス等を
                本人の同意なく投稿することは禁止です。
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 mb-2">虚偽の情報</h3>
              <p>
                事実と異なる情報を故意に投稿することは禁止です。
                競合他社の評判を貶める目的での投稿も含みます。
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 mb-2">誹謗中傷</h3>
              <p>
                事実に基づかない侮辱的な表現、差別的な発言、脅迫は禁止です。
                批判は具体的な事実に基づいて行ってください。
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 mb-2">ステルスマーケティング・自作自演</h3>
              <p>
                関係者が一般ユーザーを装って高評価を投稿する行為、
                または組織的に特定の対象に低評価を投稿する行為は禁止です。
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 mb-2">宣伝・スパム</h3>
              <p>
                商品やサービスの宣伝、アフィリエイトリンク、無関係なURLの投稿は禁止です。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">口コミの評価基準</h2>
          <p>口コミでは以下の5つの観点で評価をお願いしています。</p>
          <div className="mt-3 space-y-2">
            <div className="flex gap-3 items-start">
              <span className="font-bold text-gray-900 shrink-0 w-28">危険度</span>
              <span>その組織に関わることで、金銭的・精神的な被害を受けるリスクの高さ</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="font-bold text-gray-900 shrink-0 w-28">費用負担</span>
              <span>不当に高額な費用を請求されるか、隠れたコストがあるか</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="font-bold text-gray-900 shrink-0 w-28">勧誘圧力</span>
              <span>しつこい勧誘や心理的な圧力をかけてくるか</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="font-bold text-gray-900 shrink-0 w-28">情報透明性</span>
              <span>重要な情報（リスク、費用、契約条件等）を正直に開示しているか</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="font-bold text-gray-900 shrink-0 w-28">退会容易性</span>
              <span>やめたいときにスムーズに退会・解約できるか</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">投稿の削除について</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>本ガイドラインに違反する投稿は、事前の通知なく削除される場合があります。</li>
            <li>違反投稿を繰り返すユーザーは、アカウントを停止する場合があります。</li>
            <li>投稿に問題がある場合は、各投稿の「通報」ボタンからご報告ください。</li>
            <li>削除依頼は<Link href="/contact" className="text-blue-600 hover:underline">削除依頼フォーム</Link>より受け付けています。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">免責事項</h2>
          <p>
            当サイトに投稿された口コミ・体験談はユーザー個人の意見・体験に基づくものであり、
            当サイトの見解を示すものではありません。投稿内容の正確性について当サイトは保証しません。
            詳しくは<Link href="/terms" className="text-blue-600 hover:underline">利用規約</Link>をご確認ください。
          </p>
        </section>

        <p className="text-gray-500 pt-4 border-t border-gray-200">
          制定日：2026年3月7日
        </p>
      </div>
    </div>
  );
}
