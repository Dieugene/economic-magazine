"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Article, Section } from "@/lib/types";

interface SectionViewProps {
  section: Section;
  articles: Article[];
}

export default function SectionView({ section, articles }: SectionViewProps) {
  const { lang, t } = useLanguage();
  const sectionName = lang === "en" && section.name.en ? section.name.en : section.name.ru;
  const journalShort = lang === "en" ? "IET" : "ВТЭ";
  const numberLabel = lang === "en" ? "No." : "№";
  const pagesPrefix = lang === "en" ? "Pp." : "С.";

  return (
    <>
      <DocumentTitle
        ru={section.name.ru}
        en={section.name.en ?? section.name.ru}
      />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Рубрикатор", en: "Sections" }, href: "/sections" },
          { label: section.name },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-600 leading-tight mb-8">
          {sectionName}
        </h1>

        {articles.length === 0 ? (
          <p className="text-gray-500">
            {t(
              "В данной рубрике пока нет статей.",
              "There are no articles in this section yet."
            )}
          </p>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => {
              const titleForLang = lang === "en" && article.title.en ? article.title.en : article.title.ru;
              const authorsForLang = (article.authors ?? [])
                .map((a) => (lang === "en" && a.full_name?.en ? a.full_name.en : a.full_name?.ru))
                .filter(Boolean)
                .join(", ");
              return (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="block group bg-white border border-stone-400 rounded-sm p-5 hover:border-copper-300 hover:shadow-sm transition-all"
                >
                  <h2 className="font-serif text-lg font-semibold text-forest-600 group-hover:text-copper-500 transition-colors leading-snug">
                    {titleForLang}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">{authorsForLang}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                    <span>
                      {journalShort}. {article.issue_year}. {numberLabel}{article.issue_number} (
                      {article.issue_sequential_number})
                    </span>
                    <span>{pagesPrefix} {article.pages}</span>
                    {article.doi && <span>DOI: {article.doi}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
