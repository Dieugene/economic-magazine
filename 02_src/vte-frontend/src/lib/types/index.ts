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

// ── Reference ───────────────────────────────────────────────────

export interface Reference {
  order: number;
  text_ru: string;
  text_en: string;
}

// ── Section ─────────────────────────────────────────────────────
// Slug — произвольная строка (рубрики управляются через API,
// в БД сейчас транслитерация русского).

export interface Section {
  slug: string;
  name: LocalizedString;
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
  article_count: number;
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
  authors: LocalizedString;
  pages: string;
  doi: string;
  pdf_file: string | null;
  pdf_size_kb: number | null;
  abstract: LocalizedText | null;
  article_type: ArticleType;
  keywords: { ru: string[]; en: string[] };
  udk: string;
  jel_codes: string[];
  references: Reference[];
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
