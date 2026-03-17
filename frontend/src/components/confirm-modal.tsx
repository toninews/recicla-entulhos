'use client';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className="modal-card">
        <h3 id="confirm-modal-title">{title}</h3>
        <p>{description}</p>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={tone === 'danger' ? 'danger-button' : 'primary-button'}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
