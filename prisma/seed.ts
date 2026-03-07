import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Categories (9 categories with sortOrder)
  const categories = await Promise.all([
    prisma.category.create({ data: { slug: "info-products", name: "情報商材", sortOrder: 1 } }),
    prisma.category.create({ data: { slug: "mlm", name: "マルチ商法(MLM)", sortOrder: 2 } }),
    prisma.category.create({ data: { slug: "investment", name: "投資・金融", sortOrder: 3 } }),
    prisma.category.create({ data: { slug: "online-salon", name: "オンラインサロン", sortOrder: 4 } }),
    prisma.category.create({ data: { slug: "side-job-school", name: "副業・スクール", sortOrder: 5 } }),
    prisma.category.create({ data: { slug: "beauty-health", name: "美容・健康", sortOrder: 6 } }),
    prisma.category.create({ data: { slug: "door-to-door", name: "訪問販売・買取", sortOrder: 7 } }),
    prisma.category.create({ data: { slug: "religion", name: "宗教・スピリチュアル", sortOrder: 8 } }),
    prisma.category.create({ data: { slug: "other", name: "その他", sortOrder: 9 } }),
  ]);

  // Tags (20 tags)
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "高額" } }),
    prisma.tag.create({ data: { name: "勧誘がしつこい" } }),
    prisma.tag.create({ data: { name: "返金不可" } }),
    prisma.tag.create({ data: { name: "セミナー商法" } }),
    prisma.tag.create({ data: { name: "SNS勧誘" } }),
    prisma.tag.create({ data: { name: "誇大広告" } }),
    prisma.tag.create({ data: { name: "実績不明" } }),
    prisma.tag.create({ data: { name: "脱退困難" } }),
    prisma.tag.create({ data: { name: "借金させられる" } }),
    prisma.tag.create({ data: { name: "契約を急かされる" } }),
    prisma.tag.create({ data: { name: "クーリングオフ妨害" } }),
    prisma.tag.create({ data: { name: "個人情報悪用" } }),
    prisma.tag.create({ data: { name: "マッチングアプリ勧誘" } }),
    prisma.tag.create({ data: { name: "友人・家族トラブル" } }),
    prisma.tag.create({ data: { name: "行政処分歴あり" } }),
    prisma.tag.create({ data: { name: "未成年被害" } }),
    prisma.tag.create({ data: { name: "消費者センター相談済み" } }),
    prisma.tag.create({ data: { name: "集団訴訟あり" } }),
    prisma.tag.create({ data: { name: "特商法違反の疑い" } }),
    prisma.tag.create({ data: { name: "無料→高額誘導" } }),
  ]);

  // Demo users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      displayName: "管理者",
      hashedPassword,
      provider: "credentials",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      displayName: "匿名ユーザー",
      hashedPassword,
      provider: "credentials",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "test@example.com",
      displayName: "体験者A",
      hashedPassword,
      provider: "credentials",
    },
  });

  // Sample organizations
  const org1 = await prisma.organization.create({
    data: {
      slug: "sample-info-product-a",
      name: "サンプル情報商材A",
      nameKana: "サンプルジョウホウショウザイエー",
      categoryId: categories[0].id,
      description: "「誰でも月収100万円」を謳うオンライン教材。高額なバックエンド商品への誘導が特徴。",
      website: "https://example.com",
      representative: "山田太郎",
      founded: "2022年",
      status: "ACTIVE",
      approvalStatus: "APPROVED",
      submittedById: admin.id,
      avgRating: 4.2,
      reviewCount: 2,
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      slug: "sample-mlm-b",
      name: "サンプルMLM株式会社B",
      nameKana: "サンプルエムエルエムカブシキガイシャビー",
      categoryId: categories[1].id,
      description: "健康食品を扱うネットワークビジネス。友人・知人への勧誘が中心。",
      representative: "佐藤花子",
      founded: "2018年",
      status: "ACTIVE",
      approvalStatus: "APPROVED",
      submittedById: admin.id,
      avgRating: 3.8,
      reviewCount: 2,
    },
  });

  const org3 = await prisma.organization.create({
    data: {
      slug: "sample-investment-c",
      name: "サンプル投資スクールC",
      categoryId: categories[2].id,
      description: "FX・仮想通貨の投資スクール。入会金50万円＋月額5万円。実績の開示が不十分。",
      founded: "2020年",
      status: "ACTIVE",
      approvalStatus: "APPROVED",
      submittedById: admin.id,
      avgRating: 3.5,
      reviewCount: 1,
    },
  });

  const org4 = await prisma.organization.create({
    data: {
      slug: "sample-salon-d",
      name: "サンプルオンラインサロンD",
      categoryId: categories[3].id,
      description: "ビジネス系オンラインサロン。月額1万円で「人脈が広がる」と宣伝しているが、実態はセミナー勧誘がメイン。",
      founded: "2021年",
      status: "ACTIVE",
      approvalStatus: "APPROVED",
      submittedById: admin.id,
      avgRating: 2.8,
      reviewCount: 1,
    },
  });

  // Tags on orgs
  await prisma.tagsOnOrgs.createMany({
    data: [
      { orgId: org1.id, tagId: tags[0].id },
      { orgId: org1.id, tagId: tags[2].id },
      { orgId: org1.id, tagId: tags[5].id },
      { orgId: org2.id, tagId: tags[1].id },
      { orgId: org2.id, tagId: tags[4].id },
      { orgId: org3.id, tagId: tags[0].id },
      { orgId: org3.id, tagId: tags[6].id },
      { orgId: org4.id, tagId: tags[3].id },
    ],
  });

  // Sample reviews
  await prisma.review.createMany({
    data: [
      {
        orgId: org1.id,
        userId: user.id,
        ratingOverall: 4.4,
        ratingDanger: 5,
        ratingCost: 5,
        ratingPressure: 4,
        ratingTransparency: 4,
        ratingExit: 4,
        title: "高額バックエンドに注意",
        body: "無料セミナーに参加したところ、最終的に50万円のコンサルを勧められました。「今日だけ特別価格」と言われましたが、後日同じ価格でした。内容は薄く、ネットで無料で得られる情報ばかりでした。",
        relationship: "勧誘された",
        period: "2023年6月",
        isAnonymous: true,
      },
      {
        orgId: org1.id,
        userId: user2.id,
        ratingOverall: 4.0,
        ratingDanger: 4,
        ratingCost: 5,
        ratingPressure: 3,
        ratingTransparency: 4,
        ratingExit: 4,
        title: "返金を求めたが対応されず",
        body: "30万円の教材を購入しましたが、内容が説明と全く異なっていました。返金を求めましたが、「デジタル商品のため返金不可」の一点張り。消費者センターに相談中です。",
        relationship: "元会員",
        period: "2023年8月",
        isAnonymous: false,
      },
      {
        orgId: org2.id,
        userId: user.id,
        ratingOverall: 3.6,
        ratingDanger: 3,
        ratingCost: 4,
        ratingPressure: 5,
        ratingTransparency: 3,
        ratingExit: 3,
        title: "友人関係が壊れました",
        body: "親しい友人から熱心に勧誘されました。断っても何度も連絡が来て、最終的に友人関係が壊れてしまいました。商品自体は普通の健康食品ですが、価格は市販品の3倍以上。",
        relationship: "勧誘された",
        period: "2022年",
        isAnonymous: true,
      },
      {
        orgId: org2.id,
        userId: user2.id,
        ratingOverall: 4.0,
        ratingDanger: 4,
        ratingCost: 3,
        ratingPressure: 5,
        ratingTransparency: 4,
        ratingExit: 4,
        title: "一度入ると抜けにくい",
        body: "知人の紹介で入会しました。毎月のノルマがあり、達成できないと上位者から圧力がかかります。退会を申し出ると「もったいない」と引き止められ、なかなか辞められませんでした。",
        relationship: "元会員",
        period: "2021年〜2023年",
        isAnonymous: false,
      },
      {
        orgId: org3.id,
        userId: user.id,
        ratingOverall: 3.4,
        ratingDanger: 3,
        ratingCost: 4,
        ratingPressure: 3,
        ratingTransparency: 4,
        ratingExit: 3,
        title: "実績が確認できない",
        body: "入会金50万円を支払いましたが、講師の実績を証明する資料は一切ありませんでした。「月収1000万円」と謳っていますが、根拠となるデータの提示を求めても回答がありません。",
        relationship: "元会員",
        period: "2023年",
        isAnonymous: true,
      },
      {
        orgId: org4.id,
        userId: user2.id,
        ratingOverall: 2.8,
        ratingDanger: 2,
        ratingCost: 3,
        ratingPressure: 3,
        ratingTransparency: 3,
        ratingExit: 3,
        title: "内容は薄いが危険度は低い",
        body: "月額1万円のオンラインサロンに3ヶ月在籍しました。コンテンツはYouTubeレベル。人脈が広がるという触れ込みでしたが、実態はセミナーの案内ばかり。ただ退会は簡単にできました。",
        relationship: "元会員",
        period: "2024年",
        isAnonymous: false,
      },
    ],
  });

  // Sample testimonies
  await prisma.testimony.create({
    data: {
      userId: user.id,
      categoryId: categories[6].id, // 訪問販売・買取
      title: "突然の訪問で高額リフォーム契約",
      body: "「近所で工事をしていて、お宅の屋根が壊れているのが見えた」と突然訪問してきた業者に、その場で150万円のリフォーム契約を結ばされました。後日、別の業者に見てもらったところ屋根に問題はありませんでした。業者名は名刺に書いてありましたが、検索しても出てきません。",
      scamType: "点検商法・訪問販売",
      damageAmount: "150万円",
      period: "2024年3月",
      isAnonymous: true,
      tags: {
        create: [
          { tagId: tags[0].id },  // 高額
          { tagId: tags[9].id },  // 契約を急かされる
        ],
      },
    },
  });

  await prisma.testimony.create({
    data: {
      userId: user2.id,
      categoryId: categories[2].id, // 投資・金融
      title: "マッチングアプリで知り合った人に投資を勧められた",
      body: "マッチングアプリで知り合った相手に「絶対儲かる投資がある」と勧められ、海外の取引サイトに30万円を入金しました。最初は利益が出ているように見えましたが、出金しようとしたところ「手数料が必要」と追加入金を求められました。相手とは連絡が取れなくなり、サイトもアクセスできなくなりました。",
      scamType: "ロマンス詐欺・投資詐欺",
      damageAmount: "30万円",
      period: "2024年9月",
      isAnonymous: false,
      tags: {
        create: [
          { tagId: tags[12].id }, // マッチングアプリ勧誘
          { tagId: tags[0].id },  // 高額
        ],
      },
    },
  });

  await prisma.testimony.create({
    data: {
      userId: user.id,
      categoryId: categories[5].id, // 美容・健康
      title: "無料体験のはずが高額ローンを組まされた",
      body: "「無料体験」の広告を見てエステサロンに行きました。施術後、「今日契約すれば特別価格」と言われ、断りきれず60万円のコースをローンで契約してしまいました。クーリングオフを申し出たところ、「施術済みなので適用外」と言われました。消費者センターに相談して解約できましたが、精神的に疲弊しました。",
      scamType: "エステの強引な勧誘",
      damageAmount: "60万円（解約済み）",
      period: "2025年1月",
      isAnonymous: true,
      tags: {
        create: [
          { tagId: tags[19].id }, // 無料→高額誘導
          { tagId: tags[9].id },  // 契約を急かされる
          { tagId: tags[10].id }, // クーリングオフ妨害
          { tagId: tags[16].id }, // 消費者センター相談済み
        ],
      },
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
