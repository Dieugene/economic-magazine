import { api } from '@/lib/api/client';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import JournalCover from '@/components/public/JournalCover';
import Link from 'next/link';

export default async function YearArchivePage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  const issues = await api.getIssues(yearNum);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Архив', href: '/archive' },
          { label: year },
        ]}
      />

      <div className="mb-10">
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-600 leading-tight">
          Архив номеров за {year} год
        </h2>
      </div>

      {issues && issues.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/archive/${issue.year}/${issue.number}`}
              className="group block"
            >
              <JournalCover
                number={issue.number}
                year={issue.year}
                className="transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
              />
              <p className="mt-3 text-sm text-forest-600 font-medium group-hover:text-copper-500 transition-colors">
                ВТЭ {issue.year}, {'\u2116'}&nbsp;{issue.number}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-8">Номера за {year} год пока не опубликованы.</p>
      )}
    </>
  );
}
