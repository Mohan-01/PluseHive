import prisma from '../db/prisma';
import { hashPassword } from '../src/utils/hash';
import { runWithContext } from '../src/utils/requestContext';
import { v4 as uuidv4 } from 'uuid';
import { prewarmSystem } from '../src/utils/wrampus';

(async () => await prewarmSystem())();

async function createUsers() {
  const users = Array.from({ length: 50 }, (_, i) => ({
    email: `testuser${i}@test.com`,
    username: `User${i}`,
    password: '123456',
  }));

  for (const user of users) {
    try {
      const existing = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email: user.email,
            username: user.username,
            passwordHash: await hashPassword(user.password),
          },
        });
        console.log(`✅ Created: ${user.email}`);
      } else {
        console.log(`ℹ️  Already exists: ${user.email}`);
      }
    } catch (error) {
        console.error(error instanceof Error ? error : String(error));
    }
  }
}

runWithContext({ traceId: uuidv4(), method: 'SCRIPT', path: '/setup-users' }, async () => {
  try {
    await createUsers();
    process.exit(0);
  } catch (error) {
    console.error(error instanceof Error ? error : String(error));
    process.exit(1);
  }
});