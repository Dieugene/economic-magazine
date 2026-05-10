"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import JournalCover from "@/components/public/JournalCover";
import ArticleCard from "@/components/public/ArticleCard";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { comparePages } from "@/lib/utils/pages";
import type { Article, IssueFull } from "@/lib/types";
import { formatDateRu } from "@/lib/utils/date";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(dateStr: string, lang: "ru" | "en"): string {
  // Парсим строку ISO YYYY-MM-DD вручную — без new Date(), чтобы не уехать
  // на сутки из-за UTC-парсинга в браузерах с отрицательным offset.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return "";
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const months = lang === "en" ? MONTHS_EN : MONTHS_RU;
  return lang === "en"
    ? `${months[mo - 1]} ${d}, ${y}`
    : `${d} ${months[mo - 1]} ${y}`;
}

function getLastPage(articles: Article[]): number {
  let max = 0;
  for (const a of articles) {
    const end = parseInt(a.pages.split("-")[1] ?? a.pages, 10);
    if (end > max) max = end;
  }
  return max;
}

const SHORT_NAMES_RU: Record<string, string> = {
  "ekonomicheskaja-teorija": "Экономическая теория",
  "metodologija-ekonomicheskoj-nauki": "Методология",
  "ot-teorii-k-ekonomicheskoj-politike": "Теория и политика",
  "istorija-mysli": "История мысли",
  "mezhdistsiplinarnye-issledovanija": "Междисциплинарные",
  "ekonomicheskaja-istorija": "Эконом. история",
  "obzory-i-retsenzii": "Обзоры и рецензии",
};

const SHORT_NAMES_EN: Record<string, string> = {
  "ekonomicheskaja-teorija": "Economic Theory",
  "metodologija-ekonomicheskoj-nauki": "Methodology",
  "ot-teorii-k-ekonomicheskoj-politike": "Theory & Policy",
  "istorija-mysli": "History of Thought",
  "mezhdistsiplinarnye-issledovanija": "Interdisciplinary",
  "ekonomicheskaja-istorija": "Econ. History",
  "obzory-i-retsenzii": "Reviews",
};

interface IssueViewProps {
  data: IssueFull;
}

export default function IssueView({ data }: IssueViewProps) {
  const { lang, t } = useLanguage();

  // Защитная сетка: бэк может вернуть в IssueSection.articles статьи чужих
  // выпусков (регрессия Bug-71). Фильтруем по issue_id и выкидываем пустые
  // секции — на публике пустые рубрики не нужны.
  const visibleSections = data.sections
    .map((sg) => ({
      ...sg,
      articles: sg.articles.filter((a) => a.issue_id === data.id),
    }))
    .filter((sg) => sg.articles.length > 0);

  const allArticles: Article[] = visibleSections.flatMap((sg) => sg.articles);
  const lastPage = getLastPage(allArticles);
  const publishedDate = data.published_date ?? "";
  const numberLabel = lang === "en" ? "No." : "№";

  return (
    <>
      <DocumentTitle
        ru={`№ ${data.number} (${data.sequential_number}) / ${data.year}`}
        en={`No. ${data.number} (${data.sequential_number}) / ${data.year}`}
      />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Архив", en: "Archive" }, href: "/archive" },
          { label: String(data.year), href: `/archive/${data.year}` },
          { label: `${numberLabel} ${data.number} (${data.sequential_number})` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="mb-10">
            <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight">
              {numberLabel} {data.number} ({data.sequential_number}) / {data.year}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              {publishedDate && (
                <>
                  <span>{t("Дата выхода:", "Published:")} {formatDate(publishedDate, lang)}</span>
                  <span className="text-stone-500">|</span>
                </>
              )}
              <span>
                {allArticles.length} {t("статей", "articles")}
              </span>
              {lastPage > 0 && (
                <>
                  <span className="text-stone-500">|</span>
                  <span>{t("С.", "Pp.")} 1{"–"}{lastPage}</span>
                </>
              )}
            </div>
            {data.pdf_file && (
              <div className="mt-5">
                <a
                  href={data.pdf_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-forest-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t("Весь выпуск (PDF)", "Full issue (PDF)")}
                </a>
              </div>
            )}
          </div>

          {/* Sections with articles */}
          {visibleSections.map((sectionGroup, sIdx) => {
            const sectionArticles = [...sectionGroup.articles].sort((a, b) =>
              comparePages(a.pages, b.pages)
            );
            const sectionTitle = lang === "en" && sectionGroup.name.en
              ? sectionGroup.name.en
              : sectionGroup.name.ru;
            return (
              <section key={sectionGroup.slug} id={`section-${sectionGroup.slug}`} className="mb-10">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-forest-600">
                  <span className="bg-forest-600 text-white text-xs font-medium px-2.5 py-1 rounded-sm tracking-wide uppercase">
                    {ROMAN[sIdx] ?? sIdx + 1}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-600">
                    {sectionTitle}
                  </h3>
                </div>

                {sectionArticles.map((article, aIdx) => {
                  const titleForLang = lang === "en" && article.title.en ? article.title.en : article.title.ru;
                  const authorsForLang = (article.authors ?? [])
                    .map((a) => (lang === "en" && a.full_name?.en ? a.full_name.en : a.full_name?.ru))
                    .filter(Boolean)
                    .join(", ");
                  const abstractForLang = article.abstract
                    ? lang === "en" && article.abstract.en ? article.abstract.en : article.abstract.ru
                    : null;
                  return (
                    <div key={article.id} className={aIdx < sectionArticles.length - 1 ? "mb-3" : ""}>
                      <ArticleCard
                        authors={authorsForLang}
                        title={titleForLang}
                        href={`/article/${article.id}`}
                        pages={article.pages}
                        pdfSizeKb={article.pdf_size_kb}
                        pdfUrl={article.pdf_file}
                        abstract={abstractForLang}
                      />
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <div className="bg-white border border-stone-400 rounded-sm overflow-hidden">
              <div className="bg-forest-600 px-5 py-3">
                <h3 className="text-sm font-medium text-white tracking-wide uppercase">
                  {t("Этот номер", "This issue")}
                </h3>
              </div>
              <div className="p-5">
                <JournalCover number={data.number} year={data.year} className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("Статей:", "Articles:")}</span>
                    <span className="text-forest-600 font-medium">{allArticles.length}</span>
                  </div>
                  {lastPage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("Страниц:", "Pages:")}</span>
                      <span className="text-forest-600 font-medium">{lastPage}</span>
                    </div>
                  )}
                  {publishedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t("Дата:", "Date:")}</span>
                      <span className="text-forest-600 font-medium">{formatDateRu(publishedDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {visibleSections.length > 0 && (
              <div className="mt-6 bg-white border border-stone-400 rounded-sm p-5">
                <h3 className="text-sm font-medium text-forest-600 mb-3 tracking-wide uppercase">
                  {t("Рубрики номера", "Issue Sections")}
                </h3>
                <nav className="space-y-1.5 text-sm">
                  {visibleSections.map((sg, i) => {
                    const shortName = lang === "en"
                      ? SHORT_NAMES_EN[sg.slug] ?? sg.name.en ?? sg.name.ru
                      : SHORT_NAMES_RU[sg.slug] ?? sg.name.ru;
                    return (
                      <a
                        key={sg.slug}
                        href={`#section-${sg.slug}`}
                        className="block text-gray-600 hover:text-copper-500 transition-colors"
                      >
                        {ROMAN[i]}. {shortName}{" "}
                        <span className="text-gray-500">({sg.articles.length})</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
