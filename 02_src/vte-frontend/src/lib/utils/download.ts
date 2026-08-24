// Сохранение полученного блоба как файла.
//
// Нужно там, где файл приходит не навигацией, а запросом из-под токена: браузер
// не приложит `Authorization` к обычной ссылке, поэтому ответ приходит блобом, и
// «скачиванием» его делает временная ссылка с `download`.
//
// Только клиент: трогает `document` и `URL`.

export function saveBlobAsFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Освобождаем не сразу: Firefox и Safari успевают отменить сохранение, если
  // адрес отозвать в том же кадре, что и клик.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// Отличает настоящий XML от отказа, приехавшего с кодом 200.
//
// Прецедент такой у бэка есть (см. `submitManuscript` в `client.ts`), а цена
// ошибки здесь выше обычной: файл уходит в чужую систему руками, и подмену
// заметят уже там. Смотрим только начало — пролог, комментарий или сам корень.
export function looksLikeXml(head: string): boolean {
  return /^﻿?\s*<(\?xml|!--|!DOCTYPE|[A-Za-z_])/.test(head);
}
