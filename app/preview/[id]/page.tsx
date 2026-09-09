import { notFound, redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { readSite } from '@/repositories/site';
import { Shell, EntryDetail } from '@/components/public';
export const metadata = {
  title: 'Vista previa privada',
  robots: { index: false, follow: false },
};
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getAdmin())) redirect('/admin');
  const { id } = await params;
  const site = await readSite(),
    entry = site.entries.find((e) => e.id === id);
  if (!entry) notFound();
  return (
    <Shell site={site}>
      <div className="preview-bar">
        Vista previa privada del contenido guardado · {entry.status}
        <a href="/admin">Volver al panel</a>
      </div>
      <EntryDetail site={site} entry={entry} />
    </Shell>
  );
}
