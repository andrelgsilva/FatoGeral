import type { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
}

const config: Record<AlertVariant, string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
};

export function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`border-l-4 px-4 py-3 rounded-lg text-sm ${config[variant]}`}>
      {children}
    </div>
  );
}