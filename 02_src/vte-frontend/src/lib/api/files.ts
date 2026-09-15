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
//
// ⚠️ Читается это только пока запрос идёт на свой origin. Задать
// `NEXT_PUBLIC_API_URL` (в `.env.example` такой вариант прямо предложен «за
// reverse-proxy») значит сделать запрос кросс-доменным, а `Content-Disposition`
// не входит в список заголовков, доступных JS по умолчанию: `headers.get` вернёт
// `null` без единой ошибки, и все файлы начнут сохраняться под запасными именами.
// То есть согласованное с заказчиком правило «XML называется как PDF» отключится
// молча. Понадобится такая схема — бэку нужен `Access-Control-Expose-Headers`.
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
// Бэк собирает документ по адресу `GET /articles/{id}/create_jats_xml/`.
// ⚠️ Смысл эндпоинта менялся дважды. На боевом он только читает (проба: запись
// статьи после вызова не меняется, несмотря на «create_» в имени). На бэке с
// одним полем он ГЕНЕРИРОВАЛ файл и писал ссылку в `xml_url` — в том числе
// поверх адреса РЦНИ, отсюда подтверждение перед вызовом в админке. На бэке с
// двумя полями (стенд, 14.09.2026) он пишет в `xml_file`, а внешний адрес в
// `xml_rcsi_url` не трогает — там подтверждение не нужно. Токен нужен всегда,
// поэтому ссылкой это не сделать — только запрос из-под сессии.
//
// Имя файла у скачивания (`download_xml`) задаёт бэк, и наше дело — его не трогать: заказчик
// решил, что XML называется так же, как PDF статьи («Попросту — xml привязывается к тому ПДФ,
// который загружен. Название у них одинаковое. Формат разный»), и бэк это исполняет —
// `Chaplygina_VTE_2018_1.pdf` → `Chaplygina_VTE_2018_1.xml`. Из того же решения следует
// правило «нет PDF — нет XML»: имени взять неоткуда, и на возражение бэкендера заказчик
// ответил «И это правильно». Отсюда проверка `pdf_file` в `articleXmlLinks` ниже.
//
// ⚠️ У СТАРОГО бэка (боевой) своего имени по существу нет: `create_jats_xml` отдаёт документ
// как `article_318.xml`. Поэтому имя там фронт ставит сам — и по тому же правилу, от PDF
// (`xmlFileNameFor` ниже). Прежняя схема `vte-2023-2-7-21.xml` — год, номер, страницы — осталась
// только запасной: она удобнее для пакетной выкладки, где файлы кладут в чужую систему по номеру,
// но правило заказчика общее, и владелец это подтвердил. Ветка старого бэка живёт до выкатки
// нового на боевой: там `create_jats_xml` документа уже не отдаёт, а отвечает сообщением.

interface JatsXmlOwner {
  id: number;
  issue_year: number | null;
  issue_number: number | null;
  pages: string;
  pdf_file: string | null;
}

// ── Два бэка, две схемы полей XML ───────────────────────────────
//
// ⚠️ ВРЕМЕННАЯ развилка: на боевом бэке у статьи одно поле `xml_url` — и наш
// сгенерированный файл, и внешний адрес РЦНИ лежат в нём по очереди; на стенде
// с 14.09.2026 полей два: `xml_file` (файл, собранный бэком) и `xml_rcsi_url`
// (адрес на сайте РЦНИ). Одна сборка фронта ходит на оба, поэтому понимает обе
// схемы. **Удалить ветку `xml_url` сразу после выката нового бэка на боевой** —
// иначе она переживёт всех, кто помнит, зачем она.
export interface ArticleXmlFields {
  // новая схема
  xml_file?: string | null;
  xml_rcsi_url?: string | null;
  // старая схема (боевой)
  xml_url?: string | null;
}

