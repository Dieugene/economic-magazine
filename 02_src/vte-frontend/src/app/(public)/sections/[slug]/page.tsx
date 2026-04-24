import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import SectionView from "./SectionView";
import type { Article } from "@/lib/types";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let section;
  try {
    section = await api.getSection(slug);
  } catch {
    notFound();
  }
  if (!section) notFound();

  let articleIds: number[] = [];
  try {
    const sectionWithIds = await api.getSectionArticles(slug);
    articleIds = (sectionWithIds as unknown as { articles?: number[] }).articles ?? [];
  } catch {
    articleIds = [];
  }

  let articles: Article[] = [];
  try {
    const allArticles = await api.listArticles();
    const idSet = new Set(articleIds);
    articles = allArticles.filter((a) => idSet.has(a.id));
  } catch {
    articles = [];
  }

  return <SectionView section={section} articles={articles} />;
}
