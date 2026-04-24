"use client";

import Link from "next/link";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import JournalCover from "@/components/public/JournalCover";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { IssueSummary } from "@/lib/types";

interface YearViewProps {
  year: string;
  issues: IssueSummary[];
}

export default function YearView({ year, issues }: YearViewProps) {
  const { lang, t } = useLanguage();
  const journalShort = lang === "en" ? "IET" : "ВТЭ";
  const numberLabel = lang === "en" ? "No." : "№";

  return (
    <>
      <DocumentTitle ru={`Архив за ${year} год`} en={`Archive ${year}`} />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Архив", en: "Archive" }, href: "/archive" },
          { label: year },
        ]}
      />

      <div className="mb-10">
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru={`Архив номеров за ${year} год`}
          en={`Issues of ${year}`}
        />
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
                {journalShort} {issue.year}, {numberLabel}&nbsp;{issue.number}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-8">
          {t(
            `Номера за ${year} год пока не опубликованы.`,
            `No issues for ${year} have been published yet.`
          )}
        </p>
      )}
    </>
  );
}
