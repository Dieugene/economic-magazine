"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  Save,
  Trash2,
  Plus,
  X,
  Upload,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { articleFullData, sections } from "@/lib/api/mock/data";
import type { SectionSlug, ArticleType } from "@/lib/types";

// ── Form field styles ───────────────────────────────────────────
const inputClass =
  "w-full px-3 py-2 border border-stone-400 rounded-sm text-sm text-gray-700 bg-white focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;
const selectClass = inputClass;
const labelClass = "text-[13px] font-medium text-gray-600 mb-1.5 block";
const hintClass = "text-xs text-gray-500 mt-1";

// ── Types for form state ────────────────────────────────────────
interface AuthorForm {
  id: number;
  nameRu: string;
  nameEn: string;
  affiliationRu: string;
  affiliationEn: string;
  email: string;
  orcid: string;
}

interface RefForm {
  id: number;
  text: string;
}

// ── Pre-fill from mock data ─────────────────────────────────────
const data = articleFullData;
const pages = data.pages.split("-");

const initialAuthors: AuthorForm[] = data.authors.map((a, i) => ({
  id: i + 1,
  nameRu: a.full_name.ru,
  nameEn: a.full_name.en || "",
  affiliationRu: a.affiliation.ru,
  affiliationEn: a.affiliation.en || "",
  email: a.email || "",
  orcid: a.orcid || "",
}));

const initialRefsRu: RefForm[] = (data.references || []).slice(0, 3).map((r, i) => ({
  id: i + 1,
  text: r.text_ru,
}));

const initialRefsEn: RefForm[] = (data.references || []).slice(0, 3).map((r, i) => ({
  id: i + 1,
  text: r.text_en || "",
}));

// ── Language badge ──────────────────────────────────────────────
function LangBadge({ lang }: { lang: "RU" | "EN" }) {
  return (
    <span className="inline-block w-5 h-3 bg-white border border-gray-300 rounded-sm text-[9px] text-center leading-3 ml-1 font-normal text-gray-500">
      {lang}
    </span>
  );
}

