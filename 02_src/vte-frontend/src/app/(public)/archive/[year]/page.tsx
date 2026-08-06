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
  // Бэк отдаёт выпуски в произвольном порядке — сортируем сами.
  const issues = sortIssues(await api.getIssues(yearNum));

  return <YearView year={year} issues={issues} />;
}
