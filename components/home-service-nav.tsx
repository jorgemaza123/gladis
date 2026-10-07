import { homeServiceNav } from '@/data/home-service-scenes';

export function HomeServiceNav() {
  return (
    <nav className="home-service-nav" aria-label="Ir a una solución para tu evento">
      <div className="wrap">
        <p>¿Qué necesitas para tu evento?</p>
        <ul>
          {homeServiceNav.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
