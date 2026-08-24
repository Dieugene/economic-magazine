import { api } from '@/lib/api/client';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import PageHeading from '@/components/public/PageHeading';
import DocumentTitle from '@/components/public/DocumentTitle';
import Link from "@/components/public/HoverPrefetchLink";

// Серверный fetch к API — рендерим на каждый запрос, не на этапе билда,
// чтобы билд не зависел от доступности бэкенда.
export const dynamic = 'force-dynamic';

export default async function ArchiveIndexPage() {
  const years = await api.getYears();

  return (
    <>
      <DocumentTitle ru="Архив номеров" en="Issue Archive" />
      <Breadcrumbs
        items={[
          { label: { ru: 'Главная', en: 'Home' }, href: '/' },
          { label: { ru: 'Архив', en: 'Archive' } },
        ]}
      />

      <div className="mb-10">
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading ru="Архив номеров" en="Issue Archive" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {years.map((year) => (
          <Link
            key={year}
            href={`/archive/${year}`}
            className="flex items-center justify-center bg-white border border-stone-400 rounded-sm px-6 py-5 text-xl font-serif font-bold text-forest-600 hover:border-copper-400 hover:text-copper-500 hover:bg-copper-50 transition-all duration-200"
          >
            {year}
          </Link>
        ))}
      </div>
    </>
  );
}
