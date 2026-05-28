type Verdict = 'fake' | 'verdadeiro' | 'inconclusivo' | 'pendente';

interface BadgeProps {
  verdict: Verdict;
}

const config: Record<Verdict, { label: string; className: string }> = {
  fake: { label: 'Fake News', className: 'bg-red-100 text-red-700' },
  verdadeiro: { label: 'Verdadeiro', className: 'bg-green-100 text-green-700' },
  inconclusivo: { label: 'Inconclusivo', className: 'bg-yellow-100 text-yellow-700' },
  pendente: { label: 'Pendente', className: 'bg-gray-100 text-gray-600' },
};

export function Badge({ verdict }: BadgeProps) {
  const { label, className } = config[verdict];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}