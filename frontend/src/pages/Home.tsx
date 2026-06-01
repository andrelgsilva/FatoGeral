import { useState } from 'react';
import toast from 'react-hot-toast';
import { createAnalysis } from '../services/analysisService';
import type { Analysis } from '../services/analysisService';
import { AnalysisResult } from '../components/AnalysisResult';
import { Input } from '../components/Input';
import { Spinner } from '../components/Spinner';

export default function Home() {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);

  function validate(): boolean {
    if (!content.trim() && !url.trim()) {
      setError('Preencha o texto ou a URL para análise.');
      return false;
    }
    setError('');
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await createAnalysis({ content: url.trim() || content.trim() });
      setResult(data);
      toast.success('Análise enviada com sucesso!');
    } catch {
      toast.error('Erro ao enviar para análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Analisar conteúdo</h1>
      <p className="text-sm text-gray-500 mb-6">
        Cole um texto ou URL suspeita para verificar a veracidade com IA.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
        <Input
          as="textarea"
          label="Texto suspeito"
          placeholder="Cole aqui o texto que deseja verificar..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[140px] resize-y"
        />

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200" />
          ou
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <Input
          label="URL suspeita"
          type="url"
          placeholder="https://exemplo.com/noticia"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
          style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
        >
          {loading ? <Spinner size="sm" /> : null}
          {loading ? 'Analisando...' : 'Analisar'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Resultado da análise</h2>
          <AnalysisResult analysis={result} />
        </div>
      )}
    </div>
  );
}