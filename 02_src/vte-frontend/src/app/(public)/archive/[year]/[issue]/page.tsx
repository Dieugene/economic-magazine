import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
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
  const issueSummary = allIssues.find((i) => i.number === numberNum);
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
