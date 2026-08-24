import type {
  IssueSummary,
  IssueFull,
  Article,
  Author,
  Section,
  SectionFull,
  EditorialBoardMember,
  PaginatedArticleList,
  TokenPair,
  CurrentUser,
  StaticPage,
  IssueStatus,
} from '@/lib/types';
import { filenameFromDisposition } from './files';

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

// Бэк ротирует refresh-токен при каждом /auth/refresh/, поэтому параллельные
// 401-обновления гарантированно сломают друг друга. Держим один inflight
// promise — все одновременные запросы ждут общий результат.
let refreshInflight: Promise<RefreshOutcome> | null = null;

// Исход обновления. Разделять 'rejected' и 'unreachable' обязательно: на первом
// мы стираем токены, и если сюда попадёт обычный сетевой сбой, то один
// неудавшийся запрос выбросит редактора из админки, уничтожив живой refresh
// (он действует неделю). Отказ засчитываем только когда его вынес сам бэк.
type RefreshOutcome = 'ok' | 'rejected' | 'unreachable';

async function doRefreshTokens(): Promise<RefreshOutcome> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return 'rejected';
  try {
    const res = await rawFetch('/auth/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (res.ok) {
      const data = (await res.json()) as TokenPair;
      tokenStore.set(data);
      return 'ok';
    }
    // 5xx и 502/504 от прокси — про состояние бэка, а не про токен
    return res.status >= 500 ? 'unreachable' : 'rejected';
  } catch {
    // fetch бросает только на транспорте: сеть, DNS, обрыв
    return 'unreachable';
  }
}

function tryRefreshTokens(): Promise<RefreshOutcome> {
  if (!refreshInflight) {
    refreshInflight = doRefreshTokens().finally(() => {
      refreshInflight = null;
    });
  }
  return refreshInflight;
}

// При окончательной потере авторизации (refresh истёк или его нет) выкидываем
// пользователя в /control/login. Только из-под /control — публичные страницы
// 401 не получают, а если получили — это не повод их редиректить.
function redirectToLoginIfAdmin() {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname;
  if (path.startsWith('/control') && !path.startsWith('/control/login')) {
    window.location.href = '/control/login';
  }
}

// Auto-refresh поток для защищённых эндпоинтов:
//   401 + есть refresh → пробуем обновить → retry оригинальный запрос.
//   Если retry снова 401 ИЛИ refresh не удался ИЛИ refresh-токена не было —
//   деавторизация и редирект в /control/login.
//
// Вынесено из fetchApi, потому что тем же потоком ходят бинарные загрузки
// (PDF выпуска и статьи), которым JSON-разбор не нужен, но авто-refresh нужен
// ровно так же: access живёт 15 часов, а рабочая вкладка — дольше, и без
// обновления скачивание молча провалилось бы посреди работы.
async function fetchWithAuthRetry(
  path: string,
  init: RequestInit,
  headers: Headers
): Promise<Response> {
  let res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status !== 401) return res;

  const outcome = await tryRefreshTokens();
  if (outcome === 'ok') {
    const newToken = tokenStore.getAccess();
    if (newToken) headers.set('Authorization', `Bearer ${newToken}`);
    res = await fetch(`${API_BASE}${path}`, { ...init, headers });
    if (res.status !== 401) return res;
  } else if (outcome === 'unreachable') {
    // Бэк не ответил — судить о токенах не по чему, оставляем их жить
    return res;
  }

  tokenStore.clear();
  redirectToLoginIfAdmin();
  return res;
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

  const res = needAuth
    ? await fetchWithAuthRetry(path, init, headers)
    : await fetch(`${API_BASE}${path}`, { ...init, headers });

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

// Самый свежий выпуск: год по убыванию, внутри года — больший номер.
// Отдельно от sortIssues (lib/utils/issues.ts): там порядок показа в архиве,
// здесь — выбор одного выпуска, и правила у них разные.
function latestOf(issues: IssueSummary[]): IssueSummary {
  return [...issues].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.number - a.number;
  })[0];
}

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
    // ⚠️ /issues/ без фильтра отдаёт 6,74 МБ — весь архив со всеми статьями и
    // аннотациями, — хотя главной нужен ровно один выпуск. Выбора полей и
    // пагинации бэк не поддерживает (?fields, ?omit, ?page_size, ?limit,
    // ?ordering он игнорирует, ответ байт в байт тот же); единственный
    // работающий фильтр — year, и он же режет ответ до ~0,5 МБ.
    //
    // Пустой год стоит 2 байта и 0,03 с, поэтому идём по годам подряд.
    // Начинаем со следующего: выпуск могут опубликовать с датой вперёд, и
    // спрашивать только текущий год значило бы такой выпуск не увидеть.
    const currentYear = new Date().getFullYear();
    for (const year of [currentYear + 1, currentYear, currentYear - 1]) {
      const issues = await api.getIssues(year);
      if (issues.length > 0) return latestOf(issues);
    }
    // Три года подряд пусто — журнал давно не выходил либо год на сервере
    // отличается от нашего. Тогда уже честно смотрим весь список.
    const all = await api.getIssues();
    return all.length > 0 ? latestOf(all) : null;
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
  // Detail-эндпоинт уже отдаёт статьи рубрики (SectionFull.articles).
  // Отдельного /sections/{slug}/articles/ на бэке нет — он отвечает 404.
  getSection: (slug: string) => fetchApi<SectionFull>(`/sections/${slug}/`),

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

  // Шаблон оформления статьи — публичный файл, кнопка на него стоит только на
  // публичной странице подачи. Заголовок Authorization сюда не ставим намеренно:
  // бэк отклоняет любой запрос с недействительным Bearer на стадии
  // аутентификации, ещё до проверки прав, и открытый эндпоинт отвечает 401.
  // Токен же в localStorage переживает вкладку и рабочий день, так что редактор,
  // заходивший в админку накануне, ломал себе публичную кнопку.
  downloadTemplate: async (): Promise<{ blob: Blob; filename: string | null }> => {
    const res = await fetch(`${API_BASE}/articles/download_template/`);
    if (!res.ok) {
      throw new ApiError(res.status, `API error: ${res.status} ${res.statusText}`);
    }
    return {
      blob: await res.blob(),
      filename: filenameFromDisposition(res.headers.get('Content-Disposition')),
    };
  },

  // Скачивание файла из-под авторизации. Нужно там, где материал ещё не
  // опубликован: бэк отдаёт такие файлы только по токену, а обычная навигация
  // по <a href> заголовок Authorization не несёт — токен лежит в localStorage.
  downloadProtectedFile: async (
    path: string
  ): Promise<{ blob: Blob; filename: string | null }> => {
    const headers = new Headers();
    const token = tokenStore.getAccess();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const res = await fetchWithAuthRetry(path, {}, headers);
    if (!res.ok) {
      // Тело читаем так же, как в fetchApi: у файловых эндпоинтов отказ приходит
      // осмысленным текстом («номер не опубликован»), и без него на экране
      // осталась бы только цифра статуса.
      const text = await res.text();
      let body: unknown = text;
      try {
        body = JSON.parse(text);
      } catch {
        // тело — не JSON, оставляем строку
      }
      throw new ApiError(res.status, `API error: ${res.status} ${res.statusText}`, body);
    }
    return {
      blob: await res.blob(),
      filename: filenameFromDisposition(res.headers.get('Content-Disposition')),
    };
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
