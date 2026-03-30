import Breadcrumbs from "@/components/public/Breadcrumbs";
import SearchForm from "@/components/public/SearchForm";

export default function SearchPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Поиск" },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8">
          Поиск
        </h1>

        <SearchForm />
      </section>
    </>
  );
}
