"use client";

import { useEffect, useRef, useState } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Save,
  Trash2,
  Plus,
  X,
  Upload,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { adminApi, api, ApiError, type ArticleCreatePayload } from "@/lib/api/client";
import type { Article, ArticleType, Section } from "@/lib/types";
import DocumentTitle from "@/components/public/DocumentTitle";

const inputClass =
  "w-full px-3 py-2 border border-stone-400 rounded-sm text-sm text-gray-700 bg-white focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;
const selectClass = inputClass;
const labelClass = "text-[13px] font-medium text-gray-600 mb-1.5 block";
const hintClass = "text-xs text-gray-500 mt-1";

interface RefForm {
  id: number;
  text_ru: string;
  text_en: string;
}

const ARTICLE_TYPES: { value: ArticleType; label: string }[] = [
  { value: "Scientific", label: "Научная статья" },
  { value: "Review", label: "Обзор" },
  { value: "Book_review", label: "Рецензия" },
  { value: "Editorial", label: "От редактора" },
];

function LangBadge({ lang }: { lang: "RU" | "EN" }) {
  return (
    <span className="inline-block w-5 h-3 bg-white border border-gray-300 rounded-sm text-[9px] text-center leading-3 ml-1 font-normal text-gray-500">
      {lang}
    </span>
  );
}

