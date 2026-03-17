'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { ColorIndicator } from '@/components/color-indicator';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/components/toast-provider';
import { dumpstersService } from '@/services/dumpsters';
import { Dumpster } from '@/types';

export default function DumpstersPage() {
  const [dumpsters, setDumpsters] = useState<Dumpster[]>([]);
  const [filters, setFilters] = useState({
    serialNumber: '',
    color: '',
    status: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dumpsterToDelete, setDumpsterToDelete] = useState<Dumpster | null>(null);
  const { showToast } = useToast();

  async function loadDumpsters(customFilters = filters) {
    setLoading(true);
    setError('');

    try {
      const data = await dumpstersService.list(customFilters);
      setDumpsters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar caçambas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDumpsters();
  }, []);

  async function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadDumpsters();
  }

  async function handleClearFilters() {
    const clearedFilters = { serialNumber: '', color: '', status: '' };

    setError('');
    setFilters(clearedFilters);
    await loadDumpsters(clearedFilters);
  }

  async function handleDelete() {
    if (!dumpsterToDelete) {
      return;
    }

    setError('');

    try {
      await dumpstersService.remove(dumpsterToDelete.id);
      showToast('Caçamba removida com sucesso.');
      setDumpsterToDelete(null);
      await loadDumpsters();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Não foi possível excluir a caçamba.';
      setError(message);
      showToast(message);
      setDumpsterToDelete(null);
    }
  }

  const availableCount = dumpsters.filter((item) => item.status === 'AVAILABLE').length;
  const rentedCount = dumpsters.filter((item) => item.status === 'RENTED').length;

  return (
    <AppShell
      title="Gestão de caçambas"
      description="Bem-vindo ao painel da Recicla Entulhos. Cadastre, filtre e acompanhe a disponibilidade das caçambas."
    >
      <section className="stats-strip">
        <article className="stat-card">
          Disponíveis
          <strong>{availableCount}</strong>
        </article>
        <article className="stat-card">
          Alugadas
          <strong>{rentedCount}</strong>
        </article>
      </section>

      <section className="table-panel">
          <h2>Listagem e filtros</h2>

          <div className="button-row">
            <Link className="primary-button" href="/cacambas/nova">
              <span className="button-icon" aria-hidden="true">
                +
              </span>
              Cadastrar nova caçamba
            </Link>
          </div>

          <form className="filters-row" onSubmit={handleFilterSubmit}>
            <div className="field-group">
              <label htmlFor="filterSerial">Número de série</label>
              <input
                id="filterSerial"
                value={filters.serialNumber}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, serialNumber: event.target.value }))
                }
                placeholder="Buscar por série"
              />
            </div>

            <div className="field-group">
              <label htmlFor="filterColor">Cor</label>
              <input
                id="filterColor"
                value={filters.color}
                onChange={(event) => setFilters((current) => ({ ...current, color: event.target.value }))}
                placeholder="Buscar por cor"
              />
            </div>

            <div className="field-group">
              <label htmlFor="filterStatus">Status</label>
              <select
                id="filterStatus"
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="">Todos</option>
                <option value="AVAILABLE">Disponível</option>
                <option value="RENTED">Alugada</option>
              </select>
            </div>

            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => void handleClearFilters()}>
                Limpar
              </button>
              <button className="primary-button" type="submit">
                Filtrar
              </button>
            </div>
          </form>

          {loading ? (
            <p className="helper-text">Carregando caçambas...</p>
          ) : dumpsters.length === 0 ? (
            <EmptyState
              title="Nenhuma caçamba encontrada"
              description="Cadastre uma caçamba ou ajuste os filtros para visualizar resultados."
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Série</th>
                  <th>Cor</th>
                  <th>Status</th>
                  <th>Aluguel ativo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dumpsters.map((dumpster) => (
                  <tr key={dumpster.id}>
                    <td data-label="Série">{dumpster.serialNumber}</td>
                    <td data-label="Cor">
                      <ColorIndicator colorName={dumpster.color} />
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={dumpster.status} />
                    </td>
                    <td data-label="Aluguel ativo">{dumpster.rentals?.[0]?.customerName ?? 'Sem aluguel ativo'}</td>
                    <td data-label="Ações">
                      <div className="table-actions">
                        <Link className="mini-button" href={`/cacambas/${dumpster.id}`}>
                          {dumpster.status === 'AVAILABLE' ? 'Editar' : 'Detalhes'}
                        </Link>
                        {dumpster.status === 'AVAILABLE' ? (
                          <Link className="mini-button" href={`/alugueis/${dumpster.id}`}>
                            Alugar
                          </Link>
                        ) : null}
                        <Link className="mini-button" href={`/historico/${dumpster.id}`}>
                          Histórico
                        </Link>
                        {dumpster.status === 'AVAILABLE' ? (
                          <button
                            className="mini-button danger"
                            type="button"
                            onClick={() => setDumpsterToDelete(dumpster)}
                          >
                            Excluir
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {error ? <p className="feedback-text error">{error}</p> : null}
      </section>

      <ConfirmModal
        open={Boolean(dumpsterToDelete)}
        title="Excluir caçamba"
        description={
          dumpsterToDelete
            ? `Tem certeza que deseja excluir a caçamba ${dumpsterToDelete.serialNumber}? Essa ação só está disponível para caçambas sem aluguel ativo e sem histórico.`
            : ''
        }
        confirmLabel="Excluir"
        tone="danger"
        onCancel={() => setDumpsterToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppShell>
  );
}
