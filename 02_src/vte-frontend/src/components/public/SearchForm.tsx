"use client";

import { useState } from "react";
import Link from "@/components/public/HoverPrefetchLink";
import type { Article } from "@/lib/types";
import { api } from "@/lib/api/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function SearchForm() {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const data = await api.search({ q: trimmed });
      setResults(data.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const journalShort = lang === "en" ? "IET" : "ВТЭ";
  const numberLabel = lang === "en" ? "No." : "№";
  const pagesPrefix = lang === "en" ? "Pp." : "С.";

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Введите название статьи или фамилию автора...",
              "Enter article title or author name..."
            )}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-400 rounded-sm text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-copper-400 focus:ring-1 focus:ring-copper-200 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-forest-600 text-white text-sm font-medium rounded-sm hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : t("Найти", "Search")}
        </button>
      </form>

      {results !== null && (
        <>
          {results.length === 0 ? (
            <p className="text-gray-500 text-sm">{t("Ничего не найдено", "Nothing found")}</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">
                {t("Найдено:", "Found:")} {results.length}
              </p>
              {results.map((article) => {
                const titleForLang = lang === "en" && article.title.en ? article.title.en : article.title.ru;
                const authorsForLang = (article.authors ?? [])
                  .map((a) => (lang === "en" && a.full_name?.en ? a.full_name.en : a.full_name?.ru))
                  .filter(Boolean)
                  .join(", ");
                const sectionForLang = lang === "en" && article.section_name.en ? article.section_name.en : article.section_name.ru;
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
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                      <span>{sectionForLang}</span>
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
        </>
      )}
    </div>
  );
}
