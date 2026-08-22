"use client";

import Link from "next/link";
import { Archive, Search, Home } from "lucide-react";
import DocumentTitle from "@/components/public/DocumentTitle";
import PageHeading from "@/components/public/PageHeading";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * Содержимое страницы «не найдено».
 *
 * Вариант задаёт вызывающая страница, а не догадка по адресу: корневой not-found
 * пререндерится один на все несопоставленные адреса, и определить по нему, что искал
 * читатель, невозможно. Про переезд сайта пишем только в общем варианте — читателю,
 * ошибшемуся в номере статьи, это сообщение ничего не объясняет.
 */
export type NotFoundVariant = "general" | "article" | "section" | "issue" | "year";

const TEXTS: Record<
  NotFoundVariant,
  { titleRu: string; titleEn: string; bodyRu: string; bodyEn: string }
> = {
  general: {
    titleRu: "Страница не найдена",
    titleEn: "Page not found",
    bodyRu:
      "Возможно, адрес устарел или ведёт на прежнюю версию сайта журнала. Все выпуски и статьи перенесены — их можно найти в архиве или через поиск.",
    bodyEn:
      "The address may be outdated or point to the previous version of the journal website. All issues and articles have been migrated — you can find them in the archive or through search.",
  },
  article: {
    titleRu: "Статья не найдена",
    titleEn: "Article not found",
    bodyRu:
      "Такой статьи в журнале нет: возможно, ссылка устарела или в адресе опечатка. Попробуйте найти статью по названию или автору.",
    bodyEn:
      "There is no such article in the journal: the link may be outdated or the address may contain a typo. Try searching by title or author.",
  },
  section: {
    titleRu: "Рубрика не найдена",
    titleEn: "Section not found",
    bodyRu:
      "Такой рубрики в журнале нет. Список рубрик есть в меню «Рубрикатор», а все материалы — в архиве выпусков.",
    bodyEn:
      "There is no such section in the journal. The list of sections is in the “Sections” menu, and all materials are in the archive.",
  },
  issue: {
    titleRu: "Выпуск не найден",
    titleEn: "Issue not found",
    bodyRu:
      "Такого выпуска нет. Возможно, ссылка устарела — все вышедшие номера собраны в архиве.",
    bodyEn:
      "There is no such issue. The link may be outdated — all published issues are collected in the archive.",
  },
  year: {
    titleRu: "Выпусков за этот год нет",
    titleEn: "No issues for this year",
    bodyRu:
      "За указанный год журнал не выходил или номера ещё не опубликованы. Журнал издаётся с 2017 года.",
    bodyEn:
      "The journal was not published in the specified year, or the issues are not published yet. The journal has been published since 2017.",
  },
};

const LINKS = [
  { href: "/archive", icon: Archive, ru: "Архив выпусков", en: "Archive of issues" },
  { href: "/search", icon: Search, ru: "Поиск по статьям", en: "Search articles" },
  { href: "/", icon: Home, ru: "Главная страница", en: "Home page" },
];

export default function NotFoundContent({
  variant = "general",
}: {
  variant?: NotFoundVariant;
}) {
  const { t } = useLanguage();
  const text = TEXTS[variant];

  return (
    <section className="py-12 sm:py-20 max-w-3xl">
      <DocumentTitle ru={text.titleRu} en={text.titleEn} />

      <p className="text-xs tracking-[0.2em] uppercase text-copper-400 mb-4">
        {t("Ошибка 404", "Error 404")}
      </p>
      <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />

      <PageHeading
        ru={text.titleRu}
        en={text.titleEn}
        level={1}
        className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-6"
      />

      <p className="text-base text-gray-600 leading-relaxed mb-10">
        {t(text.bodyRu, text.bodyEn)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {LINKS.map(({ href, icon: Icon, ru, en }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 bg-white border border-stone-400 rounded-sm px-5 py-4 hover:border-forest-600 transition-colors"
          >
            <Icon
              className="w-5 h-5 text-copper-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm text-forest-700 group-hover:text-forest-600">
              {t(ru, en)}
            </span>
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-10">
        {t(
          "Если вы перешли по ссылке из публикации и не нашли материал, напишите в редакцию: ",
          "If you followed a link from a publication and could not find the material, please write to the editorial office: "
        )}
        <a
          href="mailto:editorqet@inecon.ru"
          className="text-forest-600 underline hover:text-copper-400 transition-colors"
        >
          editorqet@inecon.ru
        </a>
      </p>
    </section>
  );
}
