import type {
  IssueSummary,
  IssueFull,
  Article,
  Author,
  Section,
  EditorialBoardMember,
  PaginatedArticleList,
  TokenPair,
  CurrentUser,
  StaticPage,
  IssueStatus,
} from '@/lib/types';

// Server vs client base URL.
//
// Client (browser): hits same-origin `/backend/*`. The Next.js API-route at
// src/app/backend/[...path]/route.ts (or an external nginx) forwards the
// request to the real backend. Same-origin avoids CORS in dev.
//
// Server (Node.js, при SSR/RSC): относительный URL не работает, fetch требует
// абсолютный. CORS на сервере не применяется — поэтому ходим напрямую на
// бэкенд по `NEXT_PUBLIC_API_PROXY_TARGET` (тот же URL, который потребляет
// и наш прокси-роут).
const isServer = typeof window === 'undefined';
const PROXY_TARGET = process.env.NEXT_PUBLIC_API_PROXY_TARGET;
const API_BASE = process.env.NEXT_PUBLIC_API_URL
  || (isServer ? (PROXY_TARGET || 'http://localhost:8000/api') : '/backend');
const USE_MOCKS = process.env.NEXT_PUBLIC_API_MODE === 'mock';

// Backend uses request.build_absolute_uri() to construct file URLs (cover_file,
// pdf_file и т.д.), embedding whatever Host the request came in on. When we hit
// it via the Docker hostname (browser through /backend/* proxy or SSR fetch),
// those URLs come back as `http://backend:8000/...` and are unreachable from
// the browser. Node's fetch silently drops user-set Host headers (forbidden
// header), so we can't override at request time. Instead, strip the internal
// origin from JSON response bodies so URLs become relative (`/media/...`) and
// resolve against the page origin in the browser.
//
// Heuristic: only strip when the proxy target hostname has no dots — that
// signals an internal Docker hostname (e.g. `backend`). For public IPs/domains
// (`185.180.230.243`, `example.com`) URLs are reachable from the browser as-is,
// so leave them alone. This keeps `npm run dev` against a remote backend working.
const INTERNAL_ORIGIN = (() => {
  if (!PROXY_TARGET) return null;
  try {
    const u = new URL(PROXY_TARGET);
    return u.hostname.includes('.') ? null : u.origin;
  } catch { return null; }
})();

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
    const text = await res.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {
      // тело — не JSON, оставляем строку
    }
    throw new ApiError(res.status, `API error: ${res.status} ${res.statusText}`, body);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const cleaned = INTERNAL_ORIGIN ? text.split(INTERNAL_ORIGIN).join('') : text;
  return JSON.parse(cleaned) as T;
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

  // /users/me/ может ещё не существовать на бэке — возвращаем null при ошибке.
  getCurrentUser: async (): Promise<CurrentUser | null> => {
    try {
      return await fetchApi<CurrentUser>('/users/me/', { auth: true });
    } catch {
      return null;
    }
  },
};

// ── Admin API (auto-auth via localStorage) ──────────────────────

export interface IssueCreatePayload {
  year: number;
  number: number;
  sequential_number: number;
  sections_slugs?: string[];
  // ISO YYYY-MM-DD. На текущей версии бэка поле readOnly и игнорируется при
  // POST/PATCH (см. PatchedIssueRequest в swagger). Отправляем превентивно —
  // как только бэкенд откроет поле, ручной ввод даты заработает без
  // дополнительной правки фронта.
  published_date?: string | null;
}

export interface IssueUpdatePayload {
  year?: number;
  number?: number;
  sequential_number?: number;
  sections_slugs?: string[];
  published_date?: string | null;
}

export interface ArticleCreatePayload {
  issue_id?: number;
  // section_slug — writeOnly поле для привязки статьи к рубрике (см. ArticleRequest в swagger).
  section_slug: string;
  title: { ru: string; en?: string };
  authors: Author[];
  pages: string;
  doi: string;
  abstract: { ru: string; en: string };
  article_type: 'Scientific' | 'Review' | 'Book_review' | 'Editorial';
  keywords: { ru: string[]; en: string[] };
  udk: string;
  jel_codes?: string[];
  references: { ru: string; en: string }[] | null;
  received_date: string;
  accepted_date: string;
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
    // Бэк иногда отвечает HTTP 200 с error-телом (например, при сбое Celery/Redis
    // отправка уведомления падает уже после сохранения, но wrapper возвращает 200
    // с {status_code:null, error_type:"server_error", message:"..."}). Считаем
    // submission неуспешной, если в успешном теле виден маркер ошибки.
    return fetchApi<{ message: string; error_type?: string; status_code?: number | null }>(
      '/articles/upload_new_article/',
      { method: 'POST', body: fd }
    ).then((res) => {
      if (res.error_type) {
        throw new ApiError(500, `API error: ${res.message ?? res.error_type}`, res);
      }
      return res;
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
