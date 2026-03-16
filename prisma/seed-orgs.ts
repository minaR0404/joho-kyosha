import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // カテゴリをslugで取得
  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // 管理者ユーザーを取得（submittedById用）
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  const adminId = admin?.id ?? null;

  const orgs = [
    // === マルチ商法(MLM) ===
    {
      slug: "amway-japan",
      name: "日本アムウェイ合同会社",
      nameKana: "ニホンアムウェイゴウドウガイシャ",
      aliases: "アムウェイ,Amway",
      categoryId: catMap["mlm"],
      description: "米国発の連鎖販売取引（MLM）大手。日用品・化粧品・健康食品等を扱う。2022年10月、消費者庁より勧誘目的の不明示等を理由に6ヶ月間の取引停止命令を受けた。",
      representative: "ピーター・ストライダム",
      founded: "1979年",
      website: "https://www.amway.co.jp",
    },
    {
      slug: "japan-life",
      name: "ジャパンライフ株式会社",
      nameKana: "ジャパンライフカブシキガイシャ",
      aliases: "ジャパンライフ",
      categoryId: catMap["mlm"],
      description: "磁気治療器の預託商法を展開。2016〜2017年に消費者庁から4度の行政処分。2020年に破産手続開始。被害額約2100億円。元会長の山口隆祥が詐欺容疑で逮捕。",
      representative: "山口隆祥",
      founded: "1975年",
    },
    {
      slug: "nu-skin-japan",
      name: "ニュースキンジャパン株式会社",
      nameKana: "ニュースキンジャパンカブシキガイシャ",
      aliases: "ニュースキン,NuSkin,Nu Skin",
      categoryId: catMap["mlm"],
      description: "米国発のMLM企業。化粧品・栄養補助食品を扱う。1997年に業務停止命令を受けた経緯がある。SNSを通じた勧誘トラブルが消費者センターに多数報告されている。",
      founded: "1993年",
      website: "https://www.nuskin.com/ja_JP",
    },

    // === 投資・金融 ===
    {
      slug: "texia-japan",
      name: "テキシアジャパンホールディングス",
      nameKana: "テキシアジャパンホールディングス",
      aliases: "テキシア,TEXIA",
      categoryId: catMap["investment"],
      description: "「月3%の配当」を謳い出資金を募った投資会社。実態はポンジ・スキームとされる。被害額約460億円。2019年に会長の銅子正人が詐欺容疑で逮捕。",
      representative: "銅子正人",
      founded: "2015年頃",
    },
    {
      slug: "kefir-jigyou",
      name: "ケフィア事業振興会",
      nameKana: "ケフィアジギョウシンコウカイ",
      aliases: "ケフィア,かぶちゃん農園",
      categoryId: catMap["investment"],
      description: "干し柿・メープルシロップ等のオーナー商法を展開。元本保証・高利回りを謳い約3万人から資金を集めた。2018年に破産手続開始。被害額約1000億円超。",
      representative: "鏑木秀彌",
      founded: "2003年",
    },
    {
      slug: "exia",
      name: "エクシア合同会社",
      nameKana: "エクシアゴウドウガイシャ",
      aliases: "エクシア,EXIA,エクシアジャパン",
      categoryId: catMap["investment"],
      description: "FX運用を謳い高利回りの配当を約束した投資ファンド。2021年頃から出金停止が相次ぎ問題化。被害者による集団訴訟が提起されている。",
      representative: "菊地翔",
      founded: "2015年",
    },
    {
      slug: "mri-international",
      name: "MRIインターナショナル",
      nameKana: "エムアールアイインターナショナル",
      aliases: "MRI",
      categoryId: catMap["investment"],
      description: "米国の医療保険金の買取事業への投資を謳い、日本人から約1300億円を集めた。実態は架空の運用で、ポンジ・スキームだった。2013年に代表のエドウィン・ヨシヒロ・フジナガが逮捕。",
      representative: "エドウィン・ヨシヒロ・フジナガ",
      founded: "1998年",
    },

    // === 宗教・スピリチュアル ===
    {
      slug: "unification-church",
      name: "世界平和統一家庭連合",
      nameKana: "セカイヘイワトウイツカテイレンゴウ",
      aliases: "統一教会,旧統一教会,世界基督教統一神霊協会",
      categoryId: catMap["religion"],
      description: "韓国発祥の宗教団体。高額献金や霊感商法が長年問題視されてきた。2022年に社会問題として再注目され、2023年に文部科学省が解散命令を東京地裁に請求。",
      founded: "1954年（日本法人1964年）",
    },
    {
      slug: "hounohana-sanpougyo",
      name: "法の華三法行",
      nameKana: "ホウノハナサンポウギョウ",
      aliases: "法の華,天声についてゆく",
      categoryId: catMap["religion"],
      description: "「足裏診断」で不安を煽り、高額な修行代金（最高1000万円以上）を支払わせた宗教団体。2000年に教祖の福永法源が詐欺罪で逮捕、懲役12年の判決。被害額約950億円。",
      representative: "福永法源",
      founded: "1987年",
    },

    // === オンラインサロン ===
    {
      slug: "ur-u-mds",
      name: "MDS（マデサイ）/ UR-U",
      nameKana: "エムディーエス,ユーアールユー",
      aliases: "竹花貴騎,MUPカレッジ,UR-U,マデサイ",
      categoryId: catMap["online-salon"],
      description: "実業家・竹花貴騎が運営するビジネススクール。Google日本法人元役員等の経歴を公称していたが、2020年にメディアの調査で経歴詐称が発覚し問題となった。",
      founded: "2019年頃",
    },

    // === 情報商材 ===
    {
      slug: "wonderland-smart-business",
      name: "株式会社ワンダーランド（スマートビジネス）",
      nameKana: "カブシキガイシャワンダーランド",
      aliases: "スマートビジネス,ワンダーランド",
      categoryId: catMap["info-products"],
      description: "「スマホで簡単に稼げる」と謳い高額な情報商材を販売。消費者庁が2020年に注意喚起。初期費用は低額だが、電話で高額プラン（最大200万円）を勧誘する手口。",
      founded: "2019年頃",
    },
    {
      slug: "kenji-online-academy",
      name: "KENJI Online Academy",
      nameKana: "ケンジオンラインアカデミー",
      aliases: "物販ビジネス,KENJI",
      categoryId: catMap["info-products"],
      description: "物販（転売）で稼げると謳うオンライン教材。消費者庁が2022年に注意喚起。「誰でも簡単に月収50万円」等の誇大な宣伝で高額なコンサル費用（50〜100万円）を請求。",
      founded: "2021年頃",
    },

    // === 副業・スクール ===
    {
      slug: "familly-affiliate",
      name: "ファミリーアフィリエイト",
      nameKana: "ファミリーアフィリエイト",
      aliases: "ファミリー",
      categoryId: catMap["side-job-school"],
      description: "アフィリエイトで高収入が得られると謳い、高額な入会金（数十万円）を徴収するスクール。「簡単に不労所得」等の誇大広告で集客。実際に稼げた受講生はごく少数とされる。国民生活センターに相談多数。",
      founded: "不明",
    },

    // === 美容・健康 ===
    {
      slug: "dna-slim",
      name: "株式会社DNAトータルクリエイション",
      nameKana: "カブシキガイシャディーエヌエートータルクリエイション",
      aliases: "DNAスリム,DNA",
      categoryId: catMap["beauty-health"],
      description: "遺伝子検査に基づくダイエットサプリ・食品の定期購入を展開。「解約できない」「電話がつながらない」等の苦情が国民生活センターに多数寄せられている。",
      founded: "不明",
    },
  ];

  for (const org of orgs) {
    await prisma.organization.upsert({
      where: { slug: org.slug },
      update: {},
      create: {
        ...org,
        status: "ACTIVE",
        approvalStatus: "APPROVED",
        submittedById: adminId,
      },
    });
    console.log(`✓ ${org.name}`);
  }

  console.log(`\n${orgs.length}件の組織を登録しました。`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
