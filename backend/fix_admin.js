const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAdmins() {
  try {
    console.log("Deleting all admins to clear any plain-text passwords...");
    await prisma.admin.deleteMany({});
    console.log("Successfully deleted all admins. You can now register again safely.");
  } catch (err) {
    console.error("Error clearing admins:", err);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdmins();
