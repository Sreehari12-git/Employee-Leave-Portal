import prisma from "./lib/prisma/prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  const admin = await prisma.user.upsert({
    where: { email: "skp@gmail.com" },
    update: { password: hashedPassword },
    create: {
      email: "skp@gmail.com",
      username: "Sreehari",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin seeded:", admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });