import { api } from "@/lib/api/client";
import YearView from "./YearView";

export default async function YearArchivePage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  const issues = await api.getIssues(yearNum);

  return <YearView year={year} issues={issues} />;
}
