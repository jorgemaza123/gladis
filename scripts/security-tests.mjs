// Runs real route handlers against an isolated in-memory SQLite database.
// No local application DB, credentials or HTTP service are read or modified.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
const sql = new DatabaseSync(':memory:');
sql.exec(`CREATE TABLE admin_users(id TEXT PRIMARY KEY,username TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1,created_at INTEGER NOT NULL);
CREATE TABLE admin_sessions(id TEXT PRIMARY KEY,token_hash TEXT NOT NULL UNIQUE,user_id TEXT NOT NULL,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,user_agent TEXT NOT NULL);
CREATE TABLE admin_login_limits(id TEXT PRIMARY KEY,attempts INTEGER NOT NULL,reset_at INTEGER NOT NULL);
CREATE TABLE admin_audit(id TEXT PRIMARY KEY,actor_id TEXT NOT NULL,actor_name TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL,created_at INTEGER NOT NULL);`);
const prepare = (query) => {
  let values = [];
  return {
    bind(...v) {
      values = v;
      return this;
    },
    async first() {
      return sql.prepare(query).get(...values) || null;
    },
    async all() {
      return { results: sql.prepare(query).all(...values) };
    },
    async run() {
      return { meta: sql.prepare(query).run(...values) };
    },
  };
};
globalThis.__securityEnv = {
  ADMIN_PASSWORD: 'test-owner-passphrase-only-for-unit-tests-123',
  DB: {
    prepare,
    async batch(statements) {
      sql.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        sql.exec('COMMIT');
        return results;
      } catch (error) {
        sql.exec('ROLLBACK');
        throw error;
      }
    },
  },
};
let cookie = '';
globalThis.__securityCookies = async () => ({
  get: () => (cookie ? { value: cookie } : undefined),
});
let authUrl = '';
async function moduleUrl(path) {
  let source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  source = source
    .replace(
      /import \{ env \} from 'cloudflare:workers';/g,
      'const env = globalThis.__securityEnv;',
    )
    .replace(
      /import \{ cookies \} from 'next\/headers';/g,
      'const cookies = globalThis.__securityCookies;',
    );
  if (authUrl)
    source = source.replaceAll("'@/lib/auth'", JSON.stringify(authUrl));
  return (
    'data:text/javascript;base64,' +
    Buffer.from(
      ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    ).toString('base64')
  );
}
authUrl = await moduleUrl('lib/auth.ts');
const auth = await import(authUrl);
const session = await import(await moduleUrl('app/api/session/route.ts'));
const users = await import(await moduleUrl('app/api/admin/users/route.ts'));
const sessions = await import(
  await moduleUrl('app/api/admin/sessions/route.ts')
);
const audit = await import(await moduleUrl('app/api/admin/audit/route.ts'));
function request(path, method, body, origin = 'http://localhost:3000') {
  return new Request(`http://localhost:3000/api/${path}`, {
    method,
    headers: {
      origin,
      'content-type': 'application/json',
      'cf-connecting-ip': '127.0.0.1',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
const login = (body) => session.POST(request('session', 'POST', body));
function setTestCookie(response) {
  cookie =
    response.headers.get('set-cookie')?.match(/cms_session=([^;]+)/)?.[1] || '';
}
const password = globalThis.__securityEnv.ADMIN_PASSWORD;
assert.equal((await login({ password: 'wrong' })).status, 401);
assert.equal(
  sql.prepare('SELECT count(*) AS n FROM admin_users').get().n,
  0,
  'wrong bootstrap must never create owner',
);
assert.equal(
  (
    await session.POST(
      request('session', 'POST', { password }, 'https://evil.test'),
    )
  ).status,
  403,
);
let response = await login({ password });
assert.equal(response.status, 204);
setTestCookie(response);
const originalCookie = cookie;
assert.ok(
  response.headers.get('set-cookie').includes('HttpOnly; SameSite=Strict'),
);
assert.equal((await auth.getAdmin()).role, 'owner');
assert.equal(await auth.isAdmin(), true);
assert.notEqual(
  sql.prepare('SELECT token_hash FROM admin_sessions').get().token_hash,
  cookie,
  'DB stores only hash',
);
response = await login({ password });
assert.equal(response.status, 204);
setTestCookie(response);
assert.notEqual(cookie, originalCookie, 'sessions random per login');
const owner = await auth.getAdmin();
assert.equal(
  (
    await users.POST(
      request('admin/users', 'POST', {
        username: 'editor',
        password: 'a-long-editor-password',
        role: 'editor',
      }),
    )
  ).status,
  201,
);
assert.equal(
  (
    await users.POST(
      request('admin/users', 'POST', {
        username: 'viewer',
        password: 'a-long-viewer-password',
        role: 'viewer',
      }),
    )
  ).status,
  201,
);
assert.equal(
  (
    await users.PATCH(
      request('admin/users', 'PATCH', {
        id: owner.id,
        action: 'active',
        active: false,
      }),
    )
  ).status,
  409,
  'cannot disable self',
);
const list = await (await users.GET()).json();
assert.ok(!JSON.stringify(list).includes('password_hash'));
const ownerCookie = cookie;
response = await login({
  username: 'viewer',
  password: 'a-long-viewer-password',
});
setTestCookie(response);
assert.equal(await auth.isAdmin(), false);
assert.equal((await auth.getAdmin()).role, 'viewer');
assert.equal((await users.GET()).status, 403);
assert.equal((await audit.GET()).status, 403);
assert.equal((await sessions.GET()).status, 403);
response = await login({
  username: 'editor',
  password: 'a-long-editor-password',
});
setTestCookie(response);
assert.equal(await auth.isAdmin(), true);
assert.equal(
  (
    await users.POST(
      request('admin/users', 'POST', {
        username: 'hack',
        password: 'a-long-editor-password',
        role: 'owner',
      }),
    )
  ).status,
  403,
);
const editorCookie = cookie;
cookie = ownerCookie;
const editor = sql
  .prepare("SELECT id FROM admin_users WHERE username='editor'")
  .get();
assert.equal(
  (
    await users.PATCH(
      request('admin/users', 'PATCH', {
        id: editor.id,
        action: 'password',
        password: 'a-new-editor-password',
      }),
    )
  ).status,
  200,
);
cookie = editorCookie;
assert.equal(await auth.getAdmin(), null, 'reset revokes every session');
cookie = ownerCookie;
const editorLogin = await login({
  username: 'editor',
  password: 'a-new-editor-password',
});
assert.equal(editorLogin.status, 204);
setTestCookie(editorLogin);
const newEditorCookie = cookie;
cookie = ownerCookie;
assert.equal(
  (
    await users.PATCH(
      request('admin/users', 'PATCH', {
        id: editor.id,
        action: 'active',
        active: false,
      }),
    )
  ).status,
  200,
);
cookie = newEditorCookie;
assert.equal(await auth.getAdmin(), null, 'disabled account sessions revoked');
cookie = ownerCookie;
const sessionList = await (await sessions.GET()).json();
assert.ok(!JSON.stringify(sessionList).includes('token_hash'));
const current = sessionList.sessions.find((s) => s.current);
assert.equal(
  (
    await sessions.DELETE(
      request('admin/sessions', 'DELETE', { id: current.id }),
    )
  ).status,
  200,
);
assert.equal(
  await auth.getAdmin(),
  null,
  'revocation invalidates current token',
);
response = await login({ password });
setTestCookie(response);
await session.DELETE(request('session', 'DELETE'));
assert.equal(await auth.getAdmin(), null, 'logout invalidates server session');
response = await login({ password });
setTestCookie(response);
sql.prepare('UPDATE admin_sessions SET expires_at=0').run();
assert.equal(await auth.getAdmin(), null, 'expired session rejected');
for (let i = 0; i < 10; i++)
  await login({ username: 'unknown-user', password: 'invalid' });
assert.equal(
  (await login({ username: 'unknown-user', password: 'invalid' })).status,
  429,
  'persistent account throttle',
);
assert.equal(
  await auth
    .boundedJson(request('session', 'POST', { data: 'x'.repeat(5000) }))
    .catch(() => null),
  null,
  'body bounded without content-length',
);
console.log(
  'PASS: bootstrap, origins, password hashing, random/hashed sessions, role authorization, password reset, disable, revocation, logout, expiry, persistent throttle and bounded input.',
);
sql.close();
