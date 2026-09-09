import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (!existsSync('.dev.vars'))
  writeFileSync(
    '.dev.vars',
    `ADMIN_PASSWORD="${randomBytes(32).toString('hex')}"\n`,
    { mode: 0o600 },
  );
console.log(
  'Clave local disponible en .dev.vars. Este archivo es privado y no se sube a Git.',
);
