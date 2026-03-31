import { api } from '@/lib/api/client';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import JournalCover from '@/components/public/JournalCover';
import ArticleCard from '@/components/public/ArticleCard';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function getLastPage(sections: { articles: { pages: string }[] }[]): number {
  let max = 0;
  for (const s of sections) {
    for (const a of s.articles) {
      const end = parseInt(a.pages.split('-')[1], 10);
      if (end > max) max = end;
    }
  }
  return max;
}

// Short section names for sidebar nav
const SHORT_NAMES: Record<string, string> = {
  'economic-theory': 'Экономическая теория',
  'methodology': 'Методология',
  'theory-to-policy': 'Теория и политика',
  'history-of-thought': 'История мысли',
  'interdisciplinary': 'Междисциплинарные',
  'economic-history': 'Эконом. история',
  'reviews': 'Обзоры и рецензии',
};

export default async function IssuePage({
  params,
}: {
  params: Promise<{ year: string; issue: string }>;
}) {
  const { year, issue: issueParam } = await params;

  // For now, map to issue ID 1 (only mock issue available)
  const issueId = 1;
  const data = await api.getIssue(issueId);

  if (!data) {
    return <div className="py-16 text-center text-gray-500">Выпуск не найден</div>;
  }

  const lastPage = getLastPage(data.sections);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Архив', href: '/archive' },
          { label: String(data.year), href: `/archive/${data.year}` },
          { label: `\u2116 ${data.number} (${data.sequential_number})` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Issue header */}
          <div className="mb-10">
            <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight">
              {'\u2116'} {data.number} ({data.sequential_number}) / {data.year}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span>Дата выхода: {formatDate(data.published_date)}</span>
              <span className="text-stone-500">|</span>
              <span>{data.article_count} статей</span>
              <span className="text-stone-500">|</span>
              <span>С. 1{'\u2013'}{lastPage}</span>
            </div>
            {data.full_pdf_url && (
              <div className="mt-5">
                <a
                  href={data.full_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-forest-600 text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-forest-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Весь выпуск (PDF)
                </a>
              </div>
            )}
          </div>

          {/* Sections with articles */}
          {data.sections.map((sectionGroup, sIdx) => (
            <section key={sectionGroup.section.slug} className="mb-10">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-forest-600">
                <span className="bg-forest-600 text-white text-xs font-medium px-2.5 py-1 rounded-sm tracking-wide uppercase">
                  {ROMAN[sIdx] ?? sIdx + 1}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-600">
                  {sectionGroup.section.name.ru}
                </h3>
              </div>

              {sectionGroup.articles.map((article, aIdx) => (
                <div key={article.id} className={aIdx < sectionGroup.articles.length - 1 ? 'mb-3' : ''}>
                  <ArticleCard
                    authors={article.authors.map((a) => a.full_name.ru).join(', ')}
                    title={article.title.ru}
                    href={`/article/${article.id}`}
                    pages={article.pages}
                    pdfSizeKb={article.pdf_size_kb}
                    pdfUrl={article.pdf_url}
                    abstract={article.abstract?.ru ?? null}
                  />
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            {/* This issue info */}
            <div className="bg-white border border-stone-400 rounded-sm overflow-hidden">
              <div className="bg-forest-600 px-5 py-3">
                <h3 className="text-sm font-medium text-white tracking-wide uppercase">Этот номер</h3>
              </div>
              <div className="p-5">
                <JournalCover number={data.number} year={data.year} className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Статей:</span>
                    <span className="text-forest-600 font-medium">{data.article_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Страниц:</span>
                    <span className="text-forest-600 font-medium">{lastPage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Дата:</span>
                    <span className="text-forest-600 font-medium">{formatDateShort(data.published_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick nav */}
            <div className="mt-6 bg-white border border-stone-400 rounded-sm p-5">
              <h3 className="text-sm font-medium text-forest-600 mb-3 tracking-wide uppercase">Рубрики номера</h3>
              <nav className="space-y-1.5 text-sm">
                {data.sections.map((sg, i) => (
                  <a
                    key={sg.section.slug}
                    href={`#section-${sg.section.slug}`}
                    className="block text-gray-600 hover:text-copper-500 transition-colors"
                  >
                    {ROMAN[i]}. {SHORT_NAMES[sg.section.slug] ?? sg.section.name.ru}{' '}
                    <span className="text-gray-500">({sg.articles.length})</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
