"use client";

import Link from "@/components/public/HoverPrefetchLink";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const sections = [
  { num: 1, ru: "Экономическая теория", en: "Economic Theory", slug: "ekonomicheskaja-teorija" },
  { num: 2, ru: "Методология экономической науки", en: "Methodology of Economics", slug: "metodologija-ekonomicheskoj-nauki" },
  { num: 3, ru: "От теории к экономической политике", en: "From Theory to Economic Policy", slug: "ot-teorii-k-ekonomicheskoj-politike" },
  { num: 4, ru: "История мысли", en: "History of Thought", slug: "istorija-mysli" },
  { num: 5, ru: "Междисциплинарные исследования", en: "Interdisciplinary Studies", slug: "mezhdistsiplinarnye-issledovanija" },
  { num: 6, ru: "Экономическая история", en: "Economic History", slug: "ekonomicheskaja-istorija" },
  { num: 7, ru: "Обзоры и рецензии", en: "Reviews", slug: "obzory-i-retsenzii" },
];

export default function SectionsPage() {
  const { t } = useLanguage();

  return (
    <>
      <DocumentTitle ru="Рубрикатор" en="Sections" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Рубрикатор", en: "Sections" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Рубрикатор"
          en="Sections"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((s) => (
            <Link
              key={s.slug}
              href={`/sections/${s.slug}`}
              className={`group flex items-center gap-3 p-4 bg-white border border-stone-400 rounded-sm hover:border-copper-300 hover:shadow-sm transition-all${
                s.num === 7 ? " sm:col-span-2" : ""
              }`}
            >
              <span className="w-8 h-8 bg-forest-50 text-forest-600 font-serif text-sm font-bold rounded-sm flex items-center justify-center group-hover:bg-copper-50 group-hover:text-copper-500 transition-colors">
                {s.num}
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-forest-600 transition-colors">
                {t(s.ru, s.en)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
