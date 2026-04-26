import { api } from "@/lib/api/client";
import HomeContent from "@/components/public/HomeContent";
import DocumentTitle from "@/components/public/DocumentTitle";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestIssue = await api.getLatestIssue();

  return (
    <>
    <DocumentTitle ru="О журнале" en="About" />
    <HomeContent
      latestIssue={
        latestIssue
          ? {
              year: latestIssue.year,
              number: latestIssue.number,
              sequential_number: latestIssue.sequential_number,
              published_date: latestIssue.published_date,
            }
          : null
      }
    />
    </>
  );
}
