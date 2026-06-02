// analysisService.ts
import { api } from './api';

export interface AnalysisRequest {
  inputText?: string;
  inputUrl?: string;
}

export interface SourceResponse {
  url?: string;
  title?: string;
  description?: string;
}

export interface Analysis {
  id: string;
  inputText?: string;
  inputUrl?: string;
  verdict: string | null;
  confidence: number | null;
  justification: string | null;
  sources: SourceResponse[];
  status: 'PENDING' | 'DONE' | 'ERROR';
  createdAt: string;
}

export interface HistoryResponse {
  content: Analysis[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export async function createAnalysis(data: AnalysisRequest): Promise<Analysis> {
  const response = await api.post<Analysis>('/analysis', data);
  return response.data;
}

export async function getAnalysisById(id: string): Promise<Analysis> {
  const response = await api.get<Analysis>(`/analysis/${id}`);
  return response.data;
}

export async function getHistory(page: number = 0): Promise<HistoryResponse> {
  const response = await api.get<HistoryResponse>('/analysis/history', {
    params: { page, size: 10 },
  });
  return response.data;
}