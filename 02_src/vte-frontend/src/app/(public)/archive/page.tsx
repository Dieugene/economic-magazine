import { api } from '@/lib/api/client';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import Link from 'next/link';

export default async function ArchiveIndexPage() {
  const years = await api.getYears();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Архив' },
        ]}
      />

      <div className="mb-10">
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-600 leading-tight">
          Архив номеров
        </h2>
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
