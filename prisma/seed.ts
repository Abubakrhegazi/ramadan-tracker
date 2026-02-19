// prisma/seed.ts
import { PrismaClient, Role, ResetRule } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.dailyLog.deleteMany();
  await prisma.lockedDay.deleteMany();
  await prisma.groupMembership.deleteMany();
  await prisma.groupSettings.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  // Create 5 demo users
  const users = await Promise.all([
    prisma.user.create({
      data: { email: "ahmed@demo.com", passwordHash, name: "أحمد محمد" },
    }),
    prisma.user.create({
      data: { email: "fatima@demo.com", passwordHash, name: "فاطمة علي" },
    }),
    prisma.user.create({
      data: { email: "omar@demo.com", passwordHash, name: "عمر حسن" },
    }),
    prisma.user.create({
      data: { email: "mariam@demo.com", passwordHash, name: "مريم خالد" },
    }),
    prisma.user.create({
      data: { email: "yusuf@demo.com", passwordHash, name: "يوسف إبراهيم" },
    }),
  ]);

  // Create demo group
  const group = await prisma.group.create({
    data: {
      name: "عائلة المسابقة الرمضانية",
      slug: "demo-family",
      inviteCode: "DEMO2024",
    },
  });

  // Create group settings (Ramadan 2025 start)
  await prisma.groupSettings.create({
    data: {
      groupId: group.id,
      ramadanStartDate: new Date("2025-03-01"),
      numDays: 30,
      timezone: "Africa/Cairo",
      resetRule: ResetRule.MIDNIGHT,
      editCutoffHour: 3,
      taraweehCap: 11,
      tahajjudCap: 11,
      quranPagesCap: 20,
    },
  });

  // Create memberships (first user is admin)
  await Promise.all(
    users.map((user, i) =>
      prisma.groupMembership.create({
        data: {
          userId: user.id,
          groupId: group.id,
          role: i === 0 ? Role.ADMIN : Role.MEMBER,
        },
      })
    )
  );

  // Create randomized logs for 7 days
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  for (const user of users) {
    for (let day = 1; day <= 7; day++) {
      // Some days might be empty (realistic)
      if (Math.random() > 0.1) {
        await prisma.dailyLog.create({
          data: {
            userId: user.id,
            groupId: group.id,
            dayNumber: day,
            taraweehRakaat: rand(8, 11),
            tahajjudRakaat: rand(0, 8),
            quranPages: rand(10, 20),
          },
        });
      }
    }
  }

  console.log("✅ Seed complete!");
  console.log("Demo credentials: ahmed@demo.com / password123");
  console.log("Group slug: demo-family, invite code: DEMO2024");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
