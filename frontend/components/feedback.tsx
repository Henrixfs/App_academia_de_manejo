'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'


interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  loading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps): React.ReactNode => (
  <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Volver</Button>
        <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>Confirmar</Button>
      </div>
    </DialogContent>
  </Dialog>
)

interface FeedbackMessageProps {
  message: string | null
}

export const FeedbackMessage = ({ message }: FeedbackMessageProps): React.ReactNode => (
  message ? <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">{message}</p> : null
)
