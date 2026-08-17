import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwtPlugin from './plugins/jwt.plugin.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import { healthRoutes } from './modules/health/health.route.js';
import { authRoutes } from './modules/auth/auth.route.js';
import { usersRoutes } from './modules/users/users.route.js';
import { quranRoutes } from './modules/quran/quran.route.js';
import { prayerTimesRoutes } from './modules/prayer-times/prayer-times.route.js';
import { qiblaRoutes } from './modules/qibla/qibla.route.js';
import { bookmarksRoutes } from './modules/bookmarks/bookmarks.route.js';
import { readingProgressRoutes } from './modules/reading-progress/reading-progress.route.js';
import { notificationsRoutes } from './modules/notifications/notifications.route.js';
import { settingsRoutes } from './modules/settings/settings.route.js';
import { mosquesRoutes } from './modules/mosques/mosques.route.js';
import { dzikirRoutes } from './modules/dzikir/dzikir.route.js';

export function buildApp() {
  const app = Fastify({
    logger: false,
  });

  // Global Error Handler
  app.setErrorHandler(globalErrorHandler);

  // Register Plugins (CORS & JWT)
  app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  app.register(jwtPlugin);

  // Register REST API Routes (Prefix /api/v1)
  app.register(healthRoutes, { prefix: '/api/v1/health' });
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(usersRoutes, { prefix: '/api/v1/users' });
  app.register(quranRoutes, { prefix: '/api/v1/quran' });
  app.register(prayerTimesRoutes, { prefix: '/api/v1/prayer-times' });
  app.register(qiblaRoutes, { prefix: '/api/v1/qibla' });
  app.register(bookmarksRoutes, { prefix: '/api/v1/bookmarks' });
  app.register(readingProgressRoutes, { prefix: '/api/v1/reading-progress' });
  app.register(notificationsRoutes, { prefix: '/api/v1/notifications' });
  app.register(settingsRoutes, { prefix: '/api/v1/settings' });
  app.register(mosquesRoutes, { prefix: '/api/v1/mosques' });
  app.register(dzikirRoutes, { prefix: '/api/v1/dzikir' });

  return app;
}
