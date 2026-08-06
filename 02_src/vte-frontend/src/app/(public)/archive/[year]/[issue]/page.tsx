import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { sortIssues } from "@/lib/utils/issues";
import IssueView from "./IssueView";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ year: string; issue: string }>;
}) {
  const { year, issue: issueParam } = await params;

  const yearNum = Number(year);
  const numberNum = Number(issueParam);

  let allIssues;
  try {
    allIssues = await api.getIssues(yearNum);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
  // Уникальность пары (year, number) бэк не гарантирует. Сортируем перед
  // поиском, чтобы при дубликате URL всегда открывал один и тот же выпуск,
  // а не тот, что бэк случайно поставил первым.
  const issueSummary = sortIssues(allIssues).find((i) => i.number === numberNum);
  if (!issueSummary) notFound();

  let data;
  try {
    data = await api.getIssue(issueSummary.id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
  if (!data) notFound();

  return <IssueView data={data} />;
}
