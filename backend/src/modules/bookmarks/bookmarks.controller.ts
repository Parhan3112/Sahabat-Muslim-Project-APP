import { FastifyReply, FastifyRequest } from 'fastify';
import { createBookmarkSchema } from './bookmarks.schema.js';
import { createBookmark, deleteBookmark, getUserBookmarks } from './bookmarks.service.js';

export async function getUserBookmarksHandler(request: FastifyRequest, reply: FastifyReply) {
  const bookmarks = await getUserBookmarks(request.user.id);
  return reply.status(200).send({
    success: true,
    message: 'Daftar bookmark berhasil diambil',
    data: bookmarks,
  });
}

export async function createBookmarkHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = createBookmarkSchema.parse(request.body);
  const bookmark = await createBookmark(request.user.id, body);

  return reply.status(201).send({
    success: true,
    message: 'Ayat berhasil ditambahkan ke bookmark',
    data: bookmark,
  });
}

export async function deleteBookmarkHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const result = await deleteBookmark(request.user.id, request.params.id);

  return reply.status(200).send({
    success: true,
    message: 'Bookmark berhasil dihapus',
    data: result,
  });
}