// ── Page Component ──────────────────────────────────────────────
export default function ArticleCardPage() {
  // Basic info
  const [sectionSlug, setSectionSlug] = useState(data.section.slug);
  const [articleType, setArticleType] = useState(data.article_type);
  const [pageFrom, setPageFrom] = useState(pages[0] || "");
  const [pageTo, setPageTo] = useState(pages[1] || "");

  // Title
  const [titleRu, setTitleRu] = useState(data.title.ru);
  const [titleEn, setTitleEn] = useState(data.title.en || "Scientific Activity in the Digital Age: Production and Dissemination of Knowledge");

  // Authors
  const [authors, setAuthors] = useState<AuthorForm[]>(initialAuthors);
  const [nextAuthorId, setNextAuthorId] = useState(initialAuthors.length + 1);

  // Abstract
  const [abstractRu, setAbstractRu] = useState(data.abstract?.ru || "");
  const [abstractEn, setAbstractEn] = useState(data.abstract?.en || "");

  // Keywords
  const [keywordsRu, setKeywordsRu] = useState(
    data.keywords?.ru.join(", ") || ""
  );
  const [keywordsEn, setKeywordsEn] = useState(
    data.keywords?.en.join(", ") || ""
  );

  // Identifiers
  const [doi, setDoi] = useState(data.doi || "");
  const [udk, setUdk] = useState(data.udk || "");
  const [jelCodes, setJelCodes] = useState(
    data.jel_codes?.join(", ") || ""
  );

  // Dates
  const [receivedDate, setReceivedDate] = useState(data.received_date || "");
  const [acceptedDate, setAcceptedDate] = useState(data.accepted_date || "");

  // Funding
  const [funding, setFunding] = useState(data.funding?.ru || "");

  // References
  const [refsRu, setRefsRu] = useState<RefForm[]>(initialRefsRu);
  const [refsEn, setRefsEn] = useState<RefForm[]>(initialRefsEn);
  const [nextRefRuId, setNextRefRuId] = useState(initialRefsRu.length + 1);
  const [nextRefEnId, setNextRefEnId] = useState(initialRefsEn.length + 1);

  // XML URL
  const [xmlUrl, setXmlUrl] = useState(data.xml_url || "");

  // ── Author handlers ───────────────────────────────────────────
  function addAuthor() {
    setAuthors((prev) => [
      ...prev,
      {
        id: nextAuthorId,
        nameRu: "",
        nameEn: "",
        affiliationRu: "",
        affiliationEn: "",
        email: "",
        orcid: "",
      },
    ]);
    setNextAuthorId((n) => n + 1);
  }

  function removeAuthor(id: number) {
    setAuthors((prev) => prev.filter((a) => a.id !== id));
  }

  function updateAuthor(id: number, field: keyof AuthorForm, value: string) {
    setAuthors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  }

  // ── Reference handlers ────────────────────────────────────────
  function addRefRu() {
    setRefsRu((prev) => [...prev, { id: nextRefRuId, text: "" }]);
    setNextRefRuId((n) => n + 1);
  }

  function removeRefRu(id: number) {
    setRefsRu((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRefRu(id: number, text: string) {
    setRefsRu((prev) =>
      prev.map((r) => (r.id === id ? { ...r, text } : r))
    );
  }

  function addRefEn() {
    setRefsEn((prev) => [...prev, { id: nextRefEnId, text: "" }]);
    setNextRefEnId((n) => n + 1);
  }

  function removeRefEn(id: number) {
    setRefsEn((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRefEn(id: number, text: string) {
    setRefsEn((prev) =>
      prev.map((r) => (r.id === id ? { ...r, text } : r))
    );
  }

  // ── Save handler ──────────────────────────────────────────────
  function handleSave() {
    const formData = {
      sectionSlug,
      articleType,
      pages: `${pageFrom}-${pageTo}`,
      titleRu,
      titleEn,
      authors,
      abstractRu,
      abstractEn,
      keywordsRu,
      keywordsEn,
      doi,
      udk,
      jelCodes,
      receivedDate,
      acceptedDate,
      funding,
      refsRu,
      refsEn,
      xmlUrl,
    };
    console.log("Saving article:", formData);
  }

  return (
    <>
      {/* Override the admin layout header via a portal-like approach:
          We render our own breadcrumbs/actions in the page content area.
          The admin layout header is above us. We customize page content here. */}

      {/* Issue context bar */}
      <div className="bg-forest-50 border border-forest-200 rounded-sm p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <BookOpen className="w-5 h-5 text-forest-400" />
          <span className="text-forest-600 font-medium">
            Номер: № {data.issue_number} ({data.issue_sequential_number}) /{" "}
            {data.issue_year}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-600">
            Статус:{" "}
            <span className="text-copper-600 font-medium">Черновик</span>
          </span>
        </div>
        <span className="text-xs text-gray-600">Статья 1 из 12</span>
      </div>

      {/* Breadcrumbs + actions bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="text-xs text-gray-600 mb-1">
            <Link
              href="/admin/issues"
              className="hover:text-forest-600 transition-colors"
            >
              Номера
            </Link>
            <span className="mx-1">/</span>
            <Link
              href="/admin/issues/1"
              className="hover:text-forest-600 transition-colors"
            >
              № {data.issue_number} ({data.issue_sequential_number}) /{" "}
              {data.issue_year}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-forest-600 font-medium">Статья 1</span>
          </nav>
          <h1 className="text-lg font-semibold text-forest-600">
            Карточка статьи
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/article/${data.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-forest-600 transition-colors px-3 py-2 border border-gray-200 rounded-sm"
          >
            <Eye className="w-4 h-4" />
            Предпросмотр
          </Link>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-forest-600 px-4 py-2 rounded-sm hover:bg-forest-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>
      </div>

      <form
        className="space-y-8 max-w-5xl"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* ── Section 1: Basic info ──────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Основная информация
          </legend>
          <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="section-slug" className={labelClass}>Рубрика *</label>
              <select
                id="section-slug"
                className={selectClass}
                value={sectionSlug}
                onChange={(e) => setSectionSlug(e.target.value as SectionSlug)}
              >
                <option value="" disabled>
                  Выберите рубрику
                </option>
                {sections.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name.ru}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="article-type" className={labelClass}>Тип статьи *</label>
              <select
                id="article-type"
                className={selectClass}
                value={articleType}
                onChange={(e) => setArticleType(e.target.value as ArticleType)}
              >
                <option value="scientific">Научная статья</option>
                <option value="review">Обзор</option>
                <option value="book_review">Рецензия</option>
                <option value="editorial">От редактора</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Страницы *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className={inputClass}
                  placeholder="от"
                  aria-label="Страница от"
                  value={pageFrom}
                  onChange={(e) => setPageFrom(e.target.value)}
                />
                <span className="text-gray-500">&ndash;</span>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="до"
                  aria-label="Страница до"
                  value={pageTo}
                  onChange={(e) => setPageTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* ── Section 2: Title ───────────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Заглавие
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="title-ru" className={labelClass}>
                Название (русский) *
                <LangBadge lang="RU" />
              </label>
              <input
                id="title-ru"
                type="text"
                className={inputClass}
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="title-en" className={labelClass}>
                Название (английский) *
                <LangBadge lang="EN" />
              </label>
              <input
                id="title-en"
                type="text"
                className={inputClass}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* ── Section 3: Authors ─────────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Авторы
          </legend>
          <div className="p-5 pt-3">
            <div className="space-y-4">
              {authors.map((author, idx) => (
                <div
                  key={author.id}
                  className="border border-stone-400 rounded-sm p-4 bg-stone-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-forest-600 bg-forest-100 px-2 py-0.5 rounded">
                      Автор {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAuthor(author.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Удалить автора"
                      aria-label="Удалить автора"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`author-${author.id}-name-ru`} className={labelClass}>ФИО (русский) *</label>
                      <input
                        id={`author-${author.id}-name-ru`}
                        type="text"
                        className={inputClass}
                        placeholder="Фамилия Имя Отчество"
                        value={author.nameRu}
                        onChange={(e) =>
                          updateAuthor(author.id, "nameRu", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`author-${author.id}-name-en`} className={labelClass}>ФИО (английский) *</label>
                      <input
                        id={`author-${author.id}-name-en`}
                        type="text"
                        className={inputClass}
                        placeholder="Name Surname"
                        value={author.nameEn}
                        onChange={(e) =>
                          updateAuthor(author.id, "nameEn", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`author-${author.id}-affiliation-ru`} className={labelClass}>
                        Аффилиация (русский) *
                      </label>
                      <input
                        id={`author-${author.id}-affiliation-ru`}
                        type="text"
                        className={inputClass}
                        placeholder="Организация, должность, степень"
                        value={author.affiliationRu}
                        onChange={(e) =>
                          updateAuthor(
                            author.id,
                            "affiliationRu",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`author-${author.id}-affiliation-en`} className={labelClass}>
                        Аффилиация (английский)
                      </label>
                      <input
                        id={`author-${author.id}-affiliation-en`}
                        type="text"
                        className={inputClass}
                        placeholder="Organization, position, degree"
                        value={author.affiliationEn}
                        onChange={(e) =>
                          updateAuthor(
                            author.id,
                            "affiliationEn",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`author-${author.id}-email`} className={labelClass}>Email</label>
                      <input
                        id={`author-${author.id}-email`}
                        type="email"
                        className={inputClass}
                        placeholder="email@example.com"
                        value={author.email}
                        onChange={(e) =>
                          updateAuthor(author.id, "email", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`author-${author.id}-orcid`} className={labelClass}>ORCID</label>
                      <input
                        id={`author-${author.id}-orcid`}
                        type="text"
                        className={inputClass}
                        placeholder="0000-0000-0000-0000"
                        value={author.orcid}
                        onChange={(e) =>
                          updateAuthor(author.id, "orcid", e.target.value)
                        }
                      />
                      <p className={hintClass}>
                        Формат: 0000-0000-0000-0000
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addAuthor}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest-600 border border-dashed border-forest-300 rounded-sm px-4 py-2 hover:bg-forest-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить автора
            </button>
          </div>
        </fieldset>

        {/* ── Section 4: Abstract ────────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Аннотация
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="abstract-ru" className={labelClass}>
                Аннотация (русский) *
                <LangBadge lang="RU" />
              </label>
              <textarea
                id="abstract-ru"
                className={textareaClass}
                rows={4}
                value={abstractRu}
                onChange={(e) => setAbstractRu(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="abstract-en" className={labelClass}>
                Аннотация (английский) *
                <LangBadge lang="EN" />
              </label>
              <textarea
                id="abstract-en"
                className={textareaClass}
                rows={4}
                value={abstractEn}
                onChange={(e) => setAbstractEn(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* ── Section 5: Keywords ────────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Ключевые слова
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="keywords-ru" className={labelClass}>Ключевые слова (русский) *</label>
              <input
                id="keywords-ru"
                type="text"
                className={inputClass}
                value={keywordsRu}
                onChange={(e) => setKeywordsRu(e.target.value)}
              />
              <p className={hintClass}>Разделяйте запятой</p>
            </div>
            <div>
              <label htmlFor="keywords-en" className={labelClass}>
                Ключевые слова (английский) *
              </label>
              <input
                id="keywords-en"
                type="text"
                className={inputClass}
                value={keywordsEn}
                onChange={(e) => setKeywordsEn(e.target.value)}
              />
              <p className={hintClass}>Separate with commas</p>
            </div>
          </div>
        </fieldset>

        {/* ── Section 6: Identifiers ─────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Идентификаторы и коды
          </legend>
          <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="doi" className={labelClass}>DOI *</label>
              <input
                id="doi"
                type="text"
                className={inputClass}
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="udk" className={labelClass}>УДК</label>
              <input
                id="udk"
                type="text"
                className={inputClass}
                value={udk}
                onChange={(e) => setUdk(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="jel-codes" className={labelClass}>JEL-коды</label>
              <input
                id="jel-codes"
                type="text"
                className={inputClass}
                value={jelCodes}
                onChange={(e) => setJelCodes(e.target.value)}
              />
              <p className={hintClass}>Через запятую</p>
            </div>
          </div>
        </fieldset>

        {/* ── Section 7: Dates ───────────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Даты
          </legend>
          <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="received-date" className={labelClass}>Дата получения</label>
              <input
                id="received-date"
                type="date"
                className={inputClass}
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="accepted-date" className={labelClass}>Дата принятия в печать</label>
              <input
                id="accepted-date"
                type="date"
                className={inputClass}
                value={acceptedDate}
                onChange={(e) => setAcceptedDate(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* ── Section 8: Funding ─────────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Финансирование
          </legend>
          <div className="p-5 pt-3">
            <div>
              <label htmlFor="funding" className={labelClass}>Источники финансирования</label>
              <textarea
                id="funding"
                className={textareaClass}
                rows={2}
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* ── Section 9: Bibliography ────────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Библиография
          </legend>
          <div className="p-5 pt-3 space-y-5">
            {/* Russian references */}
            <div>
              <label className={labelClass}>Литература (русский)</label>
              <div className="space-y-2 mb-3">
                {refsRu.map((ref, idx) => (
                  <div key={ref.id} className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 mt-2.5 w-5 text-right flex-shrink-0">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      className={`${inputClass} flex-1`}
                      value={ref.text}
                      onChange={(e) => updateRefRu(ref.id, e.target.value)}
                      placeholder="Введите библиографическую ссылку..."
                      aria-label={`Ссылка ${idx + 1} (русский)`}
                    />
                    <button
                      type="button"
                      onClick={() => removeRefRu(ref.id)}
                      className="mt-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Удалить ссылку"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRefRu}
                className="inline-flex items-center gap-1.5 text-xs text-forest-600 hover:text-forest-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить ссылку
              </button>
            </div>

            {/* English references */}
            <div className="border-t border-gray-100 pt-5">
              <label className={labelClass}>References (английский)</label>
              <div className="space-y-2 mb-3">
                {refsEn.map((ref, idx) => (
                  <div key={ref.id} className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 mt-2.5 w-5 text-right flex-shrink-0">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      className={`${inputClass} flex-1`}
                      value={ref.text}
                      onChange={(e) => updateRefEn(ref.id, e.target.value)}
                      placeholder="Enter bibliographic reference..."
                      aria-label={`Reference ${idx + 1} (English)`}
                    />
                    <button
                      type="button"
                      onClick={() => removeRefEn(ref.id)}
                      className="mt-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Удалить ссылку"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRefEn}
                className="inline-flex items-center gap-1.5 text-xs text-forest-600 hover:text-forest-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить ссылку
              </button>
            </div>
          </div>
        </fieldset>

        {/* ── Section 10: Files & links ──────────────────────────── */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Файлы и ссылки
          </legend>
          <div className="p-5 pt-3 space-y-5">
            <div>
              <label className={labelClass}>PDF статьи</label>
              <div className="border-2 border-dashed border-stone-400 rounded-sm p-6 text-center hover:border-forest-300 transition-colors cursor-pointer bg-stone-50">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Перетащите файл или{" "}
                  <span className="text-forest-600 font-medium">
                    выберите
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, максимум 50 МБ
                </p>
              </div>
              {/* Uploaded file preview */}
              <div className="mt-3 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-sm">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-green-800 font-medium truncate">
                    vte_2026_1_rubinshtein_chukovskaya.pdf
                  </p>
                  <p className="text-xs text-green-700">
                    {data.pdf_size_kb} КБ
                  </p>
                </div>
                <button
                  type="button"
                  className="text-green-400 hover:text-red-500 transition-colors"
                  aria-label="Удалить файл"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="xml-url" className={labelClass}>Ссылка на XML (JATS)</label>
              <input
                id="xml-url"
                type="url"
                className={inputClass}
                placeholder="https://journals.rcsi.science/..."
                value={xmlUrl}
                onChange={(e) => setXmlUrl(e.target.value)}
              />
              <p className={hintClass}>Ссылка на XML в системе РЦНИ</p>
            </div>
          </div>
        </fieldset>

        {/* ── Bottom action bar ──────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Удалить статью
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-forest-600 px-5 py-2.5 rounded-sm hover:bg-forest-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Сохранить статью
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
