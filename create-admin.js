require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  const email = 'admin@example.com';
  const password = 'admin'; // Plain text for now as per your auth setup
  
  console.log(`Creating admin user: ${email}...`);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      passwordHash: password,
    },
    create: {
      email,
      name: 'System Admin',
      passwordHash: password,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created/updated successfully.');
  console.log({
    id: user.id,
    email: user.email,
    role: user.role
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
