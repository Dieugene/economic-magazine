import { api } from '@/lib/api/client';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import PageHeading from '@/components/public/PageHeading';
import DocumentTitle from '@/components/public/DocumentTitle';
import Link from "@/components/public/HoverPrefetchLink";
import { connection } from 'next/server';

// Страница остаётся динамической, но данные для неё кэшируются.
//
// `connection()` вместо прежнего `dynamic = 'force-dynamic'`: тот запрещал
// кэшировать вообще что-либо (документация Next 16: он равносилен
// `cache: 'no-store'` на каждом запросе), а нужен он был только ради одного —
// чтобы страница не пререндерилась на сборке, где бэкенд недоступен.
// `connection()` даёт ровно это и ничего больше.
//
// 🛑 `fetchCache` здесь обязателен. По умолчанию ('auto') Next НЕ кэширует
// запросы, обнаруженные ПОСЛЕ Request-time API, а `connection()` — как раз
// такой API. Без этой строки кэш молча не включился бы: страница работает,
// ошибок нет, а бэкенд получает те же запросы на каждый показ.
export const fetchCache = 'default-cache';

export default async function ArchiveIndexPage() {
  await connection();
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
