"use client";

import Breadcrumbs from "@/components/public/Breadcrumbs";
import PageHeading from "@/components/public/PageHeading";
import DocumentTitle from "@/components/public/DocumentTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { EditorialBoardMember } from "@/lib/types";

export default function EditorialBoardView({
  members,
}: {
  members: EditorialBoardMember[];
}) {
  const { lang } = useLanguage();
  const pick = (s?: { ru: string; en?: string } | null): string =>
    !s ? "" : (lang === "en" && s.en ? s.en : s.ru);

  return (
    <>
      <DocumentTitle ru="Редколлегия" en="Editorial Board" />
      <Breadcrumbs
        items={[
          { label: { ru: "Главная", en: "Home" }, href: "/" },
          { label: { ru: "Редколлегия", en: "Editorial Board" } },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <PageHeading
          ru="Редколлегия"
          en="Editorial Board"
          level={1}
          className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-stone-400 rounded-sm p-5"
            >
              <h2 className="font-serif text-lg font-semibold text-forest-600">
                {pick(member.full_name)}
              </h2>
              {pick(member.degree) && (
                <p className="text-sm text-gray-500 mt-1">{pick(member.degree)}</p>
              )}
              {pick(member.affiliation) && (
                <p className="text-sm text-gray-600 mt-1">{pick(member.affiliation)}</p>
              )}
              {pick(member.role) && (
                <p className="text-xs text-copper-500 font-medium mt-2">
                  {pick(member.role)}
                </p>
              )}

              <div className="mt-3 space-y-1 text-xs text-gray-500">
                {member.email && (
                  <p>
                    Email:{" "}
                    <a
                      href={`mailto:${member.email}`}
                      className="text-teal-600 hover:text-copper-400 transition-colors"
                    >
                      {member.email}
                    </a>
                  </p>
                )}
                {member.spin_code && <p>SPIN: {member.spin_code}</p>}
                {member.orcid && (
                  <p>
                    ORCID:{" "}
                    <a
                      href={`https://orcid.org/${member.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-copper-400 transition-colors"
                    >
                      {member.orcid}
                    </a>
                  </p>
                )}
                {member.scopus_id && <p>Scopus ID: {member.scopus_id}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
