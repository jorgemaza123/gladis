import { homeServiceNav } from '@/data/home-service-scenes';

const serviceIcons = [
  <>
    <circle cx="12" cy="12" r="6.5" />
    <path d="M2.5 8v8m3-8v8M4 16v5M21 3v18m-2.5-18c-2.5 3-2.5 6.5 0 9H21" />
  </>,
  <>
    <path d="M3 4h18l-9 9-9-9Zm9 9v7m-4 1h8M17 3l3-2" />
    <circle cx="8" cy="7" r="1" />
  </>,
  <>
    <path d="M3 16h18M5 16l1.5-6h11L19 16M7 7c3 1.5 7 1.5 10 0M8 20h8" />
    <path d="M5 16c0 2 3 3 7 3s7-1 7-3" />
  </>,
  <>
    <circle cx="8" cy="5" r="2" />
    <path d="M8 7.5v7M4.5 13h7M6 14.5 4 21m4-6 2 6M15 11h6v6h-6zM16 17v4m4-4v4" />
  </>,
  <>
    <path d="M3 10h18v11H3zM12 10v11M2 7h20v3H2zM12 7c-2-4-6-5-7-2s2 3 7 2Zm0 0c2-4 6-5 7-2s-2 3-7 2Z" />
  </>,
  <>
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 9c-3-5-6-5-6-2 0 2 2 4 4 4M15 11c5-3 5-6 2-6-2 0-4 2-4 4m-1 6c3 5 6 5 6 2 0-2-2-4-4-4m-5 0c-5 3-5 6-2 6 2 0 4-2 4-4m1 0v7" />
  </>,
] as const;

export function HomeServiceNav() {
  return (
    <nav
      className="home-service-nav"
      aria-label="Ir a una solución para tu evento"
      data-reveal="aurora-nav"
    >
      <div className="wrap">
        <h2>¿Qué necesitas para tu evento?</h2>
        <ul>
          {homeServiceNav.map((item, index) => (
            <li key={item.label}>
              <a href={item.href}>
                <span className="home-service-nav-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {serviceIcons[index]}
                  </svg>
                </span>
                <span className="home-service-nav-label">{item.label}</span>
                <svg className="home-service-nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="home-service-nav-mist" aria-hidden="true">
        <span className="home-service-nav-mist-light home-service-nav-mist-light--lavender" />
        <span className="home-service-nav-mist-light home-service-nav-mist-light--rose" />
      </div>
    </nav>
  );
}
