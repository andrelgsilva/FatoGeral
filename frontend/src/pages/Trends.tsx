import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Spinner } from '../components/Spinner';

interface TrendItem {
  tema: string;
  quantidade: number;
}

export default function Trends() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get<TrendItem[]>('/trends');
        setTrends(data);
      } catch {
        setError('Erro ao carregar tendências. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Pega o maior valor para calcular a barra proporcional
  const max = trends.length > 0 ? Math.max(...trends.map((t) => t.quantidade)) : 1;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Cabeçalho público */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">FatoGeral</span>
          <div className="flex gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Entrar
            </Link>
            <Link
              to="/register"
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
              style={{ backgroundColor: '#2563eb' }}
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Tendências</h1>
        <p className="text-sm text-gray-500 mb-8">
          Temas mais analisados nos últimos 7 dias.
        </p>

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

        {/* Vazio */}
        {!loading && !error && trends.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-sm">Nenhuma tendência disponível no momento.</p>
          </div>
        )}

        {/* Lista de tendências com barra proporcional */}
        {!loading && trends.length > 0 && (
          <div className="flex flex-col gap-4">
            {trends.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.tema}</span>
                  <span className="text-xs text-gray-400">{item.quantidade} análises</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(item.quantidade / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA para login */}
        <div className="mt-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-gray-700 font-medium mb-2">Quer analisar um conteúdo suspeito?</p>
          <p className="text-sm text-gray-500 mb-4">Crie sua conta grátis e use a IA do FatoGeral.</p>
          <Link
            to="/register"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            style={{ backgroundColor: '#2563eb' }}
          >
            Criar conta grátis
          </Link>
        </div>
      </main>
    </div>
  );
}