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
  Upload,
  FileCode,
  ChevronRight,
  BookOpen,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, api, type ArticleCreatePayload } from "@/lib/api/client";
import { parseApiError } from "@/lib/api/errors";
import { articleJatsXml, articlePdfLink, fileNameFromUrl } from "@/lib/api/files";
import { findOverlaps } from "@/lib/utils/pages";
import { looksLikeXml, saveBlobAsFile } from "@/lib/utils/download";
import type { Article, ArticleType, Author, Affiliation, Section } from "@/lib/types";
import DocumentTitle from "@/components/public/DocumentTitle";
import PdfDownloadLink from "@/components/PdfDownloadLink";

const inputClass =
  "w-full px-3 py-2 border border-stone-400 rounded-sm text-sm text-gray-700 bg-white focus:outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10";
const textareaClass = `${inputClass} resize-y min-h-[80px]`;
const selectClass = inputClass;
const labelClass = "text-[13px] font-medium text-gray-600 mb-1.5 block";
const hintClass = "text-xs text-gray-500 mt-1";

const emptyAffiliation = (): Affiliation => ({
  organization_name: { ru: "", en: "" },
  position: { ru: "", en: "" },
});

const emptyAuthor = (): Author => ({
  full_name: { ru: "", en: "" },
  email: "",
  affiliations: [emptyAffiliation()],
  orcid: "",
});

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
  const [busy, setBusy] = useState(false);

  // Form state
  const [issueId, setIssueId] = useState<number>(initialIssueId ? Number(initialIssueId) : 0);
  const [sectionSlug, setSectionSlug] = useState<string>("");
  const [articleType, setArticleType] = useState<ArticleType>("Scientific");
  const [titleRu, setTitleRu] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [abstractRu, setAbstractRu] = useState("");
  const [abstractEn, setAbstractEn] = useState("");
  const [keywordsRu, setKeywordsRu] = useState("");
  const [keywordsEn, setKeywordsEn] = useState("");
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [udk, setUdk] = useState("");
  const [jelCodes, setJelCodes] = useState("");
  const [fundingRu, setFundingRu] = useState("");
  const [fundingEn, setFundingEn] = useState("");
  const [xmlUrl, setXmlUrl] = useState("");
  const [receivedDate, setReceivedDate] = useState<string>(
    () => new Date().toISOString().slice(0, 10)
  );
  const [acceptedDate, setAcceptedDate] = useState<string>(
    () => new Date().toISOString().slice(0, 10)
  );
  const [referencesRu, setReferencesRu] = useState("");
  const [referencesEn, setReferencesEn] = useState("");

  // PDF upload
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  // Отдельно от общего `busy`: выгрузка XML не должна запирать «Сохранить».
  const [xmlBusy, setXmlBusy] = useState(false);

  // Статус выпуска нужен только для информационного баннера на форме статьи
  // в Published-номере: «всё редактируется». Сама форма не блокируется.
  const [issueStatus, setIssueStatus] = useState<string | null>(null);

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
      setAuthors(data.authors ?? []);
      setAbstractRu(data.abstract?.ru ?? "");
      setAbstractEn(data.abstract?.en ?? "");
      setKeywordsRu(data.keywords?.ru?.join(", ") ?? "");
      setKeywordsEn(data.keywords?.en?.join(", ") ?? "");
      setPages(data.pages ?? "");
      setDoi(data.doi ?? "");
      setUdk(data.udk ?? "");
      setJelCodes(data.jel_codes?.join(", ") ?? "");
      setFundingRu(data.funding?.ru ?? "");
      setFundingEn(data.funding?.en ?? "");
      setXmlUrl(data.xml_url ?? "");
      setReceivedDate(data.received_date ?? new Date().toISOString().slice(0, 10));
      setAcceptedDate(data.accepted_date ?? new Date().toISOString().slice(0, 10));
      // Бэк хранит references как массив [{ru, en}, ...]. Склеиваем
      // по строкам для блочного UX (два больших textarea).
      const refs = data.references ?? [];
      setReferencesRu(refs.map((r) => r.ru).join("\n"));
      setReferencesEn(refs.map((r) => r.en).join("\n"));
      setLoadError("");
    } catch (e) {
      setLoadError(parseApiError(e));
    }
  }

  useEffect(() => {
    loadSections();
    if (!isNew) loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  useEffect(() => {
    if (!issueId) {
      setIssueStatus(null);
      return;
    }
    let cancelled = false;
    adminApi
      .getIssue(issueId)
      .then((iss) => {
        if (!cancelled) setIssueStatus(iss.status);
      })
      .catch(() => {
        if (!cancelled) setIssueStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, [issueId]);

  // When sections load, set the dropdown value to match the article's section
  useEffect(() => {
    if (article && sections.length > 0 && !sectionSlug) {
      const match = sections.find(
        (s) => s.name.ru === article.section_name?.ru
      );
      if (match) setSectionSlug(match.slug);
    }
  }, [article, sections, sectionSlug]);

  // ── Author helpers ─────────────────────────────────────────────
  function moveAuthor(idx: number, dir: -1 | 1) {
    setAuthors((prev) => {
      const to = idx + dir;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
  }
  function removeAuthor(idx: number) {
    if (!confirm("Удалить автора? Действие необратимо до сохранения.")) return;
    setAuthors((prev) => prev.filter((_, i) => i !== idx));
  }
  function addAuthor() {
    setAuthors((prev) => [...prev, emptyAuthor()]);
  }
  function updateAuthor(idx: number, patch: Partial<Author>) {
    setAuthors((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  }

  // ── Affiliation helpers (within a given author) ────────────────
  function moveAffiliation(authorIdx: number, affIdx: number, dir: -1 | 1) {
    setAuthors((prev) =>
      prev.map((a, i) => {
        if (i !== authorIdx) return a;
        const to = affIdx + dir;
        if (to < 0 || to >= a.affiliations.length) return a;
        const next = [...a.affiliations];
        [next[affIdx], next[to]] = [next[to], next[affIdx]];
        return { ...a, affiliations: next };
      })
    );
  }
  function removeAffiliation(authorIdx: number, affIdx: number) {
    if (!confirm("Удалить аффилиацию?")) return;
    setAuthors((prev) =>
      prev.map((a, i) =>
        i === authorIdx
          ? { ...a, affiliations: a.affiliations.filter((_, j) => j !== affIdx) }
          : a
      )
    );
  }
  function addAffiliation(authorIdx: number) {
    setAuthors((prev) =>
      prev.map((a, i) =>
        i === authorIdx ? { ...a, affiliations: [...a.affiliations, emptyAffiliation()] } : a
      )
    );
  }
  function updateAffiliation(authorIdx: number, affIdx: number, patch: Partial<Affiliation>) {
    setAuthors((prev) =>
      prev.map((a, i) =>
        i === authorIdx
          ? {
              ...a,
              affiliations: a.affiliations.map((aff, j) =>
                j === affIdx ? { ...aff, ...patch } : aff
              ),
            }
          : a
      )
    );
  }

  // Бэк требует и `ru`, и `en` в каждой LocalizedString — отправляем оба
  // как есть. Если человек оставил `en` пустым, бэк ответит 400; форма
  // помечает все английские поля звёздочкой, чтобы это было очевидно.
  function cleanLocalized(s: { ru: string; en?: string }) {
    return { ru: s.ru.trim(), en: (s.en ?? "").trim() };
  }

  function buildPayload(): ArticleCreatePayload | null {
    if (!sectionSlug) {
      toast.error("Выберите рубрику");
      return null;
    }
    // Degree — опциональное. Бэк не принимает `null`; если оба языка пустые,
    // опускаем ключ `degree` целиком.
    const cleanedAuthors: Author[] = authors.map((a) => {
      const degRu = a.degree?.ru?.trim() ?? "";
      const degEn = a.degree?.en?.trim() ?? "";
      const author: Author = {
        full_name: cleanLocalized(a.full_name),
        email: a.email.trim(),
        orcid: a.orcid.trim(),
        affiliations: a.affiliations.map((aff) => ({
          organization_name: cleanLocalized(aff.organization_name),
          position: cleanLocalized(aff.position),
        })),
      };
      if (degRu || degEn) author.degree = cleanLocalized({ ru: degRu, en: degEn });
      return author;
    });
    return {
      ...(issueId ? { issue_id: issueId } : {}),
      section_slug: sectionSlug,
      title: { ru: titleRu, en: titleEn },
      authors: cleanedAuthors,
      pages,
      doi,
      abstract: { ru: abstractRu, en: abstractEn },
      article_type: articleType,
      keywords: {
        ru: keywordsRu.split(",").map((s) => s.trim()).filter(Boolean),
        en: keywordsEn.split(",").map((s) => s.trim()).filter(Boolean),
      },
      udk,
      jel_codes: jelCodes.split(",").map((s) => s.trim()).filter(Boolean),
      // Режем оба textarea по строкам и парим по индексу. Если строки в ru/en
      // расходятся по количеству — добиваем пустыми строками с короткой
      // стороны. Заказчик отвечает за выравнивание построчно.
      // Контракт бэка: либо null, либо массив объектов с обязательными ключами ru/en.
      references: (() => {
        const ruLines = referencesRu.split("\n").map((s) => s.trim());
        const enLines = referencesEn.split("\n").map((s) => s.trim());
        const max = Math.max(ruLines.length, enLines.length);
        const items: { ru: string; en: string }[] = [];
        for (let i = 0; i < max; i++) {
          const ru = ruLines[i] ?? "";
          const en = enLines[i] ?? "";
          if (!ru && !en) continue;
          items.push({ ru, en });
        }
        return items.length > 0 ? items : null;
      })(),
      received_date: receivedDate,
      accepted_date: acceptedDate,
      funding: { ru: fundingRu, en: fundingEn },
      xml_url: xmlUrl || null,
    };
  }

  // Бэк отвергает создание/обновление статьи в рубрике, не подписанной к
  // номеру (sections_slugs). Поэтому привязку рубрики к номеру нужно делать
  // ДО POST/PATCH статьи. Если шаг падает — пробрасываем ошибку, итоговый
  // toast покажет вызывающий handler.
  async function ensureIssueHasSection(targetIssueId: number, slug: string): Promise<void> {
    if (!targetIssueId || !slug) return;
    const issue = await adminApi.getIssue(targetIssueId);
    const existing = issue.sections?.map((s) => s.slug) ?? [];
    if (existing.includes(slug)) return;
    await adminApi.updateIssue(targetIssueId, {
      sections_slugs: [...existing, slug],
    });
  }

  // Проверяем, не перекрывается ли диапазон страниц с другими статьями того же
  // выпуска. Не блокирует сохранение — просто показывает warning toast.
  // Дополнительно фильтруем результат listArticles по issue_id (страховка от
  // регрессий бэка вида Bug-71, когда эндпоинт начинал отдавать чужие статьи).
  async function checkPagesOverlap(savedArticleId: number, savedIssueId: number, savedPages: string) {
    if (!savedIssueId || !savedPages) return;
    try {
      const all = await adminApi.listArticles(savedIssueId);
      const own = all.filter((a) => a.issue_id === savedIssueId);
      const overlaps = findOverlaps(
        { id: savedArticleId, pages: savedPages },
        own.map((a) => ({ id: a.id, pages: a.pages, title: a.title.ru }))
      );
      if (overlaps.length === 0) return;
      const list = overlaps
        .map((o) => `«${o.title}» (с. ${o.pages})`)
        .join("; ");
      // duration 8s — warning должен оставаться видимым достаточно долго,
      // чтобы редактор заметил и прочитал список перекрытий рядом с success-toast.
      toast.warning(
        `Диапазон страниц перекрывается со ${overlaps.length === 1 ? "статьёй" : "статьями"}: ${list}`,
        {
          description: "Сохранено, но проверьте порядок страниц в номере.",
          duration: 8000,
        }
      );
    } catch {
      // Молча игнорируем — это не критичная проверка, статья уже сохранена.
    }
  }

  // Bug-B guard: save (PATCH полей) и upload PDF — раздельные handlers;
  // не объединять без явной обработки 400 от upload. См. test_plan §7.8.
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload = buildPayload();
    if (!payload) {
      setBusy(false);
      return;
    }
    try {
      // Бэк отвергает create/patch статьи, если выбранная рубрика не подписана
      // к номеру. Поэтому привязку рубрики делаем ДО save статьи; ошибка
      // долетит до общего catch и поднимется как один итоговый toast.
      if (issueId) {
        await ensureIssueHasSection(issueId, sectionSlug);
      }
      if (isNew) {
        const created = await adminApi.createArticle(payload);
        toast.success("Статья создана");
        await checkPagesOverlap(created.id, created.issue_id, created.pages);
        router.replace(`/control/articles/${created.id}`);
      } else {
        // issue_id is read-only after creation (backend ignores it on PATCH)
        const { issue_id: _ignored, ...patch } = payload;
        void _ignored;
        await adminApi.updateArticle(articleId!, patch);
        await loadArticle();
        toast.success("Статья сохранена");
        await checkPagesOverlap(articleId!, issueId, payload.pages);
      }
    } catch (err) {
      toast.error(parseApiError(err), { description: "Не удалось сохранить статью" });
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
      toast.success("Статья удалена");
      router.push(`/control/issues/${issueId}`);
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось удалить статью" });
      setBusy(false);
    }
  }

  async function handlePdfUpload(file: File) {
    if (!articleId) {
      toast.error("Сначала сохраните статью");
      return;
    }
    setPdfBusy(true);
    try {
      await adminApi.uploadArticleReadyPdf(articleId, file);
      await loadArticle();
      toast.success("PDF загружен");
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось загрузить PDF" });
    } finally {
      setPdfBusy(false);
    }
  }

  // Выгрузка JATS-XML. Документ бэк собирает из СОХРАНЁННЫХ данных статьи, а не
  // из того, что сейчас в форме, — поэтому рядом с кнопкой стоит об этом
  // подпись, а сама кнопка не пытается ничего сохранить за редактора.
  async function handleXmlDownload() {
    if (!article) return;
    const target = articleJatsXml(article);
    if (!target) {
      toast.error("В демо-режиме XML не формируется");
      return;
    }
    setXmlBusy(true);
    try {
      const { blob } = await adminApi.downloadProtectedFile(target.apiPath);
      // Отказ может приехать и с кодом 200 — такой прецедент у бэка есть.
      // Файл уходит руками в чужую систему, поэтому дешевле проверить здесь,
      // чем разбираться, почему там не принялось.
      const head = await blob.slice(0, 200).text();
      if (!looksLikeXml(head)) {
        toast.error("Бэкенд вернул не XML", {
          description: "Файл не сохранён. Проверьте статью и повторите.",
        });
        return;
      }
      saveBlobAsFile(blob, target.filename);
    } catch (e) {
      toast.error(parseApiError(e), { description: "Не удалось сформировать XML" });
    } finally {
      setXmlBusy(false);
    }
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  // Статья без выпуска бэком не создаётся. Прямой переход на /control/articles/new
  // без issue_id query — обычно нажатие на старую закладку или ошибка навигации;
  // отправляем пользователя в список номеров.
  if (isNew && !issueId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-4 text-sm text-amber-800">
        Статью можно создать только в контексте выпуска. Откройте нужный номер
        в{" "}
        <Link href="/control/issues" className="underline hover:text-forest-700">
          списке номеров
        </Link>{" "}
        и нажмите «Добавить статью».
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

      {issueStatus === "Published" && (
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 mb-6 text-sm text-amber-800">
          Номер опубликован, но статья остаётся редактируемой. Меняйте поля,
          PDF, ссылку XML — изменения уйдут на публичную страницу сразу после
          сохранения.
        </div>
      )}

      {/* Breadcrumbs + actions */}
      <div className="flex items-center justify-between mb-6">
        <nav className="text-xs text-gray-600 flex items-center gap-1">
          <Link href="/control/issues" className="hover:text-forest-600">
            Номера
          </Link>
          <ChevronRight className="w-3 h-3" />
          {issueId ? (
            <Link href={`/control/issues/${issueId}`} className="hover:text-forest-600">
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
              href={`/control/articles/${articleId}/preview`}
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

      <form className="space-y-8 max-w-5xl" onSubmit={handleSave}>
        {/* Section 1: Basic info */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Основная информация
          </legend>
          <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-2 gap-5">
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
                Название (английский) *<LangBadge lang="EN" />
              </label>
              <input
                id="title-en"
                type="text"
                className={inputClass}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
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
            {authors.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Авторов пока нет. Добавьте хотя бы одного.
              </p>
            )}
            {authors.map((author, aIdx) => (
              <div
                key={aIdx}
                className="border border-stone-300 rounded p-4 bg-stone-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Автор № {aIdx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveAuthor(aIdx, -1)}
                      disabled={aIdx === 0}
                      className="p-1 text-gray-400 hover:text-forest-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Переместить выше"
                      title="Переместить выше"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveAuthor(aIdx, 1)}
                      disabled={aIdx === authors.length - 1}
                      className="p-1 text-gray-400 hover:text-forest-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Переместить ниже"
                      title="Переместить ниже"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAuthor(aIdx)}
                      className="p-1 text-gray-400 hover:text-red-600 ml-2"
                      aria-label="Удалить автора"
                      title="Удалить автора"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>
                      ФИО (русский) *<LangBadge lang="RU" />
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="И.И. Иванов"
                      value={author.full_name.ru}
                      onChange={(e) =>
                        updateAuthor(aIdx, {
                          full_name: { ...author.full_name, ru: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Full name (English) *<LangBadge lang="EN" />
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="I.I. Ivanov"
                      value={author.full_name.en ?? ""}
                      onChange={(e) =>
                        updateAuthor(aIdx, {
                          full_name: { ...author.full_name, en: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="ivanov@example.com"
                      value={author.email}
                      onChange={(e) => updateAuthor(aIdx, { email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ORCID *</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="0000-0000-0000-0000"
                      value={author.orcid}
                      onChange={(e) => updateAuthor(aIdx, { orcid: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Учёная степень (русский){author.degree?.en ? " *" : ""}<LangBadge lang="RU" />
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="д-р экон. наук, профессор"
                      value={author.degree?.ru ?? ""}
                      onChange={(e) => {
                        const ru = e.target.value;
                        const en = author.degree?.en ?? "";
                        updateAuthor(aIdx, {
                          degree: ru || en ? { ru, en } : null,
                        });
                      }}
                      required={!!author.degree?.en}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Degree (English){author.degree?.ru ? " *" : ""}<LangBadge lang="EN" />
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Doctor of Economics, Professor"
                      value={author.degree?.en ?? ""}
                      onChange={(e) => {
                        const en = e.target.value;
                        const ru = author.degree?.ru ?? "";
                        updateAuthor(aIdx, {
                          degree: ru || en ? { ru, en } : null,
                        });
                      }}
                      required={!!author.degree?.ru}
                    />
                  </div>
                </div>

                {/* Affiliations sub-list */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    Аффилиации
                  </p>
                  <div className="space-y-3">
                    {author.affiliations.map((aff, affIdx) => (
                      <div
                        key={affIdx}
                        className="border border-stone-300 rounded p-3 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">
                            № {affIdx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveAffiliation(aIdx, affIdx, -1)}
                              disabled={affIdx === 0}
                              className="p-1 text-gray-400 hover:text-forest-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Переместить выше"
                              title="Переместить выше"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveAffiliation(aIdx, affIdx, 1)}
                              disabled={affIdx === author.affiliations.length - 1}
                              className="p-1 text-gray-400 hover:text-forest-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              aria-label="Переместить ниже"
                              title="Переместить ниже"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAffiliation(aIdx, affIdx)}
                              className="p-1 text-gray-400 hover:text-red-600 ml-1"
                              aria-label="Удалить аффилиацию"
                              title="Удалить аффилиацию"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className={labelClass}>
                              Должность (русский) *<LangBadge lang="RU" />
                            </label>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="главный научный сотрудник"
                              value={aff.position.ru}
                              onChange={(e) =>
                                updateAffiliation(aIdx, affIdx, {
                                  position: { ...aff.position, ru: e.target.value },
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Position (English) *<LangBadge lang="EN" />
                            </label>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="Senior Researcher"
                              value={aff.position.en ?? ""}
                              onChange={(e) =>
                                updateAffiliation(aIdx, affIdx, {
                                  position: { ...aff.position, en: e.target.value },
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Организация (русский) *<LangBadge lang="RU" />
                            </label>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="Институт экономики РАН"
                              value={aff.organization_name.ru}
                              onChange={(e) =>
                                updateAffiliation(aIdx, affIdx, {
                                  organization_name: {
                                    ...aff.organization_name,
                                    ru: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Organization (English) *<LangBadge lang="EN" />
                            </label>
                            <input
                              type="text"
                              className={inputClass}
                              placeholder="Institute of Economics RAS"
                              value={aff.organization_name.en ?? ""}
                              onChange={(e) =>
                                updateAffiliation(aIdx, affIdx, {
                                  organization_name: {
                                    ...aff.organization_name,
                                    en: e.target.value,
                                  },
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addAffiliation(aIdx)}
                      className="inline-flex items-center gap-1.5 text-xs text-forest-600 border border-dashed border-forest-300 rounded px-2 py-1 hover:bg-forest-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Добавить аффилиацию
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAuthor}
              className="inline-flex items-center gap-1.5 text-sm text-forest-600 border border-dashed border-forest-300 rounded px-3 py-2 hover:bg-forest-50"
            >
              <Plus className="w-4 h-4" />
              Добавить автора
            </button>
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
                Аннотация (английский){abstractRu ? " *" : ""}<LangBadge lang="EN" />
              </label>
              <textarea
                id="abstract-en"
                className={textareaClass}
                rows={4}
                value={abstractEn}
                onChange={(e) => setAbstractEn(e.target.value)}
                required={!!abstractRu}
              />
              <p className={hintClass}>
                Если заполняете аннотацию, нужны обе версии — иначе бэк
                отвергнет.
              </p>
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
              <label htmlFor="pages" className={labelClass}>Страницы *</label>
              <input
                id="pages"
                type="text"
                className={inputClass}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="7-21"
                required
              />
              <p className={hintClass}>Диапазон в номере, например «7-21»</p>
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
              <label htmlFor="jel" className={labelClass}>JEL коды *</label>
              <input
                id="jel"
                type="text"
                className={inputClass}
                value={jelCodes}
                onChange={(e) => setJelCodes(e.target.value)}
                placeholder="A11, D83, O33"
                required
              />
              <p className={hintClass}>Хотя бы один код, разделяйте запятой</p>
            </div>
            <div>
              <label htmlFor="received-date" className={labelClass}>Дата получения *</label>
              <input
                id="received-date"
                type="date"
                className={inputClass}
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="accepted-date" className={labelClass}>Дата принятия *</label>
              <input
                id="accepted-date"
                type="date"
                className={inputClass}
                value={acceptedDate}
                onChange={(e) => setAcceptedDate(e.target.value)}
                required
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
                Funding (English){fundingRu ? " *" : ""}<LangBadge lang="EN" />
              </label>
              <textarea
                id="funding-en"
                className={textareaClass}
                rows={2}
                value={fundingEn}
                onChange={(e) => setFundingEn(e.target.value)}
                required={!!fundingRu}
              />
              <p className={hintClass}>
                Если статья без финансирования — оставьте оба поля пустыми.
              </p>
            </div>
          </div>
        </fieldset>

        {/* Section 8: References */}
        <fieldset className="bg-white border border-gray-200 rounded-sm">
          <legend className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 pt-5 pb-0">
            Литература / References
          </legend>
          <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="references-ru" className={labelClass}>
                Литература (русский)<LangBadge lang="RU" />
              </label>
              <textarea
                id="references-ru"
                className={`${inputClass} resize-y font-mono`}
                rows={30}
                placeholder={"1. Рубинштейн А.Я. Теория опекаемых благ. СПб.: Алетейя, 2018.\n2. ..."}
                value={referencesRu}
                onChange={(e) => setReferencesRu(e.target.value)}
              />
              <p className={hintClass}>
                Один блок текста, по строке на источник. Каждая строка слева
                парится по индексу со строкой справа — следите, чтобы
                количество строк совпадало.
              </p>
            </div>
            <div>
              <label htmlFor="references-en" className={labelClass}>
                References (English) *<LangBadge lang="EN" />
              </label>
              <textarea
                id="references-en"
                className={`${inputClass} resize-y font-mono`}
                rows={30}
                placeholder={"1. Rubinstein A.Ya. Theory of Patronized Goods. St. Petersburg: Aletheia, 2018.\n2. ..."}
                value={referencesEn}
                onChange={(e) => setReferencesEn(e.target.value)}
              />
              <p className={hintClass}>
                Английский перевод обязателен для каждого источника.
                Переносы строк сохраняются при отображении.
              </p>
            </div>
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
                    <PdfDownloadLink
                      link={articlePdfLink(article)}
                      requiresAuth
                      className="text-forest-600 underline"
                    >
                      {fileNameFromUrl(article.pdf_file)}
                    </PdfDownloadLink>
                    {article.pdf_size_kb && ` (${article.pdf_size_kb} КБ)`}
                  </p>
                )}
              </div>
            )}
            {!isNew && (
              <div>
                <label className={labelClass}>Документ JATS XML</label>
                {issueStatus !== null && issueStatus !== "Published" ? (
                  // Не гасим кнопку, а убираем её и объясняем словами: у
                  // выключенной кнопки подсказка не доходит до тех, кто читает
                  // страницу с экранного диктора, и она выпадает из таб-порядка.
                  // Тот же приём, что у PDF в новой статье, — строкой ниже.
                  <p className="text-xs text-gray-500">
                    XML можно будет скачать после публикации номера.
                  </p>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleXmlDownload}
                      disabled={xmlBusy}
                      aria-busy={xmlBusy || undefined}
                      className="inline-flex items-center gap-2 text-sm border border-stone-400 rounded px-4 py-2 hover:bg-stone-50 disabled:opacity-50"
                    >
                      <FileCode className="w-4 h-4" />
                      {xmlBusy ? "Формируется..." : "Скачать XML (JATS)"}
                    </button>
                    <p className={`${hintClass} mt-2`}>
                      Формируется на сервере по <strong>сохранённым</strong> данным
                      статьи — правки в форме попадут в файл только после
                      сохранения. Выложив документ на РЦНИ, вставьте адрес в поле
                      «URL XML (JATS)» выше.
                    </p>
                  </>
                )}
              </div>
            )}
            {isNew && (
              <p className="text-xs text-gray-500">
                PDF и XML станут доступны после первого сохранения статьи.
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
