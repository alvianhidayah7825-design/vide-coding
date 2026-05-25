import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from './db';
import { users } from './db/schema';

const app = new Elysia()
  .use(cors())
  .get('/status', () => ({ status: 'ok', database: 'connected' }))
  .get('/users', async () => {
    return await db.select().from(users);
  })
  .post('/users', async ({ body }) => {
    const { name, email } = body;
    const result = await db.insert(users).values({ name, email });
    return { id: result[0].insertId, name, email };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    })
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
