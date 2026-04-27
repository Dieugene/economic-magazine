import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import ArticleView from "./ArticleView";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);

  if (isNaN(articleId)) notFound();

  let article;
  try {
    article = await api.getArticle(articleId);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
  if (!article) notFound();

  return <ArticleView article={article} />;
}
