"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Article, ArticleType, LocalizedString } from "@/lib/types";

const TYPE_LABELS: Record<ArticleType, { ru: string; en: string }> = {
  Scientific: { ru: "Научная статья", en: "Scientific article" },
  Review: { ru: "Обзор", en: "Review" },
  Book_review: { ru: "Рецензия", en: "Book review" },
  Editorial: { ru: "От редактора", en: "Editorial" },
};

function pickLang(s: LocalizedString | null | undefined, lang: "ru" | "en"): string {
  if (!s) return "";
  return lang === "en" && s.en ? s.en : (s.ru ?? "");
}

function pickWithFallback(
  value: { ru?: string; en?: string } | null | undefined,
  lang: "ru" | "en"
): { text: string; isFallback: boolean } | null {
  if (!value) return null;
  const primary = lang === "en" ? value.en : value.ru;
  const secondary = lang === "en" ? value.ru : value.en;
  if (primary && primary.trim()) return { text: primary, isFallback: false };
  if (secondary && secondary.trim()) return { text: secondary, isFallback: true };
  return null;
}

function formatDate(dateStr: string, lang: "ru" | "en"): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "en" ? "en-GB" : "ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ArticleView({ article }: { article: Article }) {
  const { lang, t } = useLanguage();

  const titleForLang = lang === "en" && article.title.en ? article.title.en : article.title.ru;
  const authorsForLang = (article.authors ?? [])
    .map((a) => pickLang(a.full_name, lang))
    .filter(Boolean)
    .join(", ");
  const sectionForLang = lang === "en" && article.section_name.en ? article.section_name.en : article.section_name.ru;
  const abstractForLang = article.abstract
    ? lang === "en" && article.abstract.en ? article.abstract.en : article.abstract.ru
    : null;
  const fundingForLang = article.funding
    ? lang === "en" && article.funding.en ? article.funding.en : article.funding.ru
    : null;
  const keywordsForLang = lang === "en" && article.keywords?.en?.length ? article.keywords.en : article.keywords?.ru;

  const issueNumberLabel = `${lang === "en" ? "No." : "№"} ${article.issue_number} (${article.issue_sequential_number})`;

  const journalShort = lang === "en" ? "IET" : "ВТЭ";
  const journalFull = lang === "en"
    ? "Issues of Economic Theory"
    : "Вопросы теоретической экономики";
  const pagesPrefix = lang === "en" ? "Pp." : "С.";
  // Авторы могут уже заканчиваться точкой («Дитковский Е.») — не дублируем её.
  const authorsClean = authorsForLang.replace(/\.+\s*$/, "").trim();
  const citationString = `${authorsClean}. ${titleForLang} // ${journalFull}. ${article.issue_year}. ${lang === "en" ? "No." : "№"} ${article.issue_number} (${article.issue_sequential_number}). ${pagesPrefix} ${article.pages}.${article.doi ? ` DOI: ${article.doi}.` : ""}`;

  return (
    <>
      <DocumentTitle ru={article.title.ru} en={article.title.en ?? article.title.ru} />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Архив", en: "Archive" }, href: "/archive" },
          { label: String(article.issue_year), href: `/archive/${article.issue_year}` },
          {
            label: issueNumberLabel,
            href: `/archive/${article.issue_year}/${article.issue_number}`,
          },
          { label: { ru: "Статья", en: "Article" } },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        {/* Left column (2/3) */}
        <article className="lg:col-span-2">
          <div>
            <div className="mb-4">
              <span className="inline-block text-xs font-medium text-copper-600 bg-copper-50 border border-copper-200 px-2.5 py-1 rounded-sm uppercase tracking-wide">
                {sectionForLang}
              </span>
              <span className="inline-block text-xs text-gray-500 ml-2">
                {t(TYPE_LABELS[article.article_type].ru, TYPE_LABELS[article.article_type].en)}
              </span>
            </div>

            <div className="w-[60px] h-[2px] bg-copper-400 mb-5" />

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-600 leading-tight mb-3">
              {titleForLang}
            </h2>

            {/* Show the alternate-language title beneath, if available */}
            {lang === "ru" && article.title.en && (
              <p className="font-serif text-xl text-gray-500 italic leading-snug mb-6">
                {article.title.en}
              </p>
            )}

            {/* DOI + pages + UDK + JEL info bar */}
            <div className="bg-stone-200 border border-stone-400 rounded-sm p-4 mb-6 text-sm">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {article.doi && (
                  <div>
                    <span className="text-gray-600">DOI:</span>{" "}
                    <a
                      href={`https://doi.org/${article.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-copper-400 transition-colors font-medium underline underline-offset-2"
                    >
                      {article.doi}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">{t("Страницы:", "Pages:")}</span>{" "}
                  <span className="text-forest-600 font-medium">{article.pages}</span>
                </div>
                {article.udk && (
                  <div>
                    <span className="text-gray-600">{t("УДК:", "UDC:")}</span>{" "}
                    <span className="text-forest-600">{article.udk}</span>
                  </div>
                )}
                {article.jel_codes && article.jel_codes.length > 0 && (
                  <div>
                    <span className="text-gray-600">JEL:</span>{" "}
                    <span className="text-forest-600">{article.jel_codes.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Authors */}
            {article.authors && article.authors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  {t("Авторы", "Authors")}
                </h3>
                <div className="bg-white border border-stone-400 rounded-sm divide-y divide-stone-200">
                  {article.authors.map((author, idx) => {
                    const fullName = pickLang(author.full_name, lang);
                    const degree = pickLang(author.degree, lang);
                    return (
                      <div key={idx} className="p-4 text-sm leading-relaxed">
                        <p className="font-medium text-forest-700 text-base">{fullName}</p>
                        {degree && (
                          <p className="text-gray-600 mt-0.5">{degree}</p>
                        )}
                        <div className="text-gray-600 mt-1 space-y-0.5">
                          {author.orcid && (
                            <p>
                              ORCID:{" "}
                              <a
                                href={`https://orcid.org/${author.orcid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-copper-400 transition-colors"
                              >
                                {author.orcid}
                              </a>
                            </p>
                          )}
                          {author.email && <p>{author.email}</p>}
                        </div>
                        {author.affiliations && author.affiliations.length > 0 && (
                          <ul className="mt-2 text-gray-700 space-y-0.5">
                            {author.affiliations.map((aff, j) => {
                              const position = pickLang(aff.position, lang);
                              const org = pickLang(aff.organization_name, lang);
                              const sep = position && org ? ", " : "";
                              return (
                                <li key={j}>
                                  {position}
                                  {sep}
                                  {org}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dates */}
            {(article.received_date || article.accepted_date) && (
              <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500">
                {article.received_date && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t("Получена:", "Received:")} {formatDate(article.received_date, lang)}
                  </div>
                )}
                {article.accepted_date && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("Принята в печать:", "Accepted:")} {formatDate(article.accepted_date, lang)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Abstract */}
          {(() => {
            const abstract = pickWithFallback(article.abstract, lang);
            const keywords = lang === "en" && article.keywords?.en?.length
              ? { items: article.keywords.en, isFallback: false }
              : article.keywords?.ru?.length
                ? { items: article.keywords.ru, isFallback: lang === "en" }
                : null;
            if (!abstract && !keywords) return null;
            return (
              <div className="mb-8 bg-white border border-stone-400 rounded-sm p-6">
                <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
                  {t("Аннотация", "Abstract")}
                  {abstract?.isFallback && (
                    <span className="ml-3 text-xs font-normal text-gray-500 italic">
                      {lang === "en" ? "(in Russian)" : "(на английском)"}
                    </span>
                  )}
                </h3>
                {abstract && (
                  <p className="text-[15px] text-gray-700 leading-relaxed">{abstract.text}</p>
                )}
                {keywords && (
                  <div className="mt-5">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {t("Ключевые слова", "Keywords")}
                      {keywords.isFallback && (
                        <span className="ml-2 normal-case font-normal italic">
                          {lang === "en" ? "(in Russian)" : "(на английском)"}
                        </span>
                      )}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.items.map((kw) => (
                        <span
                          key={kw}
                          className="inline-block text-xs bg-stone-200 text-gray-600 px-2.5 py-1 rounded-sm"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Funding */}
          {fundingForLang && (
            <div className="mb-8 p-4 bg-copper-50 border border-copper-200 rounded-sm">
              <h4 className="text-xs font-medium text-copper-700 uppercase tracking-wider mb-1">
                {t("Финансирование", "Funding")}
              </h4>
              <p className="text-sm text-gray-700">{fundingForLang}</p>
            </div>
          )}

          {/* References */}
          {(() => {
            const refsArr = article.references ?? [];
            const primaryKey = lang === "en" ? "en" : "ru";
            const secondaryKey = lang === "en" ? "ru" : "en";
            const primary = refsArr.map((r) => r[primaryKey]).filter(Boolean).join("\n");
            const secondary = refsArr.map((r) => r[secondaryKey]).filter(Boolean).join("\n");
            const text = primary || secondary;
            const isFallback = !primary && !!secondary;
            if (!text) return null;
            return (
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
                  {t("Литература", "References")}
                  {isFallback && (
                    <span className="ml-3 text-xs font-normal text-gray-500 italic">
                      {lang === "en" ? "(in Russian)" : "(на английском)"}
                    </span>
                  )}
                </h3>
                <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{text}</p>
              </div>
            );
          })()}

          {/* Copyright */}
          {(() => {
            const authorsCopy = (article.authors ?? [])
              .map((a) => {
                const name = pickLang(a.full_name, lang).trim();
                if (!name) return null;
                const parts = name.split(/\s+/);
                if (lang === "en") {
                  if (parts.length >= 2) {
                    const first = parts[0][0] + ".";
                    const last = parts.slice(1).join(" ");
                    return `${first} ${last}`;
                  }
                  return name;
                }
                if (parts.length >= 2) {
                  const surname = parts[0];
                  const initials = parts.slice(1).map((p) => p[0] + ".").join(" ");
                  return `${initials} ${surname}`;
                }
                return name;
              })
              .filter(Boolean)
              .join(", ");
            const journalCopy = lang === "en"
              ? "Institute of Economics of the Russian Academy of Sciences «Issues of Economic Theory»"
              : "ФГБУН Институт экономики РАН «Вопросы теоретической экономики»";
            return (
              <div className="mb-6 text-xs text-gray-500 leading-relaxed">
                {authorsCopy && <p>© {authorsCopy}, {article.issue_year}</p>}
                <p>© {journalCopy}, {article.issue_year}</p>
              </div>
            );
          })()}

          {/* Citation block */}
          <div className="p-5 bg-forest-50 border border-forest-200 rounded-sm">
            <h4 className="text-xs font-medium text-forest-600 uppercase tracking-wider mb-2">
              {t("Для цитирования", "How to cite")}
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">{citationString}</p>
          </div>
        </article>

        {/* Right sidebar (1/3) */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Download section */}
            <div className="bg-white border border-stone-400 rounded-sm p-5">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                {t("Скачать", "Download")}
              </h3>
              <div className="space-y-2">
                {article.pdf_file && (
                  <a
                    href={article.pdf_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-forest-600 text-white rounded-sm hover:bg-forest-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M6 20h12a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium">{t("PDF статьи", "Article PDF")}</span>
                      {article.pdf_size_kb && (
                        <span className="text-xs text-white/60 ml-1">
                          {article.pdf_size_kb} {t("КБ", "KB")}
                        </span>
                      )}
                    </div>
                  </a>
                )}
                {article.xml_url && (
                  <a
                    href={article.xml_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-stone-200 text-forest-600 rounded-sm hover:bg-stone-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium">XML (JATS)</span>
                      <span className="text-xs text-gray-600 ml-1">{t("РЦНИ", "RCSI")}</span>
                    </div>
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                {t("Лицензия", "License")}:{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-copper-400 transition-colors"
                >
                  Creative Commons 4.0 BY
                </a>
              </p>
            </div>

            {/* Metadata card */}
            <div className="bg-white border border-stone-400 rounded-sm p-5">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                {t("Метаданные", "Metadata")}
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500 text-xs">{t("Номер", "Issue")}</dt>
                  <dd>
                    <Link
                      href={`/archive/${article.issue_year}/${article.issue_number}`}
                      className="text-forest-600 font-medium hover:text-copper-400 transition-colors"
                    >
                      {journalShort} {issueNumberLabel} / {article.issue_year}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">{t("Рубрика", "Section")}</dt>
                  <dd className="text-forest-600">{sectionForLang}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">{t("Тип", "Type")}</dt>
                  <dd className="text-forest-600">
                    {t(TYPE_LABELS[article.article_type].ru, TYPE_LABELS[article.article_type].en)}
                  </dd>
                </div>
                {article.doi && (
                  <div>
                    <dt className="text-gray-500 text-xs">DOI</dt>
                    <dd>
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-copper-400 transition-colors text-xs break-all"
                      >
                        {article.doi}
                      </a>
                    </dd>
                  </div>
                )}
                {article.udk && (
                  <div>
                    <dt className="text-gray-500 text-xs">{t("УДК", "UDC")}</dt>
                    <dd className="text-forest-600">{article.udk}</dd>
                  </div>
                )}
                {article.jel_codes && article.jel_codes.length > 0 && (
                  <div>
                    <dt className="text-gray-500 text-xs">JEL</dt>
                    <dd className="text-forest-600">{article.jel_codes.join(", ")}</dd>
                  </div>
                )}
                {keywordsForLang && keywordsForLang.length > 0 && (
                  <div>
                    <dt className="text-gray-500 text-xs">{t("Ключевые слова", "Keywords")}</dt>
                    <dd className="text-forest-600">{keywordsForLang.join(", ")}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500 text-xs">{t("Лицензия", "License")}</dt>
                  <dd className="text-forest-600">Creative Commons 4.0</dd>
                </div>
              </dl>
            </div>

            {/* "In this issue" card */}
            <div className="bg-white border border-stone-400 rounded-sm overflow-hidden">
              <div className="bg-forest-600 px-5 py-3">
                <h3 className="text-sm font-medium text-white tracking-wide">
                  {t("В этом номере", "In this issue")}
                </h3>
              </div>
              <div className="p-4">
                <Link
                  href={`/archive/${article.issue_year}/${article.issue_number}`}
                  className="flex items-center gap-2 text-sm text-copper-500 hover:text-copper-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("Содержание номера", "Table of Contents")}
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
