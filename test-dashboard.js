require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['info'],
});

async function main() {
  const email = "admin@example.com";
  console.log(`Testing dashboard logic for ${email} (JS CJS)...`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      subscription: true,
      scores: {
        orderBy: { date: 'desc' },
        take: 5
      },
      charitySelect: {
        include: { charity: true }
      },
      winnings: true
    }
  });

  if (!user) {
    console.error("User not found!");
    return;
  }

  console.log("User found:", user.id);
  console.log("Subscription:", user.subscription);
  console.log("Scores:", user.scores);
  console.log("Charity:", user.charitySelect);
  console.log("Winnings:", user.winnings);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });