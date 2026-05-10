"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { adminApi, ApiError } from "@/lib/api/client";
import type { Article } from "@/lib/types";
import ArticleView from "@/app/(public)/article/[id]/ArticleView";

export default function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const articleId = Number(id);

  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Number.isNaN(articleId)) {
      setError("Некорректный идентификатор статьи");
      setLoading(false);
      return;
    }
    let cancelled = false;
    adminApi
      .getArticle(articleId)
      .then((data) => {
        if (!cancelled) {
          setArticle(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : "Не удалось загрузить статью");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  return (
    <div className="space-y-4">
      <div className="bg-copper-50 border border-copper-300 rounded-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-copper-700">
          <Eye className="w-4 h-4" />
          <span className="font-medium">Превью статьи</span>
          <span className="text-copper-600">
            — это административный предпросмотр; для гостей публичная страница доступна только после публикации номера.
          </span>
        </div>
        <Link
          href={`/control/articles/${articleId}`}
          className="inline-flex items-center gap-1.5 text-sm text-copper-700 hover:text-copper-800 px-3 py-1.5 border border-copper-300 rounded-sm bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
          К редактированию
        </Link>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Загрузка статьи...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {article && <ArticleView article={article} />}
    </div>
  );
}
