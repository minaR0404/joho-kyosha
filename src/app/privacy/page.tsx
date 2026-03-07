import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

      <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
        <p>
          情報強者（以下「当サイト」）は、ユーザーの個人情報の取扱いについて、
          以下のとおりプライバシーポリシーを定めます。
        </p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. 収集する情報</h2>
          <p>当サイトは、以下の情報を収集する場合があります。</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>アカウント情報：</strong>メールアドレス、表示名、パスワード（ハッシュ化して保存）</li>
            <li><strong>ソーシャルログイン情報：</strong>Google等の外部認証サービスから提供されるプロフィール情報</li>
            <li><strong>投稿情報：</strong>口コミ、体験談、評価等のユーザーが投稿したコンテンツ</li>
            <li><strong>利用情報：</strong>アクセス日時、IPアドレス、ブラウザ情報、閲覧ページ</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
          <p>収集した情報は、以下の目的で利用します。</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>サービスの提供・運営・改善</li>
            <li>ユーザー認証およびアカウント管理</li>
            <li>不正利用の防止・対応</li>
            <li>統計データの作成・分析</li>
            <li>投稿コンテンツの第三者への情報提供（利用規約第3条に基づく）</li>
            <li>法令に基づく開示請求への対応</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. 第三者への提供</h2>
          <p>当サイトは、以下の場合を除き、個人情報を第三者に提供しません。</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合（裁判所の命令、発信者情報開示請求等）</li>
            <li>人の生命・身体・財産の保護のために必要がある場合</li>
            <li>サービスの運営に必要な範囲で業務委託先に提供する場合</li>
          </ul>
          <p className="mt-2">
            なお、投稿コンテンツ（口コミ・体験談等）は、個人を特定できない形で統計分析や
            情報提供の目的で第三者に提供される場合があります。匿名投稿の場合、
            投稿内容は個人情報には該当しません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. データの保持</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>アカウント情報は、退会後も不正防止のため一定期間保持する場合があります。</li>
            <li>投稿コンテンツは、ユーザーが削除した後も、統計・分析・情報提供の目的で保持・利用する場合があります。</li>
            <li>アクセスログは、不正利用対策のため最大12ヶ月間保持します。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Cookieの使用</h2>
          <p>
            当サイトは、ログイン状態の維持やサービスの改善を目的としてCookieを使用します。
            ブラウザの設定によりCookieを無効にすることも可能ですが、一部の機能が利用できなくなる場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. セキュリティ</h2>
          <p>
            当サイトは、個人情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ対策を講じます。
            パスワードはハッシュ化して保存し、通信はSSL/TLSにより暗号化します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. ユーザーの権利</h2>
          <p>ユーザーは、以下の権利を有します。</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>自身の個人情報の開示・訂正・削除を請求する権利</li>
            <li>アカウントを退会する権利</li>
            <li>自身の投稿コンテンツを削除する権利（ただし第4条に基づき保持される場合があります）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. ポリシーの変更</h2>
          <p>
            当サイトは、必要に応じて本ポリシーを変更することがあります。
            変更後のプライバシーポリシーは、当サイト上に掲示した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">9. お問い合わせ</h2>
          <p>
            個人情報の取扱いに関するお問い合わせは、サイト内のお問い合わせフォームよりご連絡ください。
          </p>
        </section>

        <p className="text-gray-500 pt-4 border-t border-gray-200">
          制定日：2026年3月7日
        </p>
      </div>
    </div>
  );
}
