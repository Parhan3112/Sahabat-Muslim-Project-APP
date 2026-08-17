import { buildApp } from '../src/app';

const app = buildApp();

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
};
