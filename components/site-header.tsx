'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { navigationSectionForPath, type HeaderSection } from '@/lib/service-navigation';
import { observeHomeArrival } from '@/lib/home-arrival';

type Family = { id: string; label: string; count: number };

function Chevron() {
  return <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>;
}

export function SiteHeader({ brand, search, cart, quote, families }: {
  brand: ReactNode;
  search: ReactNode;
  cart: ReactNode;
  quote: ReactNode;
  families: Family[];
}) {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [homeSection, setHomeSection] = useState<HeaderSection>('');
  const active = isHome ? homeSection : navigationSectionForPath(pathname);
  const homeHref = (id: string) => isHome ? `#${id}` : `/#${id}`;

  useEffect(() => {
    const header = root.current;
    if (!isHome || !header) return;
    return observeHomeArrival(header, header.closest<HTMLElement>('.public-site')?.dataset.motion === 'on');
  }, [isHome]);

  function closeMenus() {
    root.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((menu) => { menu.open = false; });
  }

  function follow(event: MouseEvent<HTMLAnchorElement>, familyId?: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    closeMenus();
    if (isHome && familyId) {
      const family = document.getElementById(familyId);
      if (family instanceof HTMLDetailsElement) family.open = true;
    }
  }

  useEffect(() => {
    const header = root.current;
    if (!header) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.contains(event.target)) closeMenus();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !(event.target instanceof Element)) return;
      const menu = event.target.closest<HTMLDetailsElement>('details[open]');
      if (!menu) return;
      event.preventDefault();
      event.stopPropagation();
      menu.open = false;
      menu.querySelector('summary')?.focus();
    };
    const leave = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node)) return;
      const next = event.relatedTarget;
      header.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((menu) => { if (!menu.contains(next)) menu.open = false; });
    };
    const dialog = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('[aria-haspopup="dialog"]')) closeMenus();
    };
    document.addEventListener('pointerdown', outside);
    header.addEventListener('keydown', escape);
    header.addEventListener('focusout', leave);
    header.addEventListener('click', dialog, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      header.removeEventListener('keydown', escape);
      header.removeEventListener('focusout', leave);
      header.removeEventListener('click', dialog, true);
    };
  }, []);

  useEffect(() => {
    closeMenus();
    if (!isHome) return;
    let observer: IntersectionObserver | undefined;
    const ids = ['servicios', 'completa-tu-evento', 'ocasiones', 'company-gateway-title', 'como-cotizar'];
    const start = () => {
      observer?.disconnect();
      const sections = ids.flatMap((id) => {
        const element = document.getElementById(id);
        return element ? [{ id, element: id === 'company-gateway-title' ? element.closest('section') || element : element }] : [];
      });
      const headerHeight = Math.ceil(root.current?.getBoundingClientRect().height || 64);
      const line = Math.max(headerHeight + 16, window.innerHeight * .35);
      const update = () => {
        const current = sections.filter(({ element }) => element.getBoundingClientRect().top <= line + 1).at(-1)?.id;
        setHomeSection(current === 'completa-tu-evento' ? 'servicios' : current === 'company-gateway-title' ? 'empresas' : (current || '') as HeaderSection);
      };
      update();
      if (!('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(update, {
        rootMargin: `-${headerHeight}px 0px -${Math.max(0, window.innerHeight - line)}px 0px`,
        threshold: 0,
      });
      sections.forEach(({ element }) => observer?.observe(element));
    };
    start();
    window.addEventListener('resize', start);
    return () => { observer?.disconnect(); window.removeEventListener('resize', start); };
  }, [isHome, pathname]);

  const familyLinks = (
    <div className="header-family-panel" data-lenis-prevent>
      <div className="header-family-links">
        {families.map((family) => <a key={family.id} href={homeHref(family.id)} onClick={(event) => follow(event, family.id)}><span>{family.label}</span><span className="header-family-count">{family.count}</span></a>)}
      </div>
      <div className="header-family-footer">
        <a href={homeHref('servicios')} onClick={(event) => follow(event)}>Ver cómo armamos tu evento <span aria-hidden="true">→</span></a>
        <Link href="/servicios" onClick={(event) => follow(event)}>Ver todos los servicios <span aria-hidden="true">→</span></Link>
        <Link className="header-desktop-guides" href="/guias" onClick={(event) => follow(event)}>Guías para organizar tu evento <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );

  const primaryLinks = <>
    <a href={homeHref('ocasiones')} aria-current={active === 'ocasiones' ? 'location' : undefined} onClick={(event) => follow(event)}>Ocasiones</a>
    <Link href="/empresas" aria-current={active === 'empresas' ? (isHome ? 'location' : 'page') : undefined} onClick={(event) => follow(event)}>Empresas</Link>
    <a href={homeHref('como-cotizar')} aria-current={active === 'como-cotizar' ? 'location' : undefined} onClick={(event) => follow(event)}>Cómo cotizar</a>
  </>;

  return <>
    <header ref={root} className="header site-header">
      <div className="site-header-inner">
        {brand}
        <nav className="desktop-nav header-primary-nav" aria-label="Navegación principal">
          <details className="header-services-menu">
            <summary aria-current={active === 'servicios' ? 'location' : undefined}>Servicios <Chevron /></summary>
            {familyLinks}
          </details>
          {primaryLinks}
        </nav>
        <div className="header-actions">
          {search}
          {cart}
          <div className="header-primary-quote">{quote}</div>
        </div>
        <details className="mobile-menu header-mobile-menu">
          <summary aria-label="Menú principal"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></summary>
          <nav className="header-mobile-panel" aria-label="Navegación móvil" data-lenis-prevent>
            <details className="header-services-menu">
              <summary aria-current={active === 'servicios' ? 'location' : undefined}>Servicios <Chevron /></summary>
              {familyLinks}
            </details>
            {primaryLinks}
            <div className="header-mobile-quote">{quote}</div>
            <div className="header-secondary-links">
              <Link href="/guias" onClick={(event) => follow(event)}>Guías para organizar tu evento</Link>
              <Link href="/paginas/nosotros" onClick={(event) => follow(event)}>Conoce a Gladys</Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
    <div className="site-header-spacer" aria-hidden="true" />
  </>;
}
