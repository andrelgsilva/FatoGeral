import { useEffect, useState } from 'react';
import { getAllAnalyses } from '../services/adminService';
import type { Analysis, AdminFilters } from '../services/adminService';
import { Spinner } from '../components/Spinner';

// Importa o modal do FE-17 (vamos criar logo depois)
import { ReviewModal } from '../components/ReviewModal';

export default function Admin() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [filters, setFilters] = useState<AdminFilters>({});

  // Controla qual análise está sendo revisada no modal
  const [reviewing, setReviewing] = useState<Analysis | null>(null);

  async function load(currentPage = page, currentFilters = filters) {
    setLoading(true);
    setError('');
    try {
      const data = await getAllAnalyses(currentFilters, currentPage);
      setAnalyses(data.content);
      setTotalPages(data.totalPages);
    } catch {
      setError('Erro ao carregar análises.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, filters]);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function handleFilterChange(key: keyof AdminFilters, value: string) {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    setPage(0);
  }

  // Chamado pelo modal após salvar — recarrega a lista
  function handleReviewSaved() {
    setReviewing(null);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Painel Admin</h1>
      <p className="text-sm text-gray-500 mb-6">Gerencie e revise todas as análises.</p>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Status</label>
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="COMPLETED">Concluído</option>
            <option value="ERROR">Erro</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Revisado</label>
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('revisado', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Data inicial</label>
          <input
            type="date"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Data final</label>
          <input
            type="date"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Vazio */}
      {!loading && !error && analyses.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">Nenhuma análise encontrada.</p>
        </div>
      )}

      {/* Tabela */}
      {!loading && analyses.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Conteúdo</th>
                <th className="px-4 py-3">Veredicto</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Revisado</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((analysis) => (
                <tr key={analysis.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-600">{(analysis as any).userEmail ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{analysis.content}</td>
                  <td className="px-4 py-3 text-gray-600">{analysis.result?.veredito ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      analysis.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      analysis.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {analysis.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{(analysis as any).revisado ? 'Sim' : 'Não'}</td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(analysis.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setReviewing(analysis)}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
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

      {/* Modal de revisão */}
      {reviewing && (
        <ReviewModal
          analysis={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={handleReviewSaved}
        />
      )}
    </div>
  );
}