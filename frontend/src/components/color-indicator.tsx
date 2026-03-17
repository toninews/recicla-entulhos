'use client';

type ColorIndicatorProps = {
  colorName: string;
};

const colorMap: Record<string, string> = {
  azul: '#2f6fb8',
  amarela: '#d4a017',
  amarelo: '#d4a017',
  bege: '#c8b48a',
  branca: '#f3f3f3',
  branco: '#f3f3f3',
  cinza: '#8a9099',
  laranja: '#d97a21',
  marrom: '#7a5230',
  preta: '#2f3136',
  preto: '#2f3136',
  roxa: '#7251a2',
  roxo: '#7251a2',
  rosa: '#d76b9f',
  verde: '#4f8f5d',
  vermelha: '#bf4a57',
  vermelho: '#bf4a57',
};

function resolveColor(colorName: string) {
  const normalized = colorName.trim().toLowerCase();
  return colorMap[normalized] ?? '#8a9099';
}

export function ColorIndicator({ colorName }: ColorIndicatorProps) {
  return (
    <span className="color-indicator">
      <span
        className="color-indicator-dot"
        style={{ backgroundColor: resolveColor(colorName) }}
        aria-hidden="true"
      />
      <span>{colorName}</span>
    </span>
  );
}
