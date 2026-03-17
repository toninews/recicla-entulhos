'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { dumpstersService } from '@/services/dumpsters';
import { rentalsService } from '@/services/rentals';
import { Dumpster, Rental } from '@/types';

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

export default function DumpsterHistoryPage() {
  const params = useParams<{ dumpsterId: string }>();
  const [dumpster, setDumpster] = useState<Dumpster | null>(null);
  const [history, setHistory] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [dumpsterData, historyData] = await Promise.all([
          dumpstersService.getById(params.dumpsterId),
          rentalsService.history({ dumpsterId: params.dumpsterId }),
        ]);

        setDumpster(dumpsterData);
        setHistory(historyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar o histórico.');
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [params.dumpsterId]);

  return (
    <AppShell
      title="Histórico da caçamba"
      description={
        dumpster
          ? `Consulte todas as locações da caçamba ${dumpster.serialNumber}.`
          : 'Consulte todas as locações registradas para esta caçamba.'
      }
    >
      <section className="table-panel">
        <h2>Locações registradas</h2>

        <div className="button-row">
          <Link className="secondary-button" href="/cacambas">
            Voltar
          </Link>
          {dumpster?.status === 'AVAILABLE' ? (
            <Link className="primary-button" href={`/alugueis/${params.dumpsterId}`}>
              Alugar caçamba
            </Link>
          ) : (
            <span className="mini-button danger disabled" aria-disabled="true">
              Em aluguel
            </span>
          )}
        </div>

        {error ? <p className="feedback-text error">{error}</p> : null}

        {loading ? (
          <p className="helper-text">Carregando histórico...</p>
        ) : history.length === 0 ? (
          <EmptyState
            title="Sem locações registradas"
            description="Esta caçamba ainda não possui histórico de aluguel."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Início / Encerramento</th>
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
                  <td data-label="Início / Encerramento">
                    <strong>Iniciado em {formatDateTime(rental.startDate)}</strong>
                    <br />
                    {rental.endDate ? (
                      <>
                        Previsto para {formatDateTime(rental.endDate)}
                        <br />
                      </>
                    ) : null}
                    {rental.finishedAt
                      ? `Encerrado em ${formatDateTime(rental.finishedAt)}`
                      : 'Em andamento'}
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
