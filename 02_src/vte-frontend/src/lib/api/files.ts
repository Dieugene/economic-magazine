// Ссылки на скачивание файлов.
//
// Бэк закрыл прямую раздачу PDF: по адресам из `pdf_file` (старый префикс
// `/files/…`) приходит 404, потому что скачивание документов теперь идёт через
// эндпоинты с проверкой прав. Значит поле годится только как признак «файл
// загружен», а сам адрес фронт обязан строить из id — через `download_pdf`
// (анонимно доступны для материалов опубликованных номеров, для черновиков
// требуют токена). Картинок это не касается: `cover_file` раздаётся напрямую и
// открывается как есть.
//
// База берётся плоской, без ветвления на server/client из `client.ts`: по
// ссылке кликает браузер, а не Node. Серверная база там — внутренний docker-хост
// (`http://backend:8000/api`), и попади она в href, ссылка была бы нерабочей у
// всех, плюс атрибут разошёлся бы между SSR-разметкой и гидратацией.
const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL || '/backend';
const USE_MOCKS = process.env.NEXT_PUBLIC_API_MODE === 'mock';

interface FileOwner {
  id: number;
  pdf_file: string | null;
}

export interface PdfLink {
  // адрес для обычной навигации — им пользуется анонимный читатель
  href: string;
  // путь для скачивания из-под токена; null в mock-режиме, где ходить некуда
  apiPath: string | null;
}

// Возвращают null, когда файла нет, — то есть ровно тогда же, когда `pdf_file`.
// Так вызывающий код держит одно выражение и как флаг («показывать ли кнопку»),
// и как адрес, и не может нарисовать кнопку у выпуска или статьи без PDF.

export function issuePdfLink(issue: FileOwner): PdfLink | null {
  if (!issue.pdf_file) return null;
  if (USE_MOCKS) return { href: issue.pdf_file, apiPath: null };
  const apiPath = `/issues/${issue.id}/download_pdf/`;
  return { href: `${PUBLIC_API_BASE}${apiPath}`, apiPath };
}

export function articlePdfLink(article: FileOwner): PdfLink | null {
  if (!article.pdf_file) return null;
  if (USE_MOCKS) return { href: article.pdf_file, apiPath: null };
  const apiPath = `/articles/${article.id}/download_pdf/`;
  return { href: `${PUBLIC_API_BASE}${apiPath}`, apiPath };
}

// Имя файла из заголовка ответа: бэк присылает его в Content-Disposition, и при
// скачивании блобом это единственный источник настоящего имени.
// `filename*` (RFC 5987, кириллица) имеет приоритет над обычным `filename`.
export function filenameFromDisposition(header: string | null): string | null {
  if (!header) return null;
  const extended = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (extended) {
    try {
      return decodeURIComponent(extended[1].trim());
    } catch {
      return extended[1].trim();
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain ? plain[1].trim() : null;
}

// Имя файла для подписи «Текущий файл» в админке. Путь в поле остался прежним,
// поэтому имя из него по-прежнему читается, хотя сам URL уже не открывается.
export function fileNameFromUrl(url: string): string {
  const raw = url.split('/').pop() ?? '';
  try {
    return decodeURIComponent(raw);
  } catch {
    // одиночный `%` в имени ломает decodeURIComponent — показываем как есть
    return raw;
  }
}

// ── JATS XML статьи ─────────────────────────────────────────────
//
// Бэк генерирует документ на лету: `GET /articles/{id}/create_jats_xml/`.
// Эндпоинт только читает — проба на боевом показала, что запись статьи после
// вызова не меняется, несмотря на «create_» в имени. Токен нужен всегда (аноним
// получает 401), поэтому ссылкой это не сделать — только запрос из-под сессии.
//
// Имя бэк присылает — `Content-Disposition: attachment; filename="article_318.xml"`, — но мы
// сознательно ставим своё. Файл кладут руками в чужую систему пачкой по номеру, и среди десятка
// одинаковых `article_NNN.xml` не разобраться, где что; `vte-2023-2-7-21.xml` называет год, номер и
// страницы. Захочет бэк отдавать осмысленное имя — здесь достаточно будет вернуть `filename` из
// ответа (`filenameFromDisposition` выше уже умеет его читать, включая кириллицу).

interface JatsXmlOwner {
  id: number;
  issue_year: number | null;
  issue_number: number | null;
  pages: string;
}

export interface JatsXmlTarget {
  apiPath: string;
  filename: string;
}

// null — значит скачивать неоткуда (mock-режим): в моках эндпоинта нет, а запрос
// ушёл бы в прокси и упал там. Тот же приём, что у ссылок на PDF выше.
export function articleJatsXml(article: JatsXmlOwner): JatsXmlTarget | null {
  if (USE_MOCKS) return null;
  return {
    apiPath: `/articles/${article.id}/create_jats_xml/`,
    filename: jatsXmlFileName(article),
  };
}

export function jatsXmlFileName(article: JatsXmlOwner): string {
  const { issue_year: year, issue_number: number, pages } = article;
  if (!year || !number) return `article-${article.id}.xml`;
  // Страницы приходят как «7-21», «7–21» (длинное тире) или «7, 21» — приводим
  // к одному виду, чтобы имя файла не зависело от того, как их набрал редактор.
  const range = (pages ?? '')
    .replace(/[^\d]+/g, '-')
    .replace(/^-|-$/g, '');
  return range
    ? `vte-${year}-${number}-${range}.xml`
    : `vte-${year}-${number}-article-${article.id}.xml`;
}
