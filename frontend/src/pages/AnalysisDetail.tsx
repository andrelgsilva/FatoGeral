import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisById } from '../services/analysisService';
import type { Analysis } from '../services/analysisService';
import { AnalysisResult } from '../components/AnalysisResult';
import { Spinner } from '../components/Spinner';

export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getAnalysisById(id);
        setAnalysis(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  // 404 amigável
  if (notFound || !analysis) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Análise não encontrada</h2>
        <p className="text-sm text-gray-500 mb-6">
          Esta análise não existe ou você não tem permissão para visualizá-la.
        </p>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
          style={{ backgroundColor: '#2563eb' }}
        >
          Voltar ao histórico
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Botão voltar */}
      <button
        onClick={() => navigate('/history')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition cursor-pointer"
      >
        ← Voltar ao histórico
      </button>

      {/* Cabeçalho */}
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Detalhe da análise</h1>
      <p className="text-xs text-gray-400 mb-6">{formatDate(analysis.createdAt)}</p>

      {/* Conteúdo analisado */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Conteúdo analisado</p>
        <p className="text-sm text-gray-700 break-words">{analysis.inputText || analysis.inputUrl || ''}</p>
      </div>

      {/* Resultado */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Resultado</p>
        <AnalysisResult analysis={analysis} />
      </div>

    </div>
  );
}