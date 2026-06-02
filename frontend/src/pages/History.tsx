import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/analysisService';
import type { Analysis } from '../services/analysisService';
import { Spinner } from '../components/Spinner';

export default function History() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Carrega o histórico sempre que a página muda
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getHistory(page);
        setAnalyses(data.content);
        setTotalPages(data.totalPages);
      } catch {
        setError('Erro ao carregar histórico. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  // Formata a data para exibição
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Pega as primeiras 80 letras do conteúdo
  function truncate(text?: string | null): string {
    if (!text) return 'Sem conteúdo informado';
    return text.length > 80 ? text.slice(0, 80) + '...' : text;
}

  // Cor do veredicto
  function getBadgeColor(veredito: string): string {
    const v = veredito.toLowerCase();
    if (v.includes('fake') || v.includes('falso')) return 'bg-red-100 text-red-700';
    if (v.includes('verdadeiro') || v.includes('verídico')) return 'bg-green-100 text-green-700';
    return 'bg-yellow-100 text-yellow-700';
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1 cursor-default">Histórico</h1>
      <p className="text-sm text-gray-500 mb-6 cursor-default">Suas análises anteriores.</p>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Lista vazia */}
      {!loading && !error && analyses.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">Você ainda não fez nenhuma análise.</p>
        </div>
      )}

      {/* Lista de análises */}
      {!loading && analyses.length > 0 && (
        <div className="flex flex-col gap-3">
          {analyses.map((analysis) => (
            <button
              key={analysis.id}
              onClick={() => navigate(`/analysis/${analysis.id}`)}
              className="w-full text-left bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-blue-200 hover:shadow-md transition cursor-pointer"
            >
              {/* Trecho do conteúdo */}
              <p className="text-sm text-gray-700 mb-2">
                {truncate(analysis.inputText || analysis.inputUrl)}
              </p>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Veredicto — só aparece se concluído */}
                {analysis.status === 'DONE' && analysis.verdict ? (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getBadgeColor(analysis.verdict)}`}>
                    {analysis.verdict}
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {analysis.status === 'PENDING' ? 'Processando...' : 'Erro'}
                  </span>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {/* Confiança */}
                  {analysis.status === 'DONE' && analysis.confidence != null && (
                    <span>{Math.round(analysis.confidence * 100)}% confiança</span>
                  )}
                  {/* Data */}
                  <span>{formatDate(analysis.createdAt)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}