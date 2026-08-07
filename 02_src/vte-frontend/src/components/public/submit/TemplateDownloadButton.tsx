"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminApi, ApiError } from "@/lib/api/client";

export default function TemplateDownloadButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const { blob, filename } = await adminApi.downloadTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename ?? "vte-article-template.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Отзыв в том же кадре, что и клик, отменяет сохранение в Firefox и Safari
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      // 404 — файла на бэке нет, тут редакция действительно нужна. Отказ по
      // правам разводим отдельно: он означает поломку доступа, а не отсутствие
      // шаблона, и «обратитесь в редакцию» увело бы диагностику не туда —
      // именно на этом баг с чужим токеном в запросе прожил незамеченным.
      const status = err instanceof ApiError ? err.status : null;
      if (status === 404) {
        toast.error("Шаблон временно недоступен. Обратитесь в редакцию: editorqet@inecon.ru");
      } else if (status === 401 || status === 403) {
        toast.error("Сервер отклонил запрос шаблона. Обновите страницу и попробуйте снова.");
      } else {
        toast.error("Не удалось скачать шаблон. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm font-medium bg-forest-600 text-white px-4 py-2 rounded-sm hover:bg-forest-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
      </svg>
      {loading ? "Загрузка..." : "Скачать шаблон оформления"}
    </button>
  );
}
