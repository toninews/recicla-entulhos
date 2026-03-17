'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/components/toast-provider';
import { dumpstersService } from '@/services/dumpsters';
import { rentalsService } from '@/services/rentals';
import { Dumpster, Rental } from '@/types';

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
  dumpsterId: string;
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
  dumpsterId: '',
};

function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 13);

  if (!digits) {
    return '';
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [availableDumpsters, setAvailableDumpsters] = useState<Dumpster[]>([]);
  const [form, setForm] = useState<RentalFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [lookingUpZipCode, setLookingUpZipCode] = useState(false);
  const [error, setError] = useState('');
  const [rentalToFinish, setRentalToFinish] = useState<Rental | null>(null);
  const { showToast } = useToast();

  async function loadPageData() {
    setLoading(true);
    setError('');

    try {
      const [rentalsData, dumpstersData] = await Promise.all([
        rentalsService.list({ status: 'ACTIVE' }),
        dumpstersService.list({ status: 'AVAILABLE' }),
      ]);

      setRentals(rentalsData);
      setAvailableDumpsters(dumpstersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar os dados da página.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPageData();
  }, []);

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
    setError('');

    try {
      await rentalsService.create({
        ...form,
        zipCode: form.zipCode.replace(/\D/g, ''),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      });

      setForm(initialForm);
      showToast('Aluguel criado com sucesso.');
      await loadPageData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar o aluguel.');
    }
  }

  async function handleFinish() {
    if (!rentalToFinish) {
      return;
    }

    setError('');

    try {
      await rentalsService.finish(rentalToFinish.id);
      showToast('Aluguel encerrado com sucesso.');
      setRentalToFinish(null);
      await loadPageData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível encerrar o aluguel.');
    }
  }

  function handleClearForm() {
    setForm(initialForm);
    setError('');
  }

  return (
    <AppShell
      title="Fluxo de aluguel"
      description="Consulte o CEP, selecione uma caçamba disponível e acompanhe as locações ativas."
    >
      <section className="panel-grid rentals-stacked-grid">
        <article className="panel compact-panel">
          <h2>Novo aluguel</h2>

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

              <div className="field-group">
                <label htmlFor="dumpsterId">Caçamba</label>
                <select
                  id="dumpsterId"
                  value={form.dumpsterId}
                  onChange={(event) => setForm((current) => ({ ...current, dumpsterId: event.target.value }))}
                  required
                >
                  <option value="">Selecione</option>
                  {availableDumpsters.map((dumpster) => (
                    <option key={dumpster.id} value={dumpster.id}>
                      {dumpster.serialNumber} - {dumpster.color}
                    </option>
                  ))}
                </select>
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
                    setForm((current) => ({
                      ...current,
                      state: event.target.value.toUpperCase(),
                    }))
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
              />
              </div>
            </div>

            {lookingUpZipCode ? <span className="helper-text">Consultando CEP...</span> : null}
            {error ? <span className="feedback-text error">{error}</span> : null}
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={handleClearForm}>
                Limpar
              </button>
              <button className="primary-button" type="submit">
                Criar aluguel
              </button>
            </div>
          </form>
        </article>

        <article className="table-panel">
          <h2>Aluguéis ativos</h2>

          {loading ? (
            <p className="helper-text">Carregando aluguéis ativos...</p>
          ) : rentals.length === 0 ? (
            <EmptyState
              title="Nenhum aluguel ativo"
              description="Crie um aluguel para visualizar a ocupação das caçambas nesta área."
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Caçamba</th>
                  <th>Endereço</th>
                  <th>Início</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td data-label="Cliente">
                      <strong>{rental.customerName}</strong>
                      <br />
                      {rental.customerPhone}
                    </td>
                    <td data-label="Caçamba">{rental.dumpster.serialNumber}</td>
                    <td data-label="Endereço">
                      {rental.street}, {rental.number}
                      <br />
                      {rental.district} - {rental.city}/{rental.state}
                    </td>
                    <td data-label="Início">
                      {new Date(rental.startDate).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={rental.status} />
                    </td>
                    <td data-label="Ações">
                      <button className="mini-button" type="button" onClick={() => setRentalToFinish(rental)}>
                        Encerrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </section>

      <ConfirmModal
        open={Boolean(rentalToFinish)}
        title="Encerrar aluguel"
        description={
          rentalToFinish
            ? `Tem certeza que deseja encerrar o aluguel de ${rentalToFinish.customerName}?`
            : ''
        }
        confirmLabel="Encerrar aluguel"
        onCancel={() => setRentalToFinish(null)}
        onConfirm={() => void handleFinish()}
      />
    </AppShell>
  );
}
