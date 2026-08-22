import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import { sortIssues } from "@/lib/utils/issues";
import YearView from "./YearView";

export default async function YearArchivePage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  // Без этой проверки любой мусор в адресе (/archive/1999/, /archive/abc/) отдавал
  // пустую страницу с кодом 200 — для поисковика это «страница есть», а не «нет».
  if (isNaN(yearNum)) notFound();

  // Бэк отдаёт выпуски в произвольном порядке — сортируем сами.
  const issues = sortIssues(await api.getIssues(yearNum));
  if (issues.length === 0) notFound();

  return <YearView year={year} issues={issues} />;
}
