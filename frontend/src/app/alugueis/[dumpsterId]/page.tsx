'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { useToast } from '@/components/toast-provider';
import { dumpstersService } from '@/services/dumpsters';
import { rentalsService } from '@/services/rentals';
import { Dumpster } from '@/types';

type RentalFormState = {
  customerName: string;
  customerPhone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  reference: string;
  endDate: string;
  notes: string;
};

const initialForm: RentalFormState = {
  customerName: '',
  customerPhone: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  reference: '',
  endDate: '',
  notes: '',
};

function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.length <= 5 ? digits : `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 13);

  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
}

export default function RentDumpsterPage() {
  const params = useParams<{ dumpsterId: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [dumpster, setDumpster] = useState<Dumpster | null>(null);
  const [form, setForm] = useState<RentalFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [lookingUpZipCode, setLookingUpZipCode] = useState(false);
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

  async function handleZipCodeLookup() {
    if (form.zipCode.replace(/\D/g, '').length !== 8) {
      return;
    }

    setLookingUpZipCode(true);
    setError('');

    try {
      const address = await rentalsService.lookupZipCode(form.zipCode);
      setForm((current) => ({
        ...current,
        zipCode: address.zipCode.replace(/\D/g, ''),
        street: address.street,
        district: address.district,
        city: address.city,
        state: address.state,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível consultar o CEP.');
    } finally {
      setLookingUpZipCode(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dumpster) {
      return;
    }

    setError('');

    try {
      await rentalsService.create({
        ...form,
        dumpsterId: dumpster.id,
        zipCode: form.zipCode.replace(/\D/g, ''),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      });

      showToast('Aluguel criado com sucesso.');
      router.push('/cacambas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar o aluguel.');
    }
  }

  function handleClearForm() {
    setForm(initialForm);
    setError('');
  }

  return (
    <AppShell
      title="Alugar caçamba"
      description="Confirme a caçamba selecionada e informe o endereço de entrega."
    >
      <section className="panel-grid">
        <article className="panel">
          <h2>Caçamba selecionada</h2>

          {loading ? (
            <p className="helper-text">Carregando caçamba...</p>
          ) : dumpster ? (
            <div className="form-grid">
              <div className="field-group">
                <label>Número de série</label>
                <input value={dumpster.serialNumber} disabled />
              </div>
              <div className="field-group">
                <label>Cor</label>
                <input value={dumpster.color} disabled />
              </div>
              <div className="button-row">
                <Link className="secondary-button" href={`/historico/${params.dumpsterId}`}>
                  Ver histórico
                </Link>
              </div>
            </div>
          ) : (
            <p className="feedback-text error">{error || 'Caçamba não encontrada.'}</p>
          )}
        </article>

        <article className="panel compact-panel">
          <h2>Endereço e locação</h2>

          <form className="form-grid compact-form-grid" onSubmit={handleSubmit}>
            <div className="three-columns">
              <div className="field-group">
                <label htmlFor="customerName">Cliente</label>
                <input
                  id="customerName"
                  value={form.customerName}
                  onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="customerPhone">Telefone</label>
                <input
                  id="customerPhone"
                  value={form.customerPhone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      customerPhone: formatPhone(event.target.value),
                    }))
                  }
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                  required
                />
              </div>
            </div>

            <div className="three-columns">
              <div className="field-group">
                <label htmlFor="zipCode">CEP</label>
                <input
                  id="zipCode"
                  value={formatZipCode(form.zipCode)}
                  onBlur={() => void handleZipCodeLookup()}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      zipCode: event.target.value.replace(/\D/g, '').slice(0, 8),
                    }))
                  }
                  placeholder="01310-100"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="number">Número</label>
                <input
                  id="number"
                  value={form.number}
                  onChange={(event) => setForm((current) => ({ ...current, number: event.target.value }))}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="state">UF</label>
                <input
                  id="state"
                  maxLength={2}
                  value={form.state}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, state: event.target.value.toUpperCase() }))
                  }
                  required
                />
              </div>
            </div>

            <div className="three-columns">
              <div className="field-group field-span-two">
                <label htmlFor="street">Logradouro</label>
                <input
                  id="street"
                  value={form.street}
                  onChange={(event) => setForm((current) => ({ ...current, street: event.target.value }))}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="district">Bairro</label>
                <input
                  id="district"
                  value={form.district}
                  onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="three-columns">
              <div className="field-group">
                <label htmlFor="city">Cidade</label>
                <input
                  id="city"
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="complement">Complemento</label>
                <input
                  id="complement"
                  value={form.complement}
                  onChange={(event) => setForm((current) => ({ ...current, complement: event.target.value }))}
                />
              </div>

              <div className="field-group">
                <label htmlFor="reference">Referência</label>
                <input
                  id="reference"
                  value={form.reference}
                  onChange={(event) => setForm((current) => ({ ...current, reference: event.target.value }))}
                />
              </div>
            </div>

            <div className="three-columns">
              <div className="field-group">
                <label htmlFor="endDate">Previsão de término</label>
                <input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                />
              </div>

              <div className="field-group field-span-two">
                <label htmlFor="notes">Observações</label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Informações adicionais sobre a entrega"
                />
              </div>
            </div>

            {lookingUpZipCode ? <span className="helper-text">Consultando CEP...</span> : null}
            {error ? <span className="feedback-text error">{error}</span> : null}

            <div className="button-row">
              <Link className="secondary-button" href="/cacambas">
                Voltar
              </Link>
              <button className="secondary-button" type="button" onClick={handleClearForm}>
                Limpar
              </button>
              <button className="primary-button" type="submit" disabled={!dumpster}>
                Confirmar aluguel
              </button>
            </div>
          </form>
        </article>
      </section>
    </AppShell>
  );
}
