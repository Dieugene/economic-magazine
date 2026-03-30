import { api } from "@/lib/api/client";
import HomeContent from "@/components/public/HomeContent";

export default async function HomePage() {
  const latestIssue = await api.getLatestIssue();

  return (
    <HomeContent
      latestIssue={{
        year: latestIssue.year,
        number: latestIssue.number,
        sequential_number: latestIssue.sequential_number,
        published_date: latestIssue.published_date,
      }}
    />
  );
}
