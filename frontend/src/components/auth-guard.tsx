'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(false);

    if (pathname === '/login') {
      setAllowed(true);
      return;
    }

    const hasSession = window.localStorage.getItem('recicla:user');

    if (!hasSession) {
      router.replace('/login');
      return;
    }

    setAllowed(true);
  }, [pathname, router]);

  if (!allowed) {
    return <div className="page-loading">Carregando...</div>;
  }

  return <>{children}</>;
}
