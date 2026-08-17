import { buildApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

const app = buildApp();

async function startServer() {
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`🚀 Sahabat Muslim API Server running at http://${env.HOST}:${env.PORT}`);
    console.log(`🏥 Health Check endpoint available at http://${env.HOST}:${env.PORT}/api/v1/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Graceful Shutdown
const shutdown = async () => {
  console.log('Shutting down server gracefully...');
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
