import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import SectionView from "./SectionView";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // GET /sections/{slug}/ отдаёт рубрику вместе с её статьями — отдельного
  // запроса за списком статей не нужно (эндпоинт .../articles/ на бэке 404).
  let section;
  try {
    section = await api.getSection(slug);
  } catch {
    notFound();
  }
  if (!section) notFound();

  return <SectionView section={section} articles={section.articles ?? []} />;
}
