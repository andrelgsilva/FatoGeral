import { Spinner } from './Spinner';
import type { Analysis } from '../services/analysisService';

interface Props {
  analysis: Analysis;
}

function getBadgeColor(veredito: string): string {
  const v = veredito.toLowerCase();
  if (v.includes('fake') || v.includes('falso') || v.includes('desinformação')) {
    return 'bg-red-100 text-red-700 border-red-200';
  }
  if (v.includes('verdadeiro') || v.includes('verídico') || v.includes('correto')) {
    return 'bg-green-100 text-green-700 border-green-200';
  }
  return 'bg-yellow-100 text-yellow-700 border-yellow-200';
}

export function AnalysisResult({ analysis }: Props) {
  if (analysis.status === 'PENDING') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-blue-600">
        <Spinner size="lg" />
        <p className="text-sm">A IA está analisando o conteúdo...</p>
      </div>
    );
  }

  if (analysis.status === 'ERROR') {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
        Ocorreu um erro ao processar esta análise. Tente novamente.
      </div>
    );
  }

  if (!analysis.result) return null;

  const { veredito, confianca, justificativa, fontes } = analysis.result;
  const porcentagem = Math.round(confianca * 100);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Veredicto</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getBadgeColor(veredito)}`}>
          {veredito}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Nível de confiança</span>
          <span className="font-semibold">{porcentagem}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${porcentagem}%`,
              backgroundColor: porcentagem >= 70 ? '#16a34a' : porcentagem >= 40 ? '#d97706' : '#dc2626',
            }}
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Justificativa</p>
        <p className="text-sm text-gray-700 leading-relaxed">{justificativa}</p>
      </div>

      {fontes && fontes.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Fontes</p>
          <ul className="flex flex-col gap-1">
            {fontes.map((fonte, index) => (
              <li key={index}>
                <a href={fonte} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                  {fonte}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}