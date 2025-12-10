import { request } from 'playwright';
import { config } from '../config/config';

export async function apiLogin(username: string, password: string) {
  const ctx = await request.newContext({ baseURL: config.baseUrl });
  const resp = await ctx.post('/api/login', { data: { username, password } });
  const body = await resp.json().catch(() => null);
  await ctx.dispose();
  return { status: resp.status(), body };
}