export default function ArticleFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = id === "new";
  const articleId = isNew ? null : Number(id);
  const initialIssueId = searchParams.get("issue_id");

  const [sections, setSections] = useState<Section[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [busy, setBusy] = useState(false);

  // Form state
  const [issueId, setIssueId] = useState<number>(initialIssueId ? Number(initialIssueId) : 0);
  const [sectionSlug, setSectionSlug] = useState<string>("");
  const [articleType, setArticleType] = useState<ArticleType>("Scientific");
  const [titleRu, setTitleRu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [authorsRu, setAuthorsRu] = useState("");
  const [authorsEn, setAuthorsEn] = useState("");
  const [abstractRu, setAbstractRu] = useState("");
  const [abstractEn, setAbstractEn] = useState("");
  const [keywordsRu, setKeywordsRu] = useState("");
  const [keywordsEn, setKeywordsEn] = useState("");
  const [doi, setDoi] = useState("");
  const [udk, setUdk] = useState("");
  const [jelCodes, setJelCodes] = useState("");
  const [fundingRu, setFundingRu] = useState("");
  const [fundingEn, setFundingEn] = useState("");
  const [xmlUrl, setXmlUrl] = useState("");
  const [refs, setRefs] = useState<RefForm[]>([]);
  const [nextRefId, setNextRefId] = useState(1);

  // PDF upload
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  async function loadSections() {
    try {
      const data = await api.getSections();
      setSections(data);
    } catch {
      // sections list optional
    }
  }

  async function loadArticle() {
    if (!articleId) return;
    try {
      const data = await adminApi.getArticle(articleId);
      setArticle(data);
      setIssueId(data.issue_id);
      setArticleType(data.article_type);
      setTitleRu(data.title.ru ?? "");
      setTitleEn(data.title.en ?? "");
      setAuthorsRu(data.authors.ru ?? "");
      setAuthorsEn(data.authors.en ?? "");
      setAbstractRu(data.abstract?.ru ?? "");
      setAbstractEn(data.abstract?.en ?? "");
      setKeywordsRu(data.keywords?.ru?.join(", ") ?? "");
      setKeywordsEn(data.keywords?.en?.join(", ") ?? "");
      setDoi(data.doi ?? "");
      setUdk(data.udk ?? "");
      setJelCodes(data.jel_codes?.join(", ") ?? "");
      setFundingRu(data.funding?.ru ?? "");
      setFundingEn(data.funding?.en ?? "");
      setXmlUrl(data.xml_url ?? "");
      setRefs(
        (data.references ?? []).map((r, i) => ({
          id: i + 1,
          text_ru: r.text_ru,
          text_en: r.text_en,
        }))
      );
      setNextRefId((data.references?.length ?? 0) + 1);
      setLoadError("");
    } catch (e) {
      setLoadError(e instanceof ApiError ? e.message : "Ошибка загрузки статьи");
    }
  }

  useEffect(() => {
    loadSections();
    if (!isNew) loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  // When sections load, set the dropdown value to match the article's section
  useEffect(() => {
    if (article && sections.length > 0 && !sectionSlug) {
      const match = sections.find(
        (s) => s.name.ru === article.section_name?.ru
      );
      if (match) setSectionSlug(match.slug);
    }
  }, [article, sections, sectionSlug]);

  function addRef() {
    setRefs((prev) => [...prev, { id: nextRefId, text_ru: "", text_en: "" }]);
    setNextRefId((n) => n + 1);
  }
  function removeRef(rid: number) {
    setRefs((prev) => prev.filter((r) => r.id !== rid));
  }
  function updateRef(rid: number, field: "text_ru" | "text_en", value: string) {
    setRefs((prev) => prev.map((r) => (r.id === rid ? { ...r, [field]: value } : r)));
  }

  function buildPayload(): ArticleCreatePayload | null {
    const section = sections.find((s) => s.slug === sectionSlug);
    if (!section) {
      setSaveError("Выберите рубрику");
      return null;
    }
    if (!issueId) {
      setSaveError("Не указан ID номера");
      return null;
    }
    return {
      issue_id: issueId,
      section_name: {
        ru: section.name.ru,
        ...(section.name.en ? { en: section.name.en } : {}),
      },
      title: { ru: titleRu, ...(titleEn ? { en: titleEn } : {}) },
      authors: { ru: authorsRu, ...(authorsEn ? { en: authorsEn } : {}) },
      doi,
      abstract:
        abstractRu || abstractEn
          ? { ru: abstractRu, ...(abstractEn ? { en: abstractEn } : {}) }
          : null,
      article_type: articleType,
      keywords: {
        ru: keywordsRu.split(",").map((s) => s.trim()).filter(Boolean),
        en: keywordsEn.split(",").map((s) => s.trim()).filter(Boolean),
      },
      udk,
      jel_codes: jelCodes.split(",").map((s) => s.trim()).filter(Boolean),
      references: refs
        .filter((r) => r.text_ru || r.text_en)
        .map((r, i) => ({ order: i + 1, text_ru: r.text_ru, text_en: r.text_en })),
      funding: fundingRu || fundingEn
        ? { ru: fundingRu, ...(fundingEn ? { en: fundingEn } : {}) }
        : undefined,
      xml_url: xmlUrl || null,
    };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaveError("");
    const payload = buildPayload();
    if (!payload) {
      setBusy(false);
      return;
    }
    try {
      if (isNew) {
        const created = await adminApi.createArticle(payload);
        router.replace(`/admin/articles/${created.id}`);
      } else {
        await adminApi.updateArticle(articleId!, payload);
        await loadArticle();
      }
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!articleId) return;
    if (!confirm("Удалить статью?")) return;
    setBusy(true);
    try {
      await adminApi.deleteArticle(articleId);
      router.push(`/admin/issues/${issueId}`);
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Ошибка удаления");
      setBusy(false);
    }
  }

  async function handlePdfUpload(file: File) {
    if (!articleId) {
      setSaveError("Сначала сохраните статью");
      return;
    }
    setPdfBusy(true);
    setSaveError("");
    try {
      await adminApi.uploadArticleReadyPdf(articleId, file);
      await loadArticle();
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Ошибка загрузки PDF");
    } finally {
      setPdfBusy(false);
    }
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  return (
    <>
      <DocumentTitle
        ru={isNew ? "Новая статья" : "Карточка статьи"}
        en={isNew ? "New Article" : "Article Form"}
      />

      {/* Issue context bar */}
      <div className="bg-forest-50 border border-forest-200 rounded-sm p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <BookOpen className="w-5 h-5 text-forest-400" />
          <span className="text-forest-600 font-medium">
            {article ? (
              <>
                Номер: № {article.issue_number} ({article.issue_sequential_number}) /{" "}
                {article.issue_year}
              </>
            ) : (
              <>Новая статья {issueId ? `для номера #${issueId}` : ""}</>
            )}
          </span>
        </div>
      </div>

      {/* Breadcrumbs + actions */}
      <div className="flex items-center justify-between mb-6">
        <nav className="text-xs text-gray-600 flex items-center gap-1">
          <Link href="/admin/issues" className="hover:text-forest-600">
            Номера
          </Link>
          <ChevronRight className="w-3 h-3" />
          {issueId ? (
            <Link href={`/admin/issues/${issueId}`} className="hover:text-forest-600">
              Номер #{issueId}
            </Link>
          ) : (
            <span>Номер</span>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-forest-600 font-medium">
            {isNew ? "Новая статья" : `Статья #${articleId}`}
          </span>
        </nav>
        <div className="flex items-center gap-3">
          {!isNew && articleId && (
            <Link
              href={`/article/${articleId}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-forest-600 transition-colors px-3 py-2 border border-gray-200 rounded-sm"
            >
              <Eye className="w-4 h-4" />
              Предпросмотр
            </Link>
          )}
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors px-3 py-2 border border-red-200 rounded-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Удалить
            </button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {saveError}
        </div>
      )}

      <form className="space-y-8 max-w-5xl" onSubmit={handleSave}>
        {/* Section 1: Basic info */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Основная информация
          </legend>
          <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="issue-id" className={labelClass}>ID номера *</label>
              <input
                id="issue-id"
                type="number"
                className={inputClass}
                value={issueId || ""}
                onChange={(e) => setIssueId(Number(e.target.value))}
                disabled={!isNew}
                required
              />
            </div>
            <div>
              <label htmlFor="section-slug" className={labelClass}>Рубрика *</label>
              <select
                id="section-slug"
                className={selectClass}
                value={sectionSlug}
                onChange={(e) => setSectionSlug(e.target.value)}
                required
              >
                <option value="" disabled>Выберите рубрику</option>
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
                {ARTICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Section 2: Title */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Заглавие
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="title-ru" className={labelClass}>
                Название (русский) *<LangBadge lang="RU" />
              </label>
              <input
                id="title-ru"
                type="text"
                className={inputClass}
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="title-en" className={labelClass}>
                Название (английский)<LangBadge lang="EN" />
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

        {/* Section 3: Authors */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Авторы
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="authors-ru" className={labelClass}>
                Авторы (русский) *<LangBadge lang="RU" />
              </label>
              <textarea
                id="authors-ru"
                className={textareaClass}
                rows={2}
                placeholder="И.И. Иванов, П.П. Петров"
                value={authorsRu}
                onChange={(e) => setAuthorsRu(e.target.value)}
                required
              />
              <p className={hintClass}>Перечислите всех авторов через запятую</p>
            </div>
            <div>
              <label htmlFor="authors-en" className={labelClass}>
                Authors (English)<LangBadge lang="EN" />
              </label>
              <textarea
                id="authors-en"
                className={textareaClass}
                rows={2}
                placeholder="I.I. Ivanov, P.P. Petrov"
                value={authorsEn}
                onChange={(e) => setAuthorsEn(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* Section 4: Abstract */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Аннотация
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="abstract-ru" className={labelClass}>
                Аннотация (русский)<LangBadge lang="RU" />
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
                Аннотация (английский)<LangBadge lang="EN" />
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

        {/* Section 5: Keywords */}
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
              <label htmlFor="keywords-en" className={labelClass}>Ключевые слова (английский) *</label>
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

        {/* Section 6: Identifiers */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Идентификаторы и коды
          </legend>
          <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="doi" className={labelClass}>DOI *</label>
              <input
                id="doi"
                type="text"
                className={inputClass}
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.52342/2587-7666VTE_..."
                required
              />
            </div>
            <div>
              <label htmlFor="udk" className={labelClass}>УДК *</label>
              <input
                id="udk"
                type="text"
                className={inputClass}
                value={udk}
                onChange={(e) => setUdk(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="jel" className={labelClass}>JEL коды</label>
              <input
                id="jel"
                type="text"
                className={inputClass}
                value={jelCodes}
                onChange={(e) => setJelCodes(e.target.value)}
                placeholder="A11, D83, O33"
              />
            </div>
          </div>
        </fieldset>

        {/* Section 7: Funding */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Финансирование
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="funding-ru" className={labelClass}>
                Источник финансирования (русский)<LangBadge lang="RU" />
              </label>
              <textarea
                id="funding-ru"
                className={textareaClass}
                rows={2}
                value={fundingRu}
                onChange={(e) => setFundingRu(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="funding-en" className={labelClass}>
                Funding (English)<LangBadge lang="EN" />
              </label>
              <textarea
                id="funding-en"
                className={textareaClass}
                rows={2}
                value={fundingEn}
                onChange={(e) => setFundingEn(e.target.value)}
              />
            </div>
          </div>
        </fieldset>

        {/* Section 8: References */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Литература / References
          </legend>
          <div className="p-5 pt-3 space-y-3">
            {refs.map((ref, idx) => (
              <div key={ref.id} className="border border-stone-300 rounded p-3 bg-stone-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">№ {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeRef(ref.id)}
                    className="text-gray-400 hover:text-red-600"
                    aria-label="Удалить запись"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <textarea
                    className={textareaClass}
                    rows={2}
                    placeholder="Текст ссылки на русском"
                    value={ref.text_ru}
                    onChange={(e) => updateRef(ref.id, "text_ru", e.target.value)}
                  />
                  <textarea
                    className={textareaClass}
                    rows={2}
                    placeholder="Reference text in English"
                    value={ref.text_en}
                    onChange={(e) => updateRef(ref.id, "text_en", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRef}
              className="inline-flex items-center gap-1.5 text-sm text-forest-600 border border-dashed border-forest-300 rounded px-3 py-2 hover:bg-forest-50"
            >
              <Plus className="w-4 h-4" />
              Добавить ссылку
            </button>
          </div>
        </fieldset>

        {/* Section 9: XML URL + PDF upload */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Файлы и внешние ссылки
          </legend>
          <div className="p-5 pt-3 space-y-4">
            <div>
              <label htmlFor="xml-url" className={labelClass}>URL XML (JATS)</label>
              <input
                id="xml-url"
                type="url"
                className={inputClass}
                value={xmlUrl}
                onChange={(e) => setXmlUrl(e.target.value)}
                placeholder="https://journals.rcsi.science/..."
              />
            </div>
            {!isNew && (
              <div>
                <label className={labelClass}>PDF статьи</label>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                />
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={pdfBusy}
                  className="inline-flex items-center gap-2 text-sm border border-stone-400 rounded px-4 py-2 hover:bg-stone-50 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {pdfBusy ? "Загрузка..." : "Загрузить PDF"}
                </button>
                {article?.pdf_file && (
                  <p className={`${hintClass} mt-2`}>
                    Текущий файл:{" "}
                    <a
                      href={article.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forest-600 underline"
                    >
                      {article.pdf_file.split("/").pop()}
                    </a>
                    {article.pdf_size_kb && ` (${article.pdf_size_kb} КБ)`}
                  </p>
                )}
              </div>
            )}
            {isNew && (
              <p className="text-xs text-gray-500">
                PDF можно будет загрузить после первого сохранения статьи.
              </p>
            )}
          </div>
        </fieldset>

        {/* Bottom action bar */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-forest-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {busy ? "Сохраняем..." : isNew ? "Создать статью" : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </>
  );
}
