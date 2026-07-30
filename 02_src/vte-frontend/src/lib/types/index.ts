// ── Localized content ───────────────────────────────────────────

export interface LocalizedString {
  ru: string;
  en?: string;
}

export interface LocalizedText {
  ru: string;
  en?: string;
}

// ── Enums (capitalized — match backend StatusEnum / ArticleTypeEnum) ──

export type ArticleType = 'Scientific' | 'Review' | 'Book_review' | 'Editorial';
export type IssueStatus = 'Draft' | 'Ready' | 'Published';

// ── Author ──────────────────────────────────────────────────────
// Структурированный автор статьи. Передаётся как массив на бэкенд
// в поле Article.authors (JSONField).

export interface Affiliation {
  organization_name: LocalizedString;
  position: LocalizedString;
}

export interface Author {
  full_name: LocalizedString;
  email: string;
  // Опциональное поле. На фронте `null` = «степени нет» (для удобства state);
  // в payload бэк не принимает null, поэтому buildPayload опускает ключ
  // `degree` целиком, если оба языка пустые.
  degree?: LocalizedString | null;
  affiliations: Affiliation[];
  orcid: string;
}

// ── Section ─────────────────────────────────────────────────────
// Фиксированный справочник рубрик (бэкенд автоматически подписывает все
// рубрики на новые номера). Фронт читает справочник через GET /api/sections/.
// Slug — транслитерация русского названия.

export interface Section {
  slug: string;
  name: LocalizedString;
}

// GET /api/sections/{slug}/ отдаёт рубрику вместе с полными объектами статей
// (в списке GET /api/sections/ поля articles нет).

export interface SectionFull extends Section {
  articles: Article[];
}

// ── Issue ───────────────────────────────────────────────────────

export interface IssueSummary {
  id: number;
  year: number;
  number: number;
  sequential_number: number;
  published_date: string | null;
  cover_file: string | null;
  pdf_file: string | null;
  status: IssueStatus;
  articles_count: number;
  sections?: IssueSection[];
}

// IssueFull — это Issue + список рубрик с уже встроенными статьями
// (бэкенд возвращает полные объекты Article в sections[].articles).

export interface IssueSection {
  slug: string;
  name: LocalizedString;
  articles: Article[];
}

export interface IssueFull extends IssueSummary {
  sections: IssueSection[];
}

// ── Article ─────────────────────────────────────────────────────
// authors — упрощённая модель: одна строка на язык
// section_name — локализованное название рубрики (без slug)

export interface Article {
  id: number;
  issue_id: number;
  issue_year: number | null;
  issue_number: number | null;
  issue_sequential_number: number | null;
  section_name: LocalizedString;
  title: LocalizedString;
  authors: Author[];
  pages: string;
  doi: string;
  pdf_file: string | null;
  pdf_size_kb: number | null;
  abstract: LocalizedText | null;
  article_type: ArticleType;
  keywords: { ru: string[]; en: string[] };
  udk: string;
  jel_codes: string[];
  // Бэкенд хранит литературу как массив объектов { ru, en } (по одной ссылке
  // на элемент) либо null. UI собирает этот массив из двух больших textarea,
  // режа по строкам — заказчик хочет именно блочный ввод, не поэлементный.
  references: { ru: string; en: string }[] | null;
  received_date: string | null;
  accepted_date: string | null;
  funding: LocalizedText;
  xml_url: string | null;
}

// Совместимость со старыми именами в коде (точечно используется в страницах)
export type ArticleSummary = Article;
export type ArticleFull = Article;

// ── EditorialBoardMember ────────────────────────────────────────

export interface EditorialBoardMember {
  id: number;
  full_name: LocalizedString;
  role: LocalizedString;
  degree: LocalizedString | null;
  affiliation: LocalizedString | null;
  email: string;
  spin_code: string | null;
  orcid: string;
  scopus_id: string | null;
  order: number;
}

// ── Pagination ──────────────────────────────────────────────────

export interface PaginatedArticleList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

// ── Auth ────────────────────────────────────────────────────────

export interface TokenPair {
  access: string;
  refresh: string;
}

// /users/me/ — текущий профиль авторизованного пользователя
export interface CurrentUser {
  id: number;
  login: string;
  role?: string;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string;
}

// ── Static page (фронтовый fallback, эндпоинта нет в бэкенде) ──

export interface StaticPage {
  slug: string;
  title: LocalizedString;
  content: LocalizedText;
}
