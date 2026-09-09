'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="section wrap"><h1>No pudimos cargar el contenido.</h1><p>Intenta nuevamente en unos momentos.</p><button onClick={reset}>Volver a intentar</button></main>}
