import { PrismaClient } from '@prisma/client';

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/sahabat_muslim?schema=public';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (_error) {
    return false;
  }
}
