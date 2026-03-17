'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { DumpsterForm } from '@/components/dumpster-form';
import { useToast } from '@/components/toast-provider';
import { dumpstersService } from '@/services/dumpsters';

export default function NewDumpsterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState('');

  async function handleSubmit(values: { serialNumber: string; color: string }) {
    setError('');

    try {
      await dumpstersService.create(values);
      showToast('Caçamba cadastrada com sucesso.');
      router.push('/cacambas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível cadastrar a caçamba.');
    }
  }

  return (
    <AppShell
      title="Nova caçamba"
      description="Cadastre uma nova caçamba informando número de série e cor."
    >
      <section className="panel single-panel">
        <h2>Criação de caçamba</h2>
        <DumpsterForm
          submitLabel="Cadastrar"
          error={error}
          onSubmit={handleSubmit}
          secondaryActions={
            <Link className="secondary-button" href="/cacambas">
              Voltar
            </Link>
          }
        />
      </section>
    </AppShell>
  );
}
