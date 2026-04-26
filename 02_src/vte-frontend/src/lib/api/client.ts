import type {
  IssueSummary,
  IssueFull,
  Article,
  Section,
  EditorialBoardMember,
  PaginatedArticleList,
  TokenPair,
  StaticPage,
  IssueStatus,
} from '@/lib/types';

// When unset, requests go to /backend on the same origin. In dev that
// hits the Next.js API-route proxy at src/app/backend/[...path]/route.ts;
// in production it should be served by the reverse proxy / nginx.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/backend';
const USE_MOCKS = process.env.NEXT_PUBLIC_API_MODE === 'mock';

// ── Token storage ────────────────────────────────────────────────

const ACCESS_KEY = 'vte_admin_access';
const REFRESH_KEY = 'vte_admin_refresh';

export const tokenStore = {
  getAccess(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(tokens: TokenPair) {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Fetch wrapper with auto-auth + refresh ───────────────────────

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

async function rawFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, init);
}

async function tryRefreshTokens(): Promise<boolean> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;
  try {
    const res = await rawFetch('/auth/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as TokenPair;
    tokenStore.set(data);
    return true;
  } catch {
    return false;
  }
}

async function fetchApi<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (USE_MOCKS) {
    const { getMockData } = await import('./mock/data');
    return getMockData(path, options) as T;
  }

  const { auth: needAuth, ...init } = options;
  const headers = new Headers(init.headers ?? {});
  if (needAuth) {
    const token = tokenStore.getAccess();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  // Auto-refresh on 401 if we have a refresh token
  if (res.status === 401 && needAuth && tokenStore.getRefresh()) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      const newToken = tokenStore.getAccess();
      if (newToken) headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    } else {
      tokenStore.clear();
    }
  }

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(res.status, `API error: ${res.status} ${res.statusText}`, body);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Public API ──────────────────────────────────────────────────

export const api = {
  // Issues — единый эндпоинт; для публичной части фильтруем по статусу Published на клиенте
  getIssues: async (year?: number): Promise<IssueSummary[]> => {
    const path = year ? `/issues/?year=${year}` : '/issues/';
    const all = await fetchApi<IssueSummary[]>(path);
    return all.filter((i) => i.status === 'Published');
  },

  getAllIssues: (year?: number) =>
    fetchApi<IssueSummary[]>(year ? `/issues/?year=${year}` : '/issues/'),

  getLatestIssue: async (): Promise<IssueSummary | null> => {
    const issues = await api.getIssues();
    if (issues.length === 0) return null;
    return [...issues].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.number - a.number;
    })[0];
  },

  getYears: async (): Promise<number[]> => {
    const issues = await api.getIssues();
    const years = Array.from(new Set(issues.map((i) => i.year)));
    return years.sort((a, b) => b - a);
  },

  getIssue: (id: number) => fetchApi<IssueFull>(`/issues/${id}/`),

  getIssueArticles: (issueId: number) =>
    fetchApi<Article[]>(`/articles/?issue_id=${issueId}`),

  listArticles: () => fetchApi<Article[]>('/articles/'),
  getArticle: (id: number) => fetchApi<Article>(`/articles/${id}/`),

  getSections: () => fetchApi<Section[]>('/sections/'),
  getSection: (slug: string) => fetchApi<Section>(`/sections/${slug}/`),
  getSectionArticles: (slug: string) =>
    fetchApi<Section>(`/sections/${slug}/articles/`),

  getEditorialBoard: () =>
    fetchApi<EditorialBoardMember[]>('/editorial_board/'),

  search: (params: {
    q?: string;
    section?: string;
    year_from?: number;
    year_to?: number;
    page?: number;
    page_size?: number;
  }) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return fetchApi<PaginatedArticleList>(`/search/${qs ? '?' + qs : ''}`);
  },

  getPage: async (slug: string): Promise<StaticPage | null> => {
    try {
      return await fetchApi<StaticPage>(`/pages/${slug}/`);
    } catch {
      return null;
    }
  },
};

// ── Auth (JWT) ──────────────────────────────────────────────────

export const auth = {
  login: async (login: string, password: string) => {
    const tokens = await fetchApi<TokenPair>('/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    tokenStore.set(tokens);
    return tokens;
  },

  logout: async () => {
    const refresh = tokenStore.getRefresh();
    if (refresh) {
      try {
        await fetchApi<{ message: string }>('/auth/logout/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
          auth: true,
        });
      } catch {
        // ignore — clear local tokens anyway
      }
    }
    tokenStore.clear();
  },

  isAuthenticated: () => !!tokenStore.getAccess(),
};

// ── Admin API (auto-auth via localStorage) ──────────────────────

export interface IssueCreatePayload {
  year: number;
  number: number;
  sequential_number: number;
  sections_slugs?: string[];
}

export interface IssueUpdatePayload {
  year?: number;
  number?: number;
  sequential_number?: number;
  sections_slugs?: string[];
}

export interface ArticleCreatePayload {
  issue_id?: number;
  // section_slug — writeOnly поле для привязки статьи к рубрике (см. ArticleRequest в swagger).
  section_slug: string;
  title: { ru: string; en?: string };
  authors: { ru: string; en?: string };
  pages: string;
  doi: string;
  abstract?: { ru: string; en?: string } | null;
  article_type: 'Scientific' | 'Review' | 'Book_review' | 'Editorial';
  keywords: { ru: string[]; en: string[] };
  udk: string;
  jel_codes?: string[];
  references: { order: number; text_ru: string; text_en: string }[];
  received_date: string;
  funding: { ru: string; en?: string };
  xml_url?: string | null;
}

