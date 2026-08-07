"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminApi, ApiError } from "@/lib/api/client";
import type { PdfLink } from "@/lib/api/files";

interface PdfDownloadLinkProps {
  // null означает «файла нет» — компонент просто ничего не рисует, чтобы
  // вызывающему коду не приходилось повторять проверку рядом с вызовом
  link: PdfLink | null;
  // true только там, где материал может быть неопубликованным, — то есть на
  // страницах админки. См. комментарий ниже, почему это решает вызывающий код
  requiresAuth?: boolean;
  className?: string;
  title?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

// Ссылка на PDF через защищённый эндпоинт бэка.
//
// По умолчанию это обычная ссылка: материалы опубликованных номеров бэк отдаёт
// без токена, и такая ссылка живёт как всякая другая — правый клик, «сохранить
// как», открыть в новой вкладке, ноль JS.
//
// В админке материал может быть черновиком, а на него бэк без Authorization
// отвечает отказом; заголовок к обычной навигации браузер не приложит, поэтому
// там скачиваем через fetch и отдаём файл блобом.
//
// ⚠️ Признак «нужен токен» задаёт вызывающая страница, а не наличие токена в
// localStorage. Проверка «я залогинен?» отвечает не на тот вопрос: у редактора,
// открывшего публичную страницу, токен есть, и публичное скачивание уходило бы
// в авторизованную ветку. Протухший токен там даёт 401, а неудачное обновление
// стирает сессию — то есть чтение публичного PDF роняло бы админскую сессию.
export default function PdfDownloadLink({
  link,
  requiresAuth = false,
  className,
  title,
  "aria-label": ariaLabel,
  children,
}: PdfDownloadLinkProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!requiresAuth || !link?.apiPath) return; // обычная навигация
    // Модификаторы («открыть в новой вкладке», «сохранить как») не перехватываем.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const { blob, filename } = await adminApi.downloadProtectedFile(link.apiPath);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename ?? "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Освобождаем не сразу: Firefox и Safari успевают отменить сохранение,
      // если адрес отозвать в том же кадре, что и клик.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      const status = err instanceof ApiError ? err.status : null;
      toast.error(
        status === 403 || status === 401
          ? "Нет доступа к файлу. Войдите заново и повторите."
          : status === 404
            ? "Файл не найден."
            : "Не удалось скачать файл. Попробуйте позже."
      );
    } finally {
      setBusy(false);
    }
  }

  if (!link) return null;

  return (
    <a
      href={link.href}
      download
      onClick={handleClick}
      className={className}
      title={title}
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
    >
      {children}
    </a>
  );
}
