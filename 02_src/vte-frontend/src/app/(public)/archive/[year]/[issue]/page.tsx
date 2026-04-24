import { api } from "@/lib/api/client";
import IssueView from "./IssueView";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ year: string; issue: string }>;
}) {
  const { year, issue: issueParam } = await params;

  const yearNum = Number(year);
  const numberNum = Number(issueParam);

  const allIssues = await api.getIssues(yearNum);
  const issueSummary = allIssues.find((i) => i.number === numberNum);

  if (!issueSummary) {
    return <div className="py-16 text-center text-gray-500">Issue not found</div>;
  }

  const data = await api.getIssue(issueSummary.id);
  if (!data) {
    return <div className="py-16 text-center text-gray-500">Issue not found</div>;
  }

  const articles = await api.getIssueArticles(issueSummary.id);

  return <IssueView data={data} articles={articles} />;
}
