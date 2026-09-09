import { getAdmin } from '@/lib/auth';
import { readSite } from '@/repositories/site';
import { Admin, Login } from '@/components/admin';
export const metadata = {
  title: 'Administración de contenido',
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  const actor = await getAdmin();
  return actor ? (
    <Admin initial={await readSite()} role={actor.role} />
  ) : (
    <Login />
  );
}
