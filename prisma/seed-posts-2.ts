import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  // === オンラインサロン (6件) cat=5 ===
  {
    userId: 22, categoryId: 5, orgId: 14, title: "月額2万円のビジネスサロンに入ったが中身がなかった",
    body: "YouTubeで見かけたインフルエンサーが運営するビジネスサロンに月額2万円で入会。「人脈が広がる」「起業のノウハウが学べる」と期待しましたが、実態は週1回の雑談ライブ配信と、過去の動画アーカイブだけ。質問しても運営からの返答はなく、活発なのは会員同士の雑談チャットのみ。3ヶ月で退会しましたが、退会手続きがわかりにくく、1ヶ月余計に課金されました。",
    damageAmount: "8万円", period: "2024年6月",
    relationship: "元会員", isAnonymous: true, tagIds: [9, 5, 2],
  },
  {
    userId: 31, categoryId: 5, orgId: 14, title: "サロン内で別の投資案件を勧められた",
    body: "ビジネス系オンラインサロンに入会後、サロン内で知り合ったメンバーから「サロンとは別に、いい投資案件がある」と暗号資産のアービトラージを勧められました。「月利5%」と聞いて100万円を預けましたが、3ヶ月後に連絡が取れなくなりました。サロン運営に報告しても「個人間のことなので関与できない」と対応してもらえず。サロン自体がこうした勧誘の温床になっている印象です。",
    scamType: "サロン内投資詐欺", damageAmount: "100万円", period: "2024年3月",
    relationship: "元会員", isAnonymous: true, tagIds: [9, 3, 6],
  },
  {
    userId: 44, categoryId: 5, orgId: null, title: "「上場予定の暗号資産」を勧められて購入したが上場しない",
    body: "投資系オンラインサロンで「近々上場予定の暗号資産が10倍になる」と紹介され、50万円分を購入。他の参加者も買っており、サロン内は盛り上がっていました。しかし上場予定日が何度も延期され、半年経っても上場せず。返金を求めましたが「1年契約なので途中解約不可」と言われ、サロン自体も退会できない状態です。",
    scamType: "未上場暗号資産詐欺", damageAmount: "50万円", period: "2024年9月",
    relationship: "元会員", isAnonymous: false, tagIds: [9, 6, 1],
  },
  {
    userId: 52, categoryId: 5, orgId: null, title: "知人紹介で10万円もらえるマルチ型サロン",
    body: "海外旅行中に知り合った日本人から、資産構築を学べるオンラインサロンを紹介されました。月額2万円の入会金に加え、知人を紹介すると10万円の報酬がもらえるとのこと。入会してみると内容は浅く、結局「人を紹介して報酬を得る」ことがメインのマルチ構造でした。3ヶ月で退会しましたが、紹介した友人にも迷惑をかけてしまい申し訳ない気持ちです。",
    damageAmount: "6万円", period: "2024年1月",
    relationship: "元会員", isAnonymous: true, tagIds: [8, 7, 16],
  },
  {
    userId: 59, categoryId: 5, orgId: null, title: "稼げると聞いて入ったサロンがやりがい搾取だった",
    body: "「ライティングスキルを身につけて月10万円稼ごう」というサロンに月額5000円で入会。課題としてブログ記事を書かされましたが、実はそれがサロン運営者のサイトに無料で掲載されていました。つまり会員が書いた記事で運営者が広告収入を得る仕組み。報酬は「実績として使っていい」という承認のみ。完全にやりがい搾取でした。",
    damageAmount: "3万円", period: "2024年8月",
    relationship: "元会員", isAnonymous: true, tagIds: [5, 2],
  },
  {
    userId: 38, categoryId: 5, orgId: null, title: "退会手続きが意図的にわかりにくいサロン",
    body: "月額1万円のマーケティングサロンに入会しましたが、期待した内容と違ったため1ヶ月で退会しようとしました。しかし退会方法がサイトのどこにも書いておらず、問い合わせフォームから連絡しても1週間返信なし。SNSのDMでようやく返答がありましたが、「退会は翌月末から適用」と言われ、結局2ヶ月分支払うことに。最初から退会させにくい設計になっていると感じました。",
    damageAmount: "2万円", period: "2025年2月",
    relationship: "元会員", isAnonymous: false, tagIds: [1, 6],
  },

  // === 副業・スクール (6件) cat=1 ===
  {
    userId: 23, categoryId: 1, orgId: 17, title: "アフィリエイトスクールに40万円払ったが稼げなかった",
    body: "「3ヶ月で月収30万円」と謳うアフィリエイトスクールに40万円で入会。教材はPDFとZoom講義でしたが、内容は書籍やネットで得られるレベル。講師に質問しても「もっと記事を書いてください」の繰り返し。3ヶ月で50記事以上書きましたが収益はほぼゼロ。「もっと頑張れば結果が出る」と言われましたが、同期の受講生も誰一人稼げていませんでした。",
    scamType: "高額アフィリエイトスクール", damageAmount: "40万円", period: "2024年4月",
    relationship: "元受講生", isAnonymous: true, tagIds: [9, 5, 2],
  },
  {
    userId: 32, categoryId: 1, orgId: null, title: "プログラミングスクールでマルチ的な勧誘を受けた",
    body: "SNSのDMで「プログラミングを学んで副業しませんか？」と誘われ、カフェで面談。煽られて40万円のスクールに入会しましたが、教材は古く、チャットサポートも返信が遅い。さらに「友人を紹介すると5万円のキャッシュバック」という紹介制度があり、実質マルチ的な構造でした。プログラミング自体は独学でも学べる内容で、高い授業料を払った意味がありませんでした。",
    scamType: "マルチ型プログラミングスクール", damageAmount: "40万円", period: "2024年7月",
    relationship: "元受講生", isAnonymous: false, tagIds: [9, 3, 8],
  },
  {
    userId: 45, categoryId: 1, orgId: null, title: "「転職保証」を信じて入ったスクールが最悪だった",
    body: "「未経験からエンジニア転職率95%」という広告に惹かれ、60万円のプログラミングスクールに入学。しかし実態は動画を見て独学するだけ。メンターに質問しても「まず公式ドキュメントを読んでください」と冷たい対応。転職サポートも形だけで、紹介される求人はSES（客先常駐）ばかり。転職保証の条件をよく読むと「全カリキュラム完了＋100社応募」など非現実的な条件が並んでいました。",
    scamType: "高額プログラミングスクール", damageAmount: "60万円", period: "2024年1月",
    relationship: "元受講生", isAnonymous: true, tagIds: [9, 5, 6],
  },
  {
    userId: 53, categoryId: 1, orgId: null, title: "せどりスクールで在庫を抱えてしまった",
    body: "「物販で月収50万」というセミナーに参加し、30万円のせどりスクールに入会。「この商品を仕入れれば売れる」と言われた通りに20万円分の在庫を仕入れましたが、同じスクール生が同じ商品を出品しているため価格競争になり、全然売れず。在庫を捌くために赤字で販売する羽目に。講師は「仕入れの判断は自己責任」と突き放されました。",
    scamType: "せどりスクール", damageAmount: "50万円", period: "2024年10月",
    relationship: "元受講生", isAnonymous: true, tagIds: [9, 5],
  },
  {
    userId: 60, categoryId: 1, orgId: null, title: "動画編集スクールに通ったが案件が取れない",
    body: "「動画編集で月10万円の副収入」と謳うスクールに25万円で入会。カリキュラム自体は悪くなかったですが、卒業後に案件を取ろうとしても競争が激しすぎて全く仕事が来ません。スクール側は「ポートフォリオを充実させれば案件は来る」と言いますが、実際には低単価の案件すら取り合い状態。「スキルを身につければ稼げる」は嘘ではないが、市場の現実を伝えないのは不誠実だと思います。",
    damageAmount: "25万円", period: "2024年5月",
    relationship: "元受講生", isAnonymous: false, tagIds: [5, 2],
  },
  {
    userId: 39, categoryId: 1, orgId: null, title: "チャットレディの副業で個人情報を悪用された",
    body: "「在宅で高収入」という広告に応募したところ、チャットレディの仕事でした。登録時に免許証の写真を送るよう言われ、素直に送ってしまいました。その後、仕事内容に不信感を持ち辞めようとしたところ、「個人情報をばらまく」と脅されました。警察に相談して事なきを得ましたが、安易に個人情報を渡してしまったことを深く後悔しています。",
    scamType: "副業詐欺・個人情報悪用", period: "2024年9月",
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
  console.log(`Created ${created} posts (サロン/副業)`);

  const orgsToUpdate = [...new Set(posts.filter((p) => p.orgId).map((p) => p.orgId!))];
  for (const orgId of orgsToUpdate) {
    const count = await prisma.post.count({ where: { orgId, deletedAt: null, status: "PUBLISHED" } });
    await prisma.organization.update({ where: { id: orgId }, data: { postCount: count } });
    console.log(`  Org ${orgId} postCount → ${count}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
