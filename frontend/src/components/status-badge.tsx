type StatusBadgeProps = {
  status: string;
};

const labels: Record<string, string> = {
  AVAILABLE: 'Disponível',
  RENTED: 'Alugada',
  ACTIVE: 'Ativo',
  FINISHED: 'Encerrado',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{labels[status] ?? status}</span>;
}
