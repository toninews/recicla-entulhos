import Link from 'next/link';

type LogoProps = {
  href?: string;
};

export function Logo({ href }: LogoProps) {
  const content = (
    <div className="logo-block">
      <div className="logo-icon" aria-hidden="true">
        <span className="logo-lid" />
        <span className="logo-body" />
        <span className="logo-stripe logo-stripe-left" />
        <span className="logo-stripe logo-stripe-right" />
      </div>
      <div className="logo-text">
        <span className="logo-recicla">RECICLA</span>
        <span className="logo-entulhos"> ENTULHOS</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link className="logo-link" href={href} aria-label="Ir para caçambas">
        {content}
      </Link>
    );
  }

  return content;
}
