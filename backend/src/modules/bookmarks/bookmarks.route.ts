import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { createBookmarkHandler, deleteBookmarkHandler, getUserBookmarksHandler } from './bookmarks.controller.js';

export async function bookmarksRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', getUserBookmarksHandler);
  fastify.post('/', createBookmarkHandler);
  fastify.delete('/:id', deleteBookmarkHandler);
}
