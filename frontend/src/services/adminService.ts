import { api } from './api';
import type { Analysis } from './analysisService';

export interface AdminFilters {
  status?: 'PENDING' | 'DONE' | 'ERROR';
  revisado?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface ReviewPayload {
  verdict: string;
  justification: string;
}

export interface AdminAnalysisResponse {
  content: Analysis[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export async function getAllAnalyses(
  filters: AdminFilters = {},
  page: number = 0
): Promise<AdminAnalysisResponse> {
  const response = await api.get<AdminAnalysisResponse>('/admin/analyses', {
    params: { ...filters, page, size: 10 },
  });

  return response.data;
}

export async function reviewAnalysis(
  id: string,
  data: ReviewPayload
): Promise<Analysis> {
  const response = await api.put<Analysis>(`/analysis/${id}/review`, data);

  return response.data;
}