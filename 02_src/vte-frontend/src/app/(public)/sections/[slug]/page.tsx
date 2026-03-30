import Link from "next/link";
import { api } from "@/lib/api/client";
import Breadcrumbs from "@/components/public/Breadcrumbs";

const sectionNames: Record<string, string> = {
  "economic-theory": "Экономическая теория",
  methodology: "Методология экономической науки",
  "theory-to-policy": "От теории к экономической политике",
  "history-of-thought": "История мысли",
  interdisciplinary: "Междисциплинарные исследования",
  "economic-history": "Экономическая история",
  reviews: "Обзоры и рецензии",
};

function getSectionName(slug: string): string {
  return sectionNames[slug] || slug;
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sectionName = getSectionName(slug);
  const { results: articles } = await api.getSectionArticles(slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Рубрикатор", href: "/sections" },
          { label: sectionName },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-600 leading-tight mb-8">
          {sectionName}
        </h1>

        {articles.length === 0 ? (
          <p className="text-gray-500">В данной рубрике пока нет статей.</p>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="block group bg-white border border-stone-400 rounded-sm p-5 hover:border-copper-300 hover:shadow-sm transition-all"
              >
                <h2 className="font-serif text-lg font-semibold text-forest-600 group-hover:text-copper-500 transition-colors leading-snug">
                  {article.title.ru}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  {article.authors.map((a) => a.full_name.ru).join(", ")}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                  <span>
                    ВТЭ. {article.issue_year}. №{article.issue_number} (
                    {article.issue_sequential_number})
                  </span>
                  <span>С. {article.pages}</span>
                  {article.doi && <span>DOI: {article.doi}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
