import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import ArticleView from "./ArticleView";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);

  if (isNaN(articleId)) notFound();

  const article = await api.getArticle(articleId);
  if (!article) notFound();

  return <ArticleView article={article} />;
}
