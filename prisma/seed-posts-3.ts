import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  // === 美容・健康 (5件) cat=2 ===
  {
    userId: 24, categoryId: 2, orgId: 18, title: "無料体験エステから60万円のローン契約を組まされた",
    body: "「無料体験」の広告を見てエステサロンに行きました。施術後、個室で「今日契約すれば通常120万円が60万円」と言われ、断ろうとしましたが「お肌の状態が深刻」「今やらないと手遅れになる」と2時間以上説得されました。精神的に疲れて契約してしまい、その場でローンを組まされました。翌日クーリングオフを申し出たところ「施術済みなので適用外」と言われましたが、消費者センターに相談して無事解約できました。",
    scamType: "エステの強引な勧誘", damageAmount: "60万円（解約済み）", period: "2024年8月",
    relationship: "被害者", isAnonymous: true, tagIds: [11, 18, 20, 10],
  },
  {
    userId: 33, categoryId: 2, orgId: null, title: "脱毛サロンが突然閉店して前払い金が戻らない",
    body: "全身脱毛の2年コースを35万円で契約し、一括前払い。半年ほど通っていましたが、ある日突然「閉店のお知らせ」がメールで届き、以降連絡が取れなくなりました。店舗に行くともぬけの殻。残りの施術分の返金を求めようにも、運営会社が破産手続きに入っており、返金の見込みはほぼゼロ。同じ被害者が数百人いるようです。前払いのリスクを痛感しました。",
    scamType: "脱毛サロン破綻", damageAmount: "約20万円分（残り施術）", period: "2024年11月",
    relationship: "被害者", isAnonymous: false, tagIds: [9, 6, 12],
  },
  {
    userId: 46, categoryId: 2, orgId: null, title: "「初回500円」のサプリが実は高額定期購入だった",
    body: "Instagram広告で「ダイエットサプリ初回500円」と見て購入。届いた商品はまあ普通でしたが、翌月も届いて5,980円を請求されました。よく見ると「最低4回の継続が条件」と小さく書いてあり、総額約2万円の定期購入契約でした。解約しようとしても電話が全くつながらず、解約専用フォームもエラーで動かない。結局4回受け取るまで解約できませんでした。",
    scamType: "定期購入トラブル", damageAmount: "約2万円", period: "2025年1月",
    relationship: "購入者", isAnonymous: true, tagIds: [18, 5],
  },
  {
    userId: 54, categoryId: 2, orgId: null, title: "美容クリニックで不要な施術を追加された",
    body: "二重整形のカウンセリングに行ったところ、「ついでに目の下のクマも取りましょう」「鼻も少し整えたほうがバランスが良い」と次々に追加施術を勧められました。最初は15万円の予定が、気づけば見積もりが80万円に。その場の雰囲気に飲まれそうになりましたが、「一度帰って考えます」と言って帰宅。冷静になって他院で相談したら、追加施術は不要とのことでした。",
    scamType: "美容クリニックのアップセル", period: "2024年6月",
    relationship: "カウンセリング体験者", isAnonymous: true, tagIds: [9, 18],
  },
  {
    userId: 61, categoryId: 2, orgId: null, title: "健康食品の訪問販売で高齢の祖母が大量購入させられていた",
    body: "一人暮らしの祖母の家に行ったら、見たことのない健康食品が大量にありました。聞くと、「健康にいいから」と訪問販売員が定期的に来ていて、毎月3万円分の健康食品を購入していたとのこと。半年以上続いており、総額20万円以上。祖母は「断ると申し訳ない」と思っていたようです。消費者センターに相談し、未開封分は返品できました。高齢者の一人暮らしを狙う手口は卑劣です。",
    scamType: "高齢者への健康食品訪問販売", damageAmount: "20万円以上", period: "2024年",
    relationship: "家族が被害", isAnonymous: true, tagIds: [9, 7, 10],
  },

  // === 訪問販売・買取 (4件) cat=3 ===
  {
    userId: 28, categoryId: 3, orgId: null, title: "屋根の無料点検と言われて300万円のリフォーム契約を迫られた",
    body: "「近所で工事をしていて、お宅の屋根が傷んでいるのが見えた」と作業服の男性が突然訪問。「無料で点検します」と言われ、屋根に登らせたところ、「このままだと雨漏りする。すぐに修理が必要」と写真を見せられました。提示された見積もりは300万円。「今日決めてくれたら250万円にする」と契約を急かされましたが、不審に思い断りました。後日別の業者に見てもらったら、屋根に問題はありませんでした。",
    scamType: "点検商法", period: "2024年5月",
    relationship: "勧誘された", isAnonymous: false, tagIds: [18, 9, 5],
  },
  {
    userId: 40, categoryId: 3, orgId: null, title: "「不用品を買い取ります」の訪問で貴金属を安値で持っていかれた",
    body: "「不用品を買い取ります」と電話があり、古い服を売ろうと訪問を許可。しかし業者が来ると「貴金属はありませんか？」としつこく聞かれ、母の形見のネックレスを見せたところ「これは2,000円くらいですね」と安値を提示。断ろうとしましたが「もう査定したので」と強引に買い取られてしまいました。後日別の店で同じものを査定したら5万円以上の価値があると言われました。いわゆる押し買いです。",
    scamType: "押し買い", damageAmount: "約5万円相当", period: "2024年3月",
    relationship: "被害者", isAnonymous: true, tagIds: [18, 9],
  },
  {
    userId: 47, categoryId: 3, orgId: null, title: "排水管清掃の訪問で高額請求された",
    body: "「この地域の排水管を一斉清掃しています」と業者が訪問。自治体の事業かと思って依頼したら、清掃後に「排水管が劣化しているので交換が必要。15万円です」と請求されました。自治体に確認したところ、そのような事業は行っておらず、完全に民間業者の営業でした。清掃代3万円は支払いましたが、交換は断りました。後で調べると同様の手口で高額請求している業者が多いようです。",
    scamType: "排水管点検商法", damageAmount: "3万円", period: "2024年10月",
    relationship: "被害者", isAnonymous: true, tagIds: [5, 18],
  },
  {
    userId: 66, categoryId: 3, orgId: null, title: "シロアリ駆除で200万円の見積もりを出された",
    body: "床下の無料点検を名目に訪問してきた業者に「シロアリがいます。このままだと家が倒壊します」と言われ、200万円の駆除・補強工事を勧められました。恐怖心から契約しそうになりましたが、息子に相談したところ「まず他の業者にも見てもらおう」と言われ、別の業者に依頼。結果、シロアリは確かにいましたが被害は軽微で、駆除費用は30万円程度とのこと。最初の業者の見積もりは相場の6倍以上でした。",
    scamType: "シロアリ駆除の高額請求", period: "2024年7月",
    relationship: "勧誘された", isAnonymous: false, tagIds: [9, 5, 18],
  },

  // === 宗教・スピリチュアル (4件) cat=9 ===
  {
    userId: 56, categoryId: 9, orgId: 12, title: "親が統一教会に多額の献金をしていた",
    body: "母が統一教会（現・世界平和統一家庭連合）に入信していたことを、父の死後に知りました。長年にわたり「先祖の因縁を解くため」として数百万円の献金をしていたようです。家族には秘密にしていたため、発覚した時にはもう取り戻せない状態でした。2022年以降の報道で同様の被害者が多くいることを知り、弁護団に相談しています。宗教法人の解散命令請求が出ていますが、返金がどうなるかはまだわかりません。",
    scamType: "高額献金", damageAmount: "数百万円", period: "2010年代〜2022年",
    relationship: "家族が被害", isAnonymous: true, tagIds: [9, 1, 12, 19],
  },
  {
    userId: 62, categoryId: 9, orgId: null, title: "占いサイトにハマって100万円以上課金してしまった",
    body: "人間関係に悩んでいた時、ネットで見つけた占いサイトに登録。最初は無料でしたが「あなたには特別な力がある」「もう少しで運命が変わる」とメッセージが来て、有料ポイントを購入し続けてしまいました。1回のやり取りで数千円かかり、気づいたら半年で100万円以上を課金。冷静になって振り返ると、全てテンプレート的な回答で、個人に合わせた内容ではありませんでした。依存性のあるサービスは本当に怖いです。",
    scamType: "占いサイト課金", damageAmount: "100万円以上", period: "2023年〜2024年",
    relationship: "利用者", isAnonymous: true, tagIds: [9, 5],
  },
  {
    userId: 67, categoryId: 9, orgId: null, title: "スピリチュアルカウンセラーに200万円払った母",
    body: "体調不良が続いていた母が、知人の紹介でスピリチュアルカウンセラーのセッションを受け始めました。「前世のカルマが原因」「浄化が必要」と言われ、1回3万円のセッションを月に数回。さらに「パワーストーン」（20万円）や「浄化グッズ」（15万円）を次々購入。2年間で総額200万円以上を費やしていました。本人は「効果がある」と信じ込んでおり、家族が止めても聞き入れません。",
    scamType: "スピリチュアル商法", damageAmount: "200万円以上", period: "2022年〜2024年",
    relationship: "家族が被害", isAnonymous: true, tagIds: [9, 7, 1],
  },
  {
    userId: 68, categoryId: 9, orgId: 13, title: "「足裏診断」で不安を煽られて高額な祈祷を勧められた",
    body: "街頭で「無料の足裏診断をしています」と声をかけられ、興味本位で受けてみました。すると「足裏に悪い相が出ている」「このままだと大病をする」と深刻な表情で言われ、「特別な祈祷を受ければ改善できる」と勧められました。祈祷料は50万円。怖くなりましたが、その場では断り、家に帰って調べたところ、同じ手口の被害報告が多数ありました。不安を煽って高額な商品やサービスを売る典型的な霊感商法です。",
    scamType: "霊感商法", period: "2024年4月",
    relationship: "勧誘された", isAnonymous: false, tagIds: [11, 5, 8],
  },

  // === その他 (3件) cat=8 ===
  {
    userId: 49, categoryId: 8, orgId: null, title: "結婚相談所で高額な入会金を払ったが紹介がほぼない",
    body: "「成婚率90%」を謳う結婚相談所に入会金30万円＋月会費2万円で登録。しかし入会後に紹介された相手は3ヶ月でたった2人。担当者に催促しても「条件に合う方がいない」の一点張り。退会を申し出ると「もう少し条件を広げれば」と引き止められましたが、退会しました。入会金の返金は契約書に「返金不可」と書いてあり断念。成婚率の計算方法も不透明で、実態とかけ離れた数字だったと思います。",
    scamType: "結婚相談所トラブル", damageAmount: "36万円", period: "2024年",
    relationship: "元会員", isAnonymous: true, tagIds: [9, 5, 6],
  },
  {
    userId: 36, categoryId: 8, orgId: null, title: "フリマアプリで偽ブランド品を購入してしまった",
    body: "フリマアプリで定価の半額で出品されていたブランドバッグを8万円で購入。届いた商品は一見本物に見えましたが、よく見ると縫製が雑で、正規店に持ち込んだところ偽物と判明。出品者に返品を求めましたが「すり替え防止のため返品不可」と拒否されました。アプリの事務局に申し立てたところ、調査の結果返金してもらえましたが、対応に2ヶ月かかりました。安すぎる商品には理由があります。",
    scamType: "偽ブランド品販売", damageAmount: "8万円（返金済み）", period: "2024年12月",
    relationship: "購入者", isAnonymous: false, tagIds: [5],
  },
  {
    userId: 64, categoryId: 8, orgId: null, title: "チケット転売サイトで詐欺に遭った",
    body: "人気アーティストのライブチケットをSNSで見つけた転売サイトから3万円で購入。しかし届いたチケットは偽造品で、当日入場できませんでした。サイトに問い合わせても返信なし、電話番号も繋がらず。SNSのアカウントも削除されていました。決済はプリペイドカードで行ったため、返金の手段もなし。チケットは必ず公式サイトから購入すべきだと痛感しました。",
    scamType: "チケット詐欺", damageAmount: "3万円", period: "2025年2月",
    relationship: "被害者", isAnonymous: true, tagIds: [15, 3],
  },
];

async function main() {
  let created = 0;
  for (const p of posts) {
    const { tagIds, ...data } = p;
    await prisma.post.create({
      data: {
        ...data,
        status: "PUBLISHED",
        tags: tagIds?.length ? { create: tagIds.map((tagId) => ({ tagId })) } : undefined,
      },
    });
    created++;
  }
  console.log(`Created ${created} posts (美容/訪問販売/宗教/その他)`);

  const orgsToUpdate = [...new Set(posts.filter((p) => p.orgId).map((p) => p.orgId!))];
  for (const orgId of orgsToUpdate) {
    const count = await prisma.post.count({ where: { orgId, deletedAt: null, status: "PUBLISHED" } });
    await prisma.organization.update({ where: { id: orgId }, data: { postCount: count } });
    console.log(`  Org ${orgId} postCount → ${count}`);
  }

  const total = await prisma.post.count({ where: { deletedAt: null, status: "PUBLISHED" } });
  console.log(`\nTotal posts in DB: ${total}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
