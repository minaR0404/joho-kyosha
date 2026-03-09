import crypto from "crypto";
import { prisma } from "./prisma";

export async function generateVerificationToken(userId: number) {
  await prisma.verificationToken.deleteMany({ where: { userId } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return prisma.verificationToken.create({
    data: { token, userId, expiresAt },
  });
}
