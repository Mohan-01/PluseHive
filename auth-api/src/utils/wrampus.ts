import prisma from "../../db/prisma";

export async function prewarmSystem() {
  console.time('🔥 Prewarm: DB query');
  await prisma.user.findFirst(); // triggers pool + warms index cache
  console.timeEnd('🔥 Prewarm: DB query');
}
