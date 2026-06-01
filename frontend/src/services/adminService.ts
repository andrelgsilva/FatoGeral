import { api } from './api';
import type { Analysis } from './analysisService';

// ===== TIPOS =====

// Filtros para buscar análises no painel admin
export interface AdminFilters {
  status?: 'PENDING' | 'COMPLETED' | 'ERROR';
  revisado?: boolean;
  startDate?: string;
  endDate?: string;
}

// O que enviamos ao revisar uma análise
export interface ReviewPayload {
  veredito: string;
  justificativa: string;
}

// Resposta paginada do admin
export interface AdminAnalysisResponse {
  content: Analysis[];
  totalPages: number;
  totalElements: number;
  number: number;
}

// ===== FUNÇÕES =====

// Busca todas as análises com filtros e paginação
export async function getAllAnalyses(
  filters: AdminFilters = {},
  page: number = 0
): Promise<AdminAnalysisResponse> {
  const response = await api.get<AdminAnalysisResponse>('/admin/analyses', {
    params: { ...filters, page, size: 10 },
  });
  return response.data;
}

// Revisa uma análise — altera veredicto e justificativa
export async function reviewAnalysis(
  id: string,
  data: ReviewPayload
): Promise<Analysis> {
  const response = await api.put<Analysis>(`/analysis/${id}/review`, data);
  return response.data;
}