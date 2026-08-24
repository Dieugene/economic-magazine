import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import type { IssueFull } from "@/lib/types";
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

  // Списочный ответ вкладывает в выпуск те же рубрики со статьями, что отдаёт
  // detail: объекты сверены побайтно (issues/13/ против того же выпуска в
  // ?year=2021). Значит второй запрос за уже скачанным не нужен — это минус
  // 159 КБ и один поход на бэк с каждого показа номера. Если бэк когда-нибудь
  // перестанет вкладывать рубрики в список, ветка ниже возьмёт detail, как
  // раньше, и страница не сломается.
  let data: IssueFull | null = issueSummary.sections
    ? (issueSummary as IssueFull)
    : null;
  if (!data) {
    try {
      data = await api.getIssue(issueSummary.id);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) notFound();
      throw e;
    }
  }
  if (!data) notFound();

  return <IssueView data={data} />;
}