// Схему определяем по НАЛИЧИЮ ключа, а не по значению: на стенде `xml_rcsi_url`
// пуст у всех статей до миграции, и «пусто — значит старая схема» увело бы
// правку редактора в ключ `xml_url`, которого у нового бэка нет. DRF чужой ключ
// молча проглатывает и отвечает 200 — потеря была бы невидимой.
export function hasSplitXmlFields(article: ArticleXmlFields): boolean {
  return 'xml_rcsi_url' in article || 'xml_file' in article;
}

// Пустая строка у Django значит то же, что null (URLField хранит `''`).
function cleanXmlValue(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export interface ArticleXmlSources {
  // Файл на нашем сервере. ⚠️ Форма зависит от деплоя, а не от схемы: за
  // reverse-proxy внутренний origin вырезается в `client.ts`, и приходит путь
  // от корня (`/files/…`), а при обращении к бэку по внешнему адресу — полный
  // `http://185.180.230.243/files/…`. Значит значение берём как есть.
  server: string | null;
  // Внешний адрес XML (РЦНИ). Ведёт на чужой сервер.
  rcsi: string | null;
}

export function articleXmlSources(article: ArticleXmlFields): ArticleXmlSources {
  if (hasSplitXmlFields(article)) {
    return {
      server: cleanXmlValue(article.xml_file),
      rcsi: cleanXmlValue(article.xml_rcsi_url),
    };
  }
  // Старая схема: смысл значения приходится угадывать по нему самому — другого
  // признака нет. Всё, что не РЦНИ, считаем своим файлом: `download_xml` на
  // старом бэке проксирует и внешние адреса, поэтому скачивание работает в
  // обоих случаях.
  const legacy = cleanXmlValue(article.xml_url);
  if (!legacy) return { server: null, rcsi: null };
  return isRcsiXmlUrl(legacy)
    ? { server: null, rcsi: legacy }
    : { server: legacy, rcsi: null };
}

// РЦНИ — внешний источник XML, о котором договорились. На старой схеме по этому
// признаку РАЗЛИЧАЮТСЯ два смысла одного поля; на новой поле своё, и проверка
// нужна только на вводе в админке — чтобы редактор не положил во внешнее поле
// путь к нашему файлу.
export function isRcsiXmlUrl(url: string): boolean {
  return /^https?:\/\/([a-z0-9-]+\.)*rcsi\.science\//i.test(url);
}

// Годится ли значение внешнего поля XML для ОТПРАВКИ на бэк.
//
// ⚠️ Поле у бэка — `URLField` (`xml_rcsi_url` на стенде, `xml_url` на боевом),
// и на путь от корня оно отвечает 400 «Введите правильный URL». Проверка
// повторяет бэковскую, а не смягчает её: значение, которое здесь не прошло,
// там получит 400.
//
// Регистр схемы не проверяем: `HTTPS://…` — такой же валидный адрес.
export function isSendableXmlUrl(value: string): boolean {
  return /^https?:\/\/[^\s/?#]+/i.test(value) && value.length <= XML_URL_MAX_LENGTH;
}

// Длина поля у бэка (`max_length` из OPTIONS на старом, `maxLength` из схемы на
// новом — совпали). Держим тут же, чтобы форма отказывала до запроса, а не
// после 400.
export const XML_URL_MAX_LENGTH = 200;

// Можно ли показать значение прямой ссылкой «открыть файл».
// Путь от корня — наш же сайт; полный адрес — тоже (его отдаёт бэк, когда фронт
// ходит к нему по внешнему хосту). А вот `//host` увёл бы на чужой сервер под
// видом своего — его сюда не пускаем.
export function isViewableXmlHref(value: string): boolean {
  if (value.startsWith('//')) return false;
  return value.startsWith('/') || /^https?:\/\//i.test(value);
}

export interface ArticleXmlLinks {
  // Внешний адрес (РЦНИ) — как его вписали руками. Ведёт на чужой сервер.
  rcsi: string | null;
  // Скачивание через наш эндпоинт.
  download: { href: string; apiPath: string | null; fallbackFilename: string } | null;
}

// Куда ведут кнопки XML у статьи. Их две, и это дословная просьба заказчика:
// «оставить старую ссылку на рцни, и добавить новую — xml», «Давайте 2 кнопки».
//
// ⚠️ На НОВОЙ схеме кнопка скачивания живёт только при непустом `xml_file`.
// Это осознанная смена поведения: у статьи, где заполнен только адрес РЦНИ,
// `download_xml` на стенде отвечает 404 — умеет ли новый бэк проксировать
// внешний адрес, как умел старый, проверить не на чем (ни одной такой статьи на
// стенде нет). Вопрос задан бэкендеру; ответит «проксирует» — снять условие.
// На СТАРОЙ схеме поведение прежнее: одно поле, и скачивание работает и для
// адреса РЦНИ.
//
// ⚠️ Проверка PDF стоит ТОЛЬКО у скачивания: имя файла бэк берёт от PDF, а
// ссылка на РЦНИ от нашего PDF не зависит.
//
// null означает «показывать нечего»: объект с двумя пустыми полями остался бы
// truthy, и вызывающий код нарисовал бы пустой блок.
export function articleXmlLinks(
  article: JatsXmlOwner & ArticleXmlFields
): ArticleXmlLinks | null {
  const { server, rcsi } = articleXmlSources(article);
  const hasDownloadSource = hasSplitXmlFields(article) ? !!server : !!(server || rcsi);
  // В моках эндпоинта нет, запрос ушёл бы в прокси и упал там.
  const apiPath =
    USE_MOCKS || !article.pdf_file || !hasDownloadSource
      ? null
      : `/articles/${article.id}/download_xml/`;
  const download = apiPath
    ? {
        href: `${PUBLIC_API_BASE}${apiPath}`,
        apiPath,
        // Только на случай ответа без Content-Disposition: обычно имя даёт бэк.
        fallbackFilename: xmlFileNameFor(article),
      }
    : null;
  return rcsi || download ? { rcsi, download } : null;
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
    filename: xmlFileNameFor(article),
  };
}

// Имя XML-файла по правилу заказчика: то же, что у PDF статьи, только расширение
// другое. Одна функция на оба пути — и на запасное имя при скачивании, и на имя,
// под которым сохраняется документ от старого бэка; иначе один и тот же документ
// назывался бы по-разному в зависимости от того, откуда его взяли.
//
// Сверено со стендом на статьях 12, 118 и 154: выведенное здесь имя совпадает с
// тем, что бэк присылает в `Content-Disposition`, знак в знак.
function xmlFileNameFor(article: JatsXmlOwner): string {
  return xmlFileNameFromPdfUrl(article.pdf_file) ?? jatsXmlFileName(article);
}

// null — значит из адреса PDF имени не вышло, и звать надо запасную схему.
// Разбор нарочно придирчивый: имя уходит в чужую систему, и «почти правильное»
// там хуже, чем честный откат.
export function xmlFileNameFromPdfUrl(pdfUrl: string | null): string | null {
  if (!pdfUrl) return null;
  // Хвост запроса и якорь в имя файла попасть не должны: `…1.pdf?v=3` иначе
  // превратился бы в `…1.pdf?v=3.xml` — расширение не совпало бы с шаблоном.
  const raw = pdfUrl.split('?')[0].split('#')[0].split('/').pop() ?? '';
  // Пустой хвост — это адрес, кончающийся слешем. Брать имя предыдущего сегмента
  // нельзя: получилось бы имя каталога, и притом молча.
  if (!raw) return null;
  let name: string;
  try {
    name = decodeURIComponent(raw);
  } catch {
    // Одиночный `%` в имени роняет декодирование. Для подписи в форме сырую
    // строку показать можно, а для имени файла нельзя — там остались бы `%D0%A7`.
    return null;
  }
  if (!name) return null;
  // Срезаем ровно `.pdf` и ничего больше. «Что похоже на расширение» — плохое
  // правило для этого поля: у `Ivanov_v.1` точка часть имени, и `Ivanov_v.xml`
  // был бы уже другим файлом. Имени без `.pdf` просто дописываем расширение.
  return `${name.replace(/\.pdf$/i, '')}.xml`;
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
