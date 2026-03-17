'use client';

import { FormEvent, useState } from 'react';

type DumpsterFormValues = {
  serialNumber: string;
  color: string;
};

type DumpsterFormProps = {
  initialValues?: DumpsterFormValues;
  submitLabel: string;
  error?: string;
  disabled?: boolean;
  onSubmit: (values: DumpsterFormValues) => Promise<void> | void;
  secondaryActions?: React.ReactNode;
};

const defaultValues: DumpsterFormValues = {
  serialNumber: '',
  color: '',
};

export function DumpsterForm({
  initialValues = defaultValues,
  submitLabel,
  error,
  disabled = false,
  onSubmit,
  secondaryActions,
}: DumpsterFormProps) {
  const [values, setValues] = useState<DumpsterFormValues>(initialValues);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(values);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="serialNumber">Número de série</label>
        <input
          id="serialNumber"
          value={values.serialNumber}
          onChange={(event) => setValues((current) => ({ ...current, serialNumber: event.target.value }))}
          placeholder="Ex.: CAC-001"
          disabled={disabled}
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="color">Cor</label>
        <input
          id="color"
          value={values.color}
          onChange={(event) => setValues((current) => ({ ...current, color: event.target.value }))}
          placeholder="Ex.: Verde"
          disabled={disabled}
          required
        />
      </div>

      {error ? <span className="feedback-text error">{error}</span> : null}

      <div className="button-row">
        {secondaryActions}
        <button className="primary-button" type="submit" disabled={disabled}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
