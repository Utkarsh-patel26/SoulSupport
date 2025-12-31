import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function ConfirmDialog({ open, title = 'Confirm action', description, onCancel, onConfirm, confirmLabel = 'Confirm' }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      actions={[
        <Button key="cancel" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="confirm" variant="primary" size="sm" onClick={onConfirm}>
          {confirmLabel}
        </Button>,
      ]}
    >
      <p>{description}</p>
    </Modal>
  );
}
