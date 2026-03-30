import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";

const sections = [
  { num: 1, name: "Экономическая теория", slug: "economic-theory" },
  { num: 2, name: "Методология экономической науки", slug: "methodology" },
  { num: 3, name: "От теории к экономической политике", slug: "theory-to-policy" },
  { num: 4, name: "История мысли", slug: "history-of-thought" },
  { num: 5, name: "Междисциплинарные исследования", slug: "interdisciplinary" },
  { num: 6, name: "Экономическая история", slug: "economic-history" },
  { num: 7, name: "Обзоры и рецензии", slug: "reviews" },
];

export default function SectionsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Рубрикатор" },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8">
          Рубрикатор
        </h1>

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
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
