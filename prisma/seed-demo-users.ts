import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoUsers = [
  // 体験・注意喚起系（15名）
  "被害者の声", "元会員A", "匿名希望", "注意喚起", "経験者K",
  "脱会済み", "友人が被害に", "騙された人", "目が覚めた人", "消費者センター相談済",
  "二度と騙されない", "内部告発者", "元勧誘員", "情報共有したい", "調べてから判断",
  // 普通のニックネーム（15名）
  "たかし", "ゆうき", "さくら", "はるか", "けんた",
  "みさき", "りょう", "あやね", "こうた", "まい",
  "そうた", "ひなた", "れん", "ももか", "だいき",
  // アルファベット系（10名）
  "takuya_77", "mikan_sun", "hiro2025", "yuki_note", "ken_review",
  "sora_sky", "nao_daily", "riku_log", "emi_chan", "kazu_real",
  // ネタ系（10名）
  "ねこ好きすぎる人", "とうふメンタル", "社畜の叫び", "課金は計画的に", "推しが尊い",
  "コーヒーは命の水", "布団から出たくない", "ガチャ運ゼロ", "永遠のダイエッター", "Wi-Fiの妖精",
];

async function main() {
  const hashedPassword = await bcrypt.hash("demo-user-password", 10);

  const users = [];
  for (let i = 0; i < demoUsers.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `demo-user-${i + 1}@joho-kyosha.internal`,
        displayName: demoUsers[i],
        hashedPassword,
        provider: "credentials",
        emailVerifiedAt: new Date(),
      },
    });
    users.push(user);
  }

  console.log(`${users.length} demo users created!`);
  console.log("User IDs:", users[0].id, "-", users[users.length - 1].id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
