import type { IssueSummary, IssueFull, ArticleFull, ArticleSummary, Section, EditorialBoardMember } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCKS = process.env.NEXT_PUBLIC_API_MODE === 'mock';

async function fetchApi<T>(path: string): Promise<T> {
  if (USE_MOCKS) {
    const { getMockData } = await import('./mock/data');
    return getMockData(path) as T;
  }
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getLatestIssue: () => fetchApi<IssueSummary>('/api/issues/latest/'),
  getIssues: (year?: number) => fetchApi<IssueSummary[]>(year ? `/api/issues/?year=${year}` : '/api/issues/'),
  getIssue: (id: number) => fetchApi<IssueFull>(`/api/issues/${id}/`),
  getYears: () => fetchApi<number[]>('/api/issues/years/'),
  getArticle: (id: number) => fetchApi<ArticleFull>(`/api/articles/${id}/`),
  getSections: () => fetchApi<Section[]>('/api/sections/'),
  getSectionArticles: (slug: string, page?: number) => fetchApi<{ count: number; results: ArticleSummary[] }>(`/api/sections/${slug}/articles/?page=${page || 1}`),
  getEditorialBoard: () => fetchApi<EditorialBoardMember[]>('/api/editorial-board/'),
  search: (q: string) => fetchApi<{ count: number; results: ArticleSummary[] }>(`/api/search/?q=${q}`),
};
