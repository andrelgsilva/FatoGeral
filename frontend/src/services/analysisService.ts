import { api } from './api';

// ===== TIPOS =====

// O que enviamos para criar uma análise
export interface AnalysisRequest {
  inputText?: string;
  inputUrl?: string;
}

// O resultado da análise retornado pela IA
export interface AnalysisResult {
  veredito: string;
  confianca: number;
  justificativa: string;
  fontes: string[];
}

// Uma análise completa retornada pela API
export interface Analysis {
  id: string;
  inputText?: string;
  inputUrl?: string;
  status: 'PENDING' | 'COMPLETED' | 'ERROR';
  result: AnalysisResult | null;
  createdAt: string;
}

// Resposta paginada do histórico
export interface HistoryResponse {
  content: Analysis[];
  totalPages: number;
  totalElements: number;
  number: number;
}

// ===== FUNÇÕES =====

// Envia texto/URL para análise
export async function createAnalysis(data: AnalysisRequest): Promise<Analysis> {
  const response = await api.post<Analysis>('/analysis', data);
  return response.data;
}

// Busca uma análise específica pelo ID
export async function getAnalysisById(id: string): Promise<Analysis> {
  const response = await api.get<Analysis>(`/analysis/${id}`);
  return response.data;
}

// Busca o histórico do usuário com paginação
export async function getHistory(page: number = 0): Promise<HistoryResponse> {
  const response = await api.get<HistoryResponse>('/analysis/history', {
    params: { page, size: 10 },
  });
  return response.data;
}