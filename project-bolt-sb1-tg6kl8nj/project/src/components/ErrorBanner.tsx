import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <p className="flex-1 text-sm text-red-200">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-400 transition hover:text-red-300"
        aria-label="Dismiss error"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
