'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { rentalsService } from '@/services/rentals';
import { Rental } from '@/types';

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  return value;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);

      try {
        const data = await rentalsService.history();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar o histórico.');
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, []);

  return (
    <AppShell
      title="Histórico de aluguéis"
      description="Consulte todas as locações já registradas no sistema."
    >
      <section className="table-panel">
        <h2>Locações registradas</h2>

        {error ? <p className="feedback-text error">{error}</p> : null}

        {loading ? (
          <p className="helper-text">Carregando histórico...</p>
        ) : history.length === 0 ? (
          <EmptyState
            title="Histórico vazio"
            description="Os aluguéis finalizados e ativos aparecerão aqui automaticamente."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Caçamba</th>
                <th>Datas</th>
                <th>Endereço</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
                {history.map((rental) => (
                  <tr key={rental.id}>
                  <td data-label="Cliente">
                    <strong>{rental.customerName}</strong>
                    <br />
                    {formatPhone(rental.customerPhone)}
                  </td>
                  <td data-label="Caçamba">
                    <Link
                      className="table-link"
                      href={`/historico/${rental.dumpsterId}`}
                      title={`Clique para ver o histórico da caçamba ${rental.dumpster.serialNumber}`}
                    >
                      {rental.dumpster.serialNumber}
                    </Link>
                  </td>
                  <td data-label="Datas">
                    <strong>
                      Iniciado em {formatDateTime(rental.startDate)}
                    </strong>
                    <br />
                    {rental.endDate ? (
                      <>
                        Previsto para {formatDateTime(rental.endDate)}
                        <br />
                      </>
                    ) : null}
                    {rental.finishedAt ? (
                      <>Encerrado em {formatDateTime(rental.finishedAt)}</>
                    ) : (
                      'Em andamento'
                    )}
                  </td>
                  <td data-label="Endereço">
                    {rental.street}, {rental.number}
                    <br />
                    {rental.district} - {rental.city}/{rental.state}
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={rental.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AppShell>
  );
}
