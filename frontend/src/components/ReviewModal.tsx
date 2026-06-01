import { useState } from 'react';
import { reviewAnalysis } from '../services/adminService';
import type { Analysis } from '../services/analysisService';
import { Input } from './Input';
import { Spinner } from './Spinner';

interface Props {
  analysis: Analysis;
  onClose: () => void;
  onSaved: () => void;
}

const VEREDICTOS = [
  'Alta probabilidade de Fake News',
  'Possível Fake News',
  'Conteúdo Inconclusivo',
  'Provavelmente Verdadeiro',
  'Verdadeiro',
];

export function ReviewModal({ analysis, onClose, onSaved }: Props) {
  const [veredito, setVeredito] = useState(
    analysis.result?.veredito ?? VEREDICTOS[0]
  );
  const [justificativa, setJustificativa] = useState(
    analysis.result?.justificativa ?? ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!justificativa.trim()) {
      setError('A justificativa é obrigatória.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await reviewAnalysis(analysis.id, { veredito, justificativa });
      onSaved(); // fecha o modal e recarrega a tabela
    } catch {
      setError('Erro ao salvar revisão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    // Fundo escuro por trás do modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Revisar análise</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo analisado */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-400 mb-1">Conteúdo analisado</p>
          <p className="text-sm text-gray-700 line-clamp-3">{analysis.content}</p>
        </div>

        <div className="flex flex-col gap-4">

          {/* Select de veredicto */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Veredicto</label>
            <select
              value={veredito}
              onChange={(e) => setVeredito(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {VEREDICTOS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Textarea de justificativa */}
          <Input
            as="textarea"
            label="Justificativa"
            placeholder="Explique o motivo da revisão..."
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            className="min-h-[100px] resize-y"
          />

          {/* Erro */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg transition disabled:opacity-60"
              style={{ backgroundColor: '#2563eb' }}
            >
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Salvando...' : 'Salvar revisão'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}