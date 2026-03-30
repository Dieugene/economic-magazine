import { api } from "@/lib/api/client";
import Breadcrumbs from "@/components/public/Breadcrumbs";

export default async function EditorialBoardPage() {
  const members = await api.getEditorialBoard();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Редколлегия" },
        ]}
      />

      <section>
        <div className="w-[60px] h-[2px] bg-copper-400 mb-6" />
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-600 leading-tight mb-8">
          Редколлегия
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-stone-400 rounded-sm p-5"
            >
              <h2 className="font-serif text-lg font-semibold text-forest-600">
                {member.full_name.ru}
              </h2>
              {member.degree?.ru && (
                <p className="text-sm text-gray-500 mt-1">{member.degree.ru}</p>
              )}
              {member.affiliation?.ru && (
                <p className="text-sm text-gray-600 mt-1">
                  {member.affiliation.ru}
                </p>
              )}
              {member.role && (
                <p className="text-xs text-copper-400 font-medium mt-2">
                  {member.role}
                </p>
              )}

              <div className="mt-3 space-y-1 text-xs text-gray-400">
                {member.email && (
                  <p>
                    Email:{" "}
                    <a
                      href={`mailto:${member.email}`}
                      className="text-teal-500 hover:text-copper-400 transition-colors"
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
                      className="text-teal-500 hover:text-copper-400 transition-colors"
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
