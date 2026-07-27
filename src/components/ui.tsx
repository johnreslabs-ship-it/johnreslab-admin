import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-cyan-400/15 bg-navy-soft/60 p-6 ${className}`}>{children}</div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold font-mono text-ink">{title}</h1>
        {description && <p className="text-sm text-ink-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: { children: ReactNode; variant?: "primary" | "secondary" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: "bg-cyan text-abyss hover:bg-cyan-bright",
    secondary: "border border-cyan-400/30 text-ink hover:border-cyan-400/70",
    danger: "border border-red-400/30 text-red-300 hover:border-red-400/70",
  };
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-ink-dim font-mono">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="text-xs text-ink-dim block mt-1">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-md bg-navy border border-cyan-400/20 text-ink focus:outline-none focus:border-cyan-400/60 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-md bg-navy border border-cyan-400/20 text-ink font-mono text-sm focus:outline-none focus:border-cyan-400/60 ${props.className ?? ""}`}
    />
  );
}

export function Badge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "green" | "yellow" }) {
  const tones = {
    cyan: "border-cyan-400/25 text-cyan-bright bg-cyan-400/5",
    green: "border-green-400/25 text-green-300 bg-green-400/5",
    yellow: "border-yellow-400/25 text-yellow-300 bg-yellow-400/5",
  };
  return <span className={`inline-block text-xs font-mono px-2 py-1 rounded-md border ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-ink-muted text-center py-12">{message}</p>;
}
