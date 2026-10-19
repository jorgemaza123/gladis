'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog } from '@base-ui/react/dialog';
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { searchServices, type ServiceSearchEntry } from '@/lib/service-search';
import { serviceGroupOrder } from '@/lib/service-groups';
import { useQuoteCart } from './quote-cart-provider';
import { useAttribution } from './attribution-provider';

type SearchHandle = ReturnType<typeof Dialog.createHandle>;
const ServiceSearchContext = createContext<SearchHandle | null>(null);

function SearchIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>;
}

export function ServiceSearchTrigger({ className = '', children }: { className?: string; children: ReactNode }) {
  const handle = useContext(ServiceSearchContext);
  if (!handle) return <Link className={className} href="/servicios">{children}</Link>;
  return <Dialog.Trigger handle={handle} className={`service-search-trigger ${className}`} type="button"><SearchIcon /><span className="service-search-trigger-label">{children}</span></Dialog.Trigger>;
}

export function ServiceSearchProvider({ entries, children }: { entries: ServiceSearchEntry[]; children: ReactNode }) {
  const [handle] = useState(() => Dialog.createHandle());
  const actions = useRef<Dialog.Root.Actions>(null);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const firstResult = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const id = useId();
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<string | null>(null);
  const [limit, setLimit] = useState(5);
  const [feedback, setFeedback] = useState('');
  const { cart, restored, add, dispatch } = useQuoteCart();
  const { recordCta } = useAttribution();
  const matches = searchServices(entries, query, family);
  const browsingFamilies = !query.trim() && !family;
  const families = serviceGroupOrder.flatMap((name) => {
    const count = entries.filter((entry) => entry.family === name).length;
    return count ? [{ name, count }] : [];
  });
  const close = () => actions.current?.close();

  useEffect(() => { actions.current?.close(); }, [pathname]);

  function showFamilies() {
    setFamily(null);
    setQuery('');
    setLimit(5);
    body.current?.scrollTo({ top: 0 });
    input.current?.focus();
  }

  function toggle(entry: ServiceSearchEntry) {
    const selected = cart.items.filter((item) => item.entryId === entry.id);
    if (selected.length) {
      selected.forEach((item) => dispatch({ type: 'remove', itemId: item.itemId }));
      setFeedback(`${entry.title} quitado de Mi evento.`);
    } else {
      add(entry.id);
      recordCta(entry.id, 'navigation');
      setFeedback(`${entry.title} añadido a Mi evento.`);
    }
  }

  return (
    <ServiceSearchContext.Provider value={handle}>
      {children}
      <Dialog.Root handle={handle} actionsRef={actions} modal onOpenChange={(open) => { if (!open) setFeedback(''); }}>
        <Dialog.Portal>
          <Dialog.Backdrop className="service-search-backdrop" />
          <Dialog.Viewport className="service-search-viewport" data-lenis-prevent>
            <Dialog.Popup className="service-search-dialog" initialFocus={(interaction) => interaction === 'touch' ? true : input.current}>
              <div className="service-search-heading">
                <div>
                  <Dialog.Title>Encuentra lo que necesita tu evento</Dialog.Title>
                  <Dialog.Description>Busca entre nuestros {entries.length} servicios o explora una familia.</Dialog.Description>
                </div>
                <Dialog.Close className="service-search-close" aria-label="Cerrar buscador de servicios">×</Dialog.Close>
              </div>
              <search>
              <form className="service-search-form" onSubmit={(event) => { event.preventDefault(); firstResult.current?.focus(); }}>
                <label htmlFor={`${id}-query`}>¿Qué servicio necesitas?</label>
                <div className="service-search-input">
                  <SearchIcon />
                  <input ref={input} id={`${id}-query`} type="search" autoComplete="off" enterKeyHint="search" maxLength={120} placeholder="DJ, sillas, decoración, vajilla…" value={query} aria-controls={`${id}-results`} onChange={(event) => { setQuery(event.target.value); setFamily(null); setLimit(5); setFeedback(''); body.current?.scrollTo({ top: 0 }); }} />
                  {query && <button type="button" onClick={showFamilies} aria-label="Limpiar búsqueda">Limpiar</button>}
                </div>
              </form>
              </search>
              <div ref={body} className="service-search-body" id={`${id}-results`}>
                {browsingFamilies ? (
                  <div className="service-search-families" aria-label="Familias de servicios">
                    {families.map(({ name, count }) => (
                      <button key={name} type="button" onClick={() => { setFamily(name); setLimit(5); }}>
                        <strong>{name === 'Soluciones para empresas' ? 'Empresas' : name === 'Personal para eventos' ? 'Personal' : name}</strong>
                        <span>{count} {count === 1 ? 'servicio' : 'servicios'}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="service-search-results-heading">
                      <output>{family ? `${family} · ` : ''}{matches.length} {matches.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}</output>
                      <button type="button" onClick={showFamilies}>Ver familias</button>
                    </div>
                    {matches.length ? (
                      <>
                        <ul className="service-search-results">
                          {matches.slice(0, limit).map((entry, index) => {
                            const selected = cart.items.some((item) => item.entryId === entry.id);
                            return (
                              <li key={entry.id} data-selected={selected}>
                                <div>
                                  <Link className="service-search-result-name" href={entry.href} ref={index === 0 ? firstResult : undefined} onClick={close} aria-label={`Ver detalles de ${entry.title}`}>{entry.title}</Link>
                                  <p>{entry.family}</p>
                                </div>
                                <div className="service-search-result-actions">
                                  <button type="button" disabled={!restored} aria-pressed={selected} aria-label={`${selected ? 'Quitar' : 'Añadir'} ${entry.title} ${selected ? 'de' : 'a'} Mi evento`} onClick={() => toggle(entry)}>{selected ? 'Añadido ✓' : 'Añadir +'}</button>
                                  <Link href={`/cotizar?seleccion=${encodeURIComponent(entry.id)}`} className="service-search-quote" aria-label={`Cotizar ${entry.title}`} onClick={() => { add(entry.id); recordCta(entry.id, 'navigation'); close(); }}>Cotizar <span aria-hidden="true">↗</span></Link>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        {matches.length > limit && <button className="service-search-more" type="button" onClick={() => setLimit((current) => current + 5)}>Ver más resultados ({matches.length - limit})</button>}
                      </>
                    ) : <p className="service-search-empty">No encontramos ese término. Prueba con otro nombre o explora las familias. También puedes pedirnos orientación.</p>}
                  </>
                )}
              </div>
              <div className="service-search-footer">
                <output aria-atomic="true">{feedback || (cart.items.length ? `${cart.items.length} ${cart.items.length === 1 ? 'servicio elegido' : 'servicios elegidos'} en Mi evento.` : 'Puedes contratar un servicio o combinar varios.')}</output>
                <div>
                  {cart.items.length > 0 && <Link className="service-search-quote" href="/cotizar" onClick={close}>Revisar mi selección ({cart.items.length})</Link>}
                  <Link href="/servicios" onClick={close}>Ver catálogo completo</Link>
                  <Link href="/cotizar#consulta-inicial" onClick={close}>Necesito orientación</Link>
                </div>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </ServiceSearchContext.Provider>
  );
}
