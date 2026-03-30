// Localized content
export interface LocalizedString {
  ru: string;
  en?: string;
}

export interface LocalizedText {
  ru: string;
  en?: string;
}

// Enums
export type ArticleType = 'scientific' | 'review' | 'book_review' | 'editorial';
export type SectionSlug = 'economic-theory' | 'methodology' | 'theory-to-policy' | 'history-of-thought' | 'interdisciplinary' | 'economic-history' | 'reviews';
export type IssueStatus = 'draft' | 'ready' | 'published';
export type Lang = 'ru' | 'en';

// Entities
export interface Author {
  id: number;
  full_name: LocalizedString;
  affiliation: LocalizedString;
  email?: string | null;
  orcid?: string | null;
}

export interface Section {
  slug: SectionSlug;
  name: LocalizedString;
}

export interface Reference {
  id: number;
  text_ru: string;
  text_en?: string;
  order: number;
}

export interface IssueSummary {
  id: number;
  year: number;
  number: number;
  sequential_number: number;
  published_date: string;
  cover_url?: string | null;
  full_pdf_url?: string | null;
  status: IssueStatus;
  article_count: number;
}

export interface ArticleSummary {
  id: number;
  title: LocalizedString;
  authors: Author[];
  section: Section;
  pages: string;
  doi?: string | null;
  pdf_url?: string | null;
  pdf_size_kb?: number | null;
  abstract?: LocalizedText | null;
  article_type: ArticleType;
  issue_id: number;
  issue_year: number;
  issue_number: number;
  issue_sequential_number: number;
}

export interface IssueFull extends IssueSummary {
  sections: {
    section: Section;
    articles: ArticleSummary[];
  }[];
}

export interface ArticleFull extends ArticleSummary {
  keywords?: { ru: string[]; en: string[] };
  udk?: string | null;
  jel_codes?: string[];
  references?: Reference[];
  received_date?: string | null;
  accepted_date?: string | null;
  funding?: LocalizedText | null;
  xml_url?: string | null;
}

export interface EditorialBoardMember {
  id: number;
  full_name: LocalizedString;
  role?: string | null;
  degree?: LocalizedString;
  affiliation?: LocalizedString;
  email?: string | null;
  spin_code?: string | null;
  orcid?: string | null;
  scopus_id?: string | null;
  order: number;
}
