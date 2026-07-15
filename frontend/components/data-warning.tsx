interface DataWarningProps {
  message: string | null
}

export const DataWarning = ({ message }: DataWarningProps): React.ReactNode => (
  message ? (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
      {message}
    </div>
  ) : null
)
