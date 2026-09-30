export const metadata = {
  title: 'Administración no disponible',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="section wrap">
      <h1>Administración no disponible</h1>
      <p>Esta versión no usa base de datos. El contenido se edita en los archivos del proyecto.</p>
      <a className="text-link" href="/">Volver al inicio</a>
    </main>
  );
}
