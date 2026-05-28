import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  as?: 'input';
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  as: 'textarea';
}

type Props = InputProps | TextareaProps;

export function Input({ label, error, as: Tag = 'input', className, ...props }: Props) {
  const base = 'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition';
  const errorClass = error ? 'border-red-500' : 'border-gray-300';

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      {Tag === 'textarea' ? (
        <textarea className={`${base} ${errorClass} ${className ?? ''}`} {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input className={`${base} ${errorClass} ${className ?? ''}`} {...(props as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}