import { buildApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

const app = buildApp();

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen({ port: env.PORT, host: env.HOST }).then(() => {
    console.log(`🚀 Sahabat Muslim API Server running at http://${env.HOST}:${env.PORT}`);
  }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
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

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
};
