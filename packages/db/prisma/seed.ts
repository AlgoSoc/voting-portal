import { PrismaClient } from '@prisma/client';
import { getMemberStudentIds } from '../src/scraper';
const prisma = new PrismaClient();

function generateUniquePin(existingPins: Set<string>): string {
  let pin: string;
  do {
    pin = Math.floor(10000 + Math.random() * 90000).toString(); // Random 5-digit number
  } while (existingPins.has(pin));
  existingPins.add(pin);
  return pin;
}

async function seed() {
  try {
    const members = await getMemberStudentIds();

    const existingPins = new Set<string>();
    const userData = members.map((member) => ({
      pin: generateUniquePin(existingPins),
      firstName: member.firstName,
      lastName: member.lastName,
      studentId: member.studentId,
      isAdmin: false,
    }));

    // Seed users
    for (const user of userData) {
      await prisma.user.upsert({
        where: { studentId: user.studentId },
        update: {},
        create: user,
      });
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