export const adminApi = {
  // Issues
  listIssues: (year?: number) =>
    fetchApi<IssueSummary[]>(year ? `/issues/?year=${year}` : '/issues/', {
      auth: true,
    }),

  getIssue: (id: number) =>
    fetchApi<IssueFull>(`/issues/${id}/`, { auth: true }),

  createIssue: (data: IssueCreatePayload) =>
    fetchApi<IssueSummary>('/issues/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      auth: true,
    }),

  updateIssue: (id: number, data: IssueUpdatePayload) =>
    fetchApi<IssueSummary>(`/issues/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      auth: true,
    }),

  deleteIssue: (id: number) =>
    fetchApi<void>(`/issues/${id}/`, {
      method: 'DELETE',
      auth: true,
    }),

  updateIssueStatus: (id: number, status: IssueStatus) =>
    fetchApi<IssueSummary>(`/issues/${id}/update_status/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      auth: true,
    }),

  addArticles: (issueId: number, articleIds: number[]) =>
    fetchApi<IssueSummary>(`/issues/${issueId}/add_articles/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles_ids: articleIds }),
      auth: true,
    }),

  removeArticles: (issueId: number, articleIds: number[]) =>
    fetchApi<IssueSummary>(`/issues/${issueId}/remove_articles/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles_ids: articleIds }),
      auth: true,
    }),

  reorderArticles: (issueId: number, articleIds: number[]) =>
    fetchApi<IssueSummary>(`/issues/${issueId}/reorder_articles/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles_ids: articleIds }),
      auth: true,
    }),

  uploadIssueCover: (issueId: number, file: File) => {
    const fd = new FormData();
    fd.append('cover_image', file);
    return fetchApi<IssueSummary>(`/issues/${issueId}/upload_cover/`, {
      method: 'POST',
      body: fd,
      auth: true,
    });
  },

  uploadIssuePdf: (issueId: number, file: File) => {
    const fd = new FormData();
    fd.append('pdf_file', file);
    return fetchApi<IssueSummary>(`/issues/${issueId}/upload_pdf/`, {
      method: 'POST',
      body: fd,
      auth: true,
    });
  },

  // Articles
  listArticles: (issueId?: number) =>
    fetchApi<Article[]>(issueId ? `/articles/?issue_id=${issueId}` : '/articles/', {
      auth: true,
    }),

  getArticle: (id: number) =>
    fetchApi<Article>(`/articles/${id}/`, { auth: true }),

  createArticle: (data: ArticleCreatePayload) =>
    fetchApi<Article>('/articles/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      auth: true,
    }),

  updateArticle: (id: number, data: Partial<ArticleCreatePayload>) =>
    fetchApi<Article>(`/articles/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      auth: true,
    }),

  deleteArticle: (id: number) =>
    fetchApi<void>(`/articles/${id}/`, {
      method: 'DELETE',
      auth: true,
    }),

  uploadArticleReadyPdf: (articleId: number, file: File) => {
    const fd = new FormData();
    fd.append('pdf_file', file);
    return fetchApi<Article>(`/articles/${articleId}/upload_ready_pdf_file/`, {
      method: 'POST',
      body: fd,
      auth: true,
    });
  },

  // Подача рукописи автором: загружает .docx и сопроводительные данные.
  // Эндпоинт публичный (auth не обязателен), но JWT принимает.
  submitManuscript: (data: {
    authors: string;
    workplace_title_and_address: string;
    position_title: string;
    city: string;
    email: string;
    phone_number: string;
    docx_file: File;
    degree?: string;
    academic_title?: string;
    funding?: string;
    orcid_id?: string;
    zip_with_additional_files?: File;
  }) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined || v === null) continue;
      fd.append(k, v as string | Blob);
    }
    return fetchApi<{ message: string }>('/articles/upload_new_pdf_file/', {
      method: 'POST',
      body: fd,
    });
  },

  downloadTemplate: async (): Promise<Blob> => {
    const token = tokenStore.getAccess();
    const headers = new Headers();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const res = await fetch(`${API_BASE}/articles/download_template/`, { headers });
    if (!res.ok) {
      throw new ApiError(res.status, `API error: ${res.status} ${res.statusText}`);
    }
    return res.blob();
  },

  // Sections
  createSection: (name: { ru: string; en: string }) =>
    fetchApi<Section>('/sections/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      auth: true,
    }),

  updateSection: (slug: string, name: { ru: string; en: string }) =>
    fetchApi<Section>(`/sections/${slug}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      auth: true,
    }),

  deleteSection: (slug: string) =>
    fetchApi<void>(`/sections/${slug}/`, {
      method: 'DELETE',
      auth: true,
    }),

  // ── Users ──────────────────────────────────────────────────────
  changePassword: (oldPassword: string, newPassword: string) =>
    fetchApi<{ message: string }>('/users/change_password/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      auth: true,
    }),

  requestPasswordReset: (email: string) =>
    fetchApi<{ message: string }>('/users/send_email_to_password_reset/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }),
};
