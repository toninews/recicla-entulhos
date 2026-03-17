'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Logo } from './logo';

const links = [
  { href: '/cacambas', label: 'Caçambas' },
  { href: '/alugueis', label: 'Aluguéis' },
  { href: '/historico', label: 'Histórico' },
];

type AppShellProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function AppShell({ children, title, description }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    window.localStorage.removeItem('recicla:user');
    router.replace('/login');
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Logo />
        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button className="secondary-button logout-button" onClick={handleLogout} type="button">
          Sair
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="page-header">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
