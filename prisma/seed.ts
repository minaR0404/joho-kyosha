import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { slug: "info-products", name: "情報商材", icon: "🎯" } }),
    prisma.category.create({ data: { slug: "mlm", name: "マルチ商法(MLM)", icon: "🕸️" } }),
    prisma.category.create({ data: { slug: "religion", name: "宗教", icon: "⛩️" } }),
    prisma.category.create({ data: { slug: "investment", name: "投資スクール", icon: "💹" } }),
    prisma.category.create({ data: { slug: "online-salon", name: "オンラインサロン", icon: "💻" } }),
    prisma.category.create({ data: { slug: "other", name: "その他", icon: "📂" } }),
  ]);

  // Tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "高額" } }),
    prisma.tag.create({ data: { name: "勧誘がしつこい" } }),
    prisma.tag.create({ data: { name: "返金不可" } }),
    prisma.tag.create({ data: { name: "セミナー商法" } }),
    prisma.tag.create({ data: { name: "SNS勧誘" } }),
    prisma.tag.create({ data: { name: "誇大広告" } }),
    prisma.tag.create({ data: { name: "実績不明" } }),
    prisma.tag.create({ data: { name: "脱退困難" } }),
  ]);

  // Demo user
  const hashedPassword = await bcrypt.hash("password123", 10);
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
      avgRating: 3.8,
      reviewCount: 2,
    },
  });

  const org3 = await prisma.organization.create({
    data: {
      slug: "sample-investment-c",
      name: "サンプル投資スクールC",
      categoryId: categories[3].id,
      description: "FX・仮想通貨の投資スクール。入会金50万円＋月額5万円。実績の開示が不十分。",
      founded: "2020年",
      status: "ACTIVE",
      avgRating: 3.5,
      reviewCount: 1,
    },
  });

  const org4 = await prisma.organization.create({
    data: {
      slug: "sample-salon-d",
      name: "サンプルオンラインサロンD",
      categoryId: categories[4].id,
      description: "ビジネス系オンラインサロン。月額1万円で「人脈が広がる」と宣伝しているが、実態はセミナー勧誘がメイン。",
      founded: "2021年",
      status: "ACTIVE",
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
