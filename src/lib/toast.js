import { toast } from "sonner";

// Custom themed toast functions matching the indigo design system

export const showToast = {
  success: (message, description) =>
    toast.custom((id) => (
      <div className="flex items-start gap-3 w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/5 animate-fade-in">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10 shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{message}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )),

  error: (message, description) =>
    toast.custom((id) => (
      <div className="flex items-start gap-3 w-full max-w-sm rounded-xl border border-destructive/20 bg-card p-4 shadow-lg shadow-black/5 animate-fade-in">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10 shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{message}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )),

  info: (message, description) =>
    toast.custom((id) => (
      <div className="flex items-start gap-3 w-full max-w-sm rounded-xl border border-primary/20 bg-card p-4 shadow-lg shadow-black/5 animate-fade-in">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{message}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )),

  warning: (message, description) =>
    toast.custom((id) => (
      <div className="flex items-start gap-3 w-full max-w-sm rounded-xl border border-warning/20 bg-card p-4 shadow-lg shadow-black/5 animate-fade-in">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/10 shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{message}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(id)}
          className="shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )),
};
