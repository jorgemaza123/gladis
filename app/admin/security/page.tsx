import { getAdmin } from '@/lib/auth';
import { SecurityPanel } from '@/components/security-panel';
export const metadata = {
  title: 'Usuarios y seguridad',
  robots: { index: false, follow: false },
};
export default async function SecurityPage() {
  const actor = await getAdmin();
  if (actor?.role !== 'owner')
    return (
      <main className="login">
        <h1>Acceso restringido</h1>
        <p>Esta sección requiere una cuenta de propietario.</p>
        <a className="text-link" href="/admin">
          Volver al panel
        </a>
      </main>
    );
  return <SecurityPanel actorId={actor.id} />;
}
