import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import AbstractTabs from "@/components/public/AbstractTabs";
import type { ArticleType, Author } from "@/lib/types";

function getAuthorInitials(author: Author): string {
  const name = author.full_name.ru;
  const parts = name.split(/[\s.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  // For names like "А.Я. Рубинштейн" take first letter of first part and first letter of last part
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatArticleType(type: ArticleType): string {
  const labels: Record<ArticleType, string> = {
    scientific: "Научная статья",
    review: "Обзор",
    book_review: "Рецензия",
    editorial: "От редактора",
  };
  return labels[type];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);

  if (isNaN(articleId)) {
    notFound();
  }

  const article = await api.getArticle(articleId);

  if (!article) {
    notFound();
  }

  const referencesRu = article.references
    ?.filter((r) => r.text_ru)
    .sort((a, b) => a.order - b.order);

  const referencesEn = article.references
    ?.filter((r) => r.text_en)
    .sort((a, b) => a.order - b.order);

  const citationAuthors = article.authors
    .map((a) => a.full_name.ru)
    .join(", ");

  const citationString = `${citationAuthors}. ${article.title.ru} // Вопросы теоретической экономики. ${article.issue_year}. \u2116 ${article.issue_number} (${article.issue_sequential_number}). С. ${article.pages}.${article.doi ? ` DOI: ${article.doi}.` : ""}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Архив", href: "/archive" },
          { label: String(article.issue_year), href: `/archive/${article.issue_year}` },
          {
            label: `\u2116 ${article.issue_number} (${article.issue_sequential_number})`,
            href: `/archive/${article.issue_year}/${article.issue_number}`,
          },
          { label: "Статья" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        {/* Left column (2/3) */}
        <article className="lg:col-span-2">
          {/* Article header */}
          <div>
            {/* Section badge + article type */}
            <div className="mb-4">
              <span className="inline-block text-xs font-medium text-copper-600 bg-copper-50 border border-copper-200 px-2.5 py-1 rounded-sm uppercase tracking-wide">
                {article.section.name.ru}
              </span>
              <span className="inline-block text-xs text-gray-500 ml-2">
                {formatArticleType(article.article_type)}
              </span>
            </div>

            {/* Copper accent divider */}
            <div className="w-[60px] h-[2px] bg-copper-400 mb-5" />

            {/* Title RU */}
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-600 leading-tight mb-3">
              {article.title.ru}
            </h2>

            {/* Title EN */}
            {article.title.en && (
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
                  <span className="text-gray-600">Страницы:</span>{" "}
                  <span className="text-forest-600 font-medium">
                    {article.pages}
                  </span>
                </div>
                {article.udk && (
                  <div>
                    <span className="text-gray-600">УДК:</span>{" "}
                    <span className="text-forest-600">{article.udk}</span>
                  </div>
                )}
                {article.jel_codes && article.jel_codes.length > 0 && (
                  <div>
                    <span className="text-gray-600">JEL:</span>{" "}
                    <span className="text-forest-600">
                      {article.jel_codes.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Authors */}
            <div className="mb-8">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Авторы
              </h3>
              <div className="space-y-4">
                {article.authors.map((author) => (
                  <div
                    key={author.id}
                    className="flex items-start gap-4 p-4 bg-white border border-stone-400 rounded-sm"
                  >
                    <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-forest-600 font-serif text-sm font-bold">
                        {getAuthorInitials(author)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-forest-700">
                        {author.full_name.ru}
                      </p>
                      {author.full_name.en && (
                        <p className="text-sm text-gray-500 italic">
                          {author.full_name.en}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {author.affiliation.ru}
                      </p>
                      {author.affiliation.en && (
                        <p className="text-sm text-gray-500 italic">
                          {author.affiliation.en}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        {author.orcid && (
                          <a
                            href={`https://orcid.org/${author.orcid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
                          >
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-1.2 18h-2.4V9.6h2.4V18zM12 8.4c-.996 0-1.8-.804-1.8-1.8S11.004 4.8 12 4.8s1.8.804 1.8 1.8-.804 1.8-1.8 1.8zm6 9.6h-2.4v-4.2c0-1.2-.6-1.8-1.5-1.8-.9 0-1.5.6-1.5 1.8V18h-2.4V9.6h2.4v1.2c.6-.9 1.5-1.5 2.7-1.5 1.8 0 2.7 1.2 2.7 3.3V18z" />
                            </svg>
                            ORCID: {author.orcid}
                          </a>
                        )}
                        {author.email && (
                          <a
                            href={`mailto:${author.email}`}
                            className="text-gray-500 hover:text-forest-600 transition-colors"
                          >
                            {author.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates */}
            {(article.received_date || article.accepted_date) && (
              <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500">
                {article.received_date && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Получена: {formatDate(article.received_date)}
                  </div>
                )}
                {article.accepted_date && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Принята в печать: {formatDate(article.accepted_date)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Abstract tabs (RU/EN) */}
          {article.abstract && (
            <AbstractTabs
              abstract_ru={article.abstract.ru}
              abstract_en={article.abstract.en}
              keywords_ru={article.keywords?.ru}
              keywords_en={article.keywords?.en}
            />
          )}

          {/* Funding */}
          {article.funding && (
            <div className="mb-8 p-4 bg-copper-50 border border-copper-200 rounded-sm">
              <h4 className="text-xs font-medium text-copper-700 uppercase tracking-wider mb-1">
                Финансирование
              </h4>
              <p className="text-sm text-gray-700">{article.funding.ru}</p>
            </div>
          )}

          {/* Bibliography (Russian) */}
          {referencesRu && referencesRu.length > 0 && (
            <div className="mb-8">
              <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
                Литература
              </h3>
              <ol className="space-y-3 text-sm text-gray-700 leading-relaxed list-decimal list-outside pl-5">
                {referencesRu.map((ref) => (
                  <li key={ref.id}>{ref.text_ru}</li>
                ))}
              </ol>
            </div>
          )}

          {/* References (English) */}
          {referencesEn && referencesEn.length > 0 && (
            <div className="mb-8">
              <h3 className="font-serif text-2xl font-semibold text-forest-600 mb-4">
                References
              </h3>
              <ol className="space-y-3 text-sm text-gray-700 leading-relaxed list-decimal list-outside pl-5">
                {referencesEn.map((ref) => (
                  <li key={ref.id}>{ref.text_en}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Citation block */}
          <div className="p-5 bg-forest-50 border border-forest-200 rounded-sm">
            <h4 className="text-xs font-medium text-forest-600 uppercase tracking-wider mb-2">
              Для цитирования
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {citationString}
            </p>
          </div>
        </article>

        {/* Right sidebar (1/3) */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Download section */}
            <div className="bg-white border border-stone-400 rounded-sm p-5">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Скачать
              </h3>
              <div className="space-y-2">
                {article.pdf_url && (
                  <a
                    href={article.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-forest-600 text-white rounded-sm hover:bg-forest-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3M6 20h12a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <span className="text-sm font-medium">PDF статьи</span>
                      {article.pdf_size_kb && (
                        <span className="text-xs text-white/60 ml-1">
                          {article.pdf_size_kb} КБ
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
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    <div>
                      <span className="text-sm font-medium">XML (JATS)</span>
                      <span className="text-xs text-gray-600 ml-1">РЦНИ</span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Metadata card */}
            <div className="bg-white border border-stone-400 rounded-sm p-5">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Метаданные
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500 text-xs">Номер</dt>
                  <dd>
                    <Link
                      href={`/archive/${article.issue_year}/${article.issue_number}`}
                      className="text-forest-600 font-medium hover:text-copper-400 transition-colors"
                    >
                      ВТЭ {"\u2116"} {article.issue_number} (
                      {article.issue_sequential_number}) / {article.issue_year}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">Рубрика</dt>
                  <dd className="text-forest-600">{article.section.name.ru}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">Тип</dt>
                  <dd className="text-forest-600">
                    {formatArticleType(article.article_type)}
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
                    <dt className="text-gray-500 text-xs">УДК</dt>
                    <dd className="text-forest-600">{article.udk}</dd>
                  </div>
                )}
                {article.jel_codes && article.jel_codes.length > 0 && (
                  <div>
                    <dt className="text-gray-500 text-xs">JEL</dt>
                    <dd className="text-forest-600">
                      {article.jel_codes.join(", ")}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500 text-xs">Лицензия</dt>
                  <dd className="text-forest-600">Creative Commons 4.0</dd>
                </div>
              </dl>
            </div>

            {/* "In this issue" card */}
            <div className="bg-white border border-stone-400 rounded-sm overflow-hidden">
              <div className="bg-forest-600 px-5 py-3">
                <h3 className="text-sm font-medium text-white tracking-wide">
                  В этом номере
                </h3>
              </div>
              <div className="p-4">
                <Link
                  href={`/archive/${article.issue_year}/${article.issue_number}`}
                  className="flex items-center gap-2 text-sm text-copper-500 hover:text-copper-600 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Содержание номера
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
