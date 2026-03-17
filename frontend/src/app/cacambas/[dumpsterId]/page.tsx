'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { ColorIndicator } from '@/components/color-indicator';
import { DumpsterForm } from '@/components/dumpster-form';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/components/toast-provider';
import { dumpstersService } from '@/services/dumpsters';
import { Dumpster } from '@/types';

export default function EditDumpsterPage() {
  const params = useParams<{ dumpsterId: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [dumpster, setDumpster] = useState<Dumpster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDumpster() {
      setLoading(true);
      setError('');

      try {
        const data = await dumpstersService.getById(params.dumpsterId);
        setDumpster(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a caçamba.');
      } finally {
        setLoading(false);
      }
    }

    void loadDumpster();
  }, [params.dumpsterId]);

  async function handleSubmit(values: { serialNumber: string; color: string }) {
    if (!dumpster) return;

    setError('');

    try {
      await dumpstersService.update(dumpster.id, values);
      showToast('Caçamba atualizada com sucesso.');
      router.push('/cacambas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar a caçamba.');
    }
  }

  return (
    <AppShell
      title="Editar caçamba"
      description="Atualize os dados da caçamba e acesse rapidamente aluguel e histórico."
    >
      <section className="panel single-panel">
        <h2>Edição de caçamba</h2>

        {loading ? (
          <p className="helper-text">Carregando caçamba...</p>
        ) : !dumpster ? (
          <p className="feedback-text error">{error || 'Caçamba não encontrada.'}</p>
        ) : (
          <>
            <div className="record-strip">
              <div>
                <small>Status atual</small>
                <div>
                  <StatusBadge status={dumpster.status} />
                </div>
              </div>
              <div>
                <small>Cor cadastrada</small>
                <div>
                  <ColorIndicator colorName={dumpster.color} />
                </div>
              </div>
              <div className="button-row">
                <Link className="secondary-button" href="/cacambas">
                  Voltar
                </Link>
                {dumpster.status === 'AVAILABLE' ? (
                  <Link className="primary-button" href={`/alugueis/${dumpster.id}`}>
                    Alugar
                  </Link>
                ) : null}
                <Link className="secondary-button" href={`/historico/${dumpster.id}`}>
                  Histórico
                </Link>
              </div>
            </div>

            {dumpster.status === 'RENTED' ? (
              <p className="feedback-text">
                Esta caçamba está em aluguel no momento. A edição fica bloqueada até o encerramento da locação.
              </p>
            ) : null}

            <DumpsterForm
              initialValues={{
                serialNumber: dumpster.serialNumber,
                color: dumpster.color,
              }}
              submitLabel="Salvar alteração"
              error={error}
              disabled={dumpster.status === 'RENTED'}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </section>
    </AppShell>
  );
}
