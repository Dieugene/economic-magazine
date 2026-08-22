/**
 * Генерирует src/lib/legacy-redirects.generated.ts из CSV-карт в этой же папке.
 *
 * Источник карт — разбор в 01_tasks/002_doi-links/: адреса старого сайта журнала, на которые
 * до сих пор указывают зарегистрированные DOI. Сопоставление со статьями сделано по DOI
 * (в метаданных Crossref он есть, в базе журнала тот же DOI привязан к id статьи).
 *
 * Запуск: node scripts/legacy-redirects/generate.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "..", "src", "lib", "legacy-redirects.generated.ts");

/** Разбирает CSV с разделителем `;` и заголовком в первой строке. */
function readCsv(name) {
  const text = readFileSync(join(HERE, name), "utf8").replace(/^﻿/, "");
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split(";");
  return lines.map((line) => {
    const cells = line.split(";");
    return Object.fromEntries(cols.map((col, i) => [col, cells[i] ?? ""]));
  });
}

/**
 * Приводит источник к виду, который реально совпадёт с запросом.
 *
 * При trailingSlash: true Next дописывает слеш ко всем адресам, кроме файловых (с расширением),
 * а пользовательские правила матчатся строго — путь без слеша не совпадёт с правилом,
 * записанным со слешем, и наоборот. Поэтому слеш ставим ровно там, где он будет в запросе.
 */
function normalizeSource(path) {
  const isFile = /\.[a-z0-9]{2,5}$/i.test(path);
  if (isFile) return path.replace(/\/+$/, "");
  return path.endsWith("/") ? path : `${path}/`;
}

const entries = [];
const seen = new Set();

for (const [file, comment] of [
  ["old-indexphp-redirects.csv", "страницы старого движка (Joomla)"],
  ["old-pdf-redirects.csv", "прямые адреса PDF на старом сайте"],
]) {
  const rows = readCsv(file);
  for (const row of rows) {
    const source = normalizeSource(row.old_path);
    // Адрес записан так, как он лежит в метаданных DOI. Если там есть процент-кодирование
    // (в одном имени файла пробел записан как %20), кладём и раскодированный вариант —
    // какой из них дойдёт до правил, зависит от нормализации, а лишнее правило безвредно.
    const variants = new Set([source]);
    try {
      variants.add(normalizeSource(decodeURIComponent(row.old_path)));
    } catch {
      // некорректная последовательность %XX — оставляем только исходный вид
    }

    for (const variant of variants) {
      if (seen.has(variant)) {
        throw new Error(`Дубль источника: ${variant} (${file})`);
      }
      seen.add(variant);
      entries.push({
        source: variant,
        destination: `/article/${row.article_id}/`,
        group: comment,
        doi: row.doi,
      });
    }
  }
}

const body = entries
  .map((e) => `  // ${e.doi}\n  { source: ${JSON.stringify(e.source)}, destination: ${JSON.stringify(e.destination)} },`)
  .join("\n");

const out = `// СГЕНЕРИРОВАНО скриптом scripts/legacy-redirects/generate.mjs — правки вносить туда.
//
// Адреса старого сайта журнала, на которые указывают зарегистрированные DOI статей.
// После переезда на Next.js они отдают 404, а вместе с ними мертвы и DOI-ссылки в чужих
// публикациях, поисковиках и библиографиях. Каждому адресу сопоставлена страница статьи
// на новом сайте — сопоставление точное, по DOI.
//
// Адреса PDF (/files/...) сейчас до приложения не доходят: их обслуживает nginx и сам отдаёт
// 404. Правила для них лежат здесь заранее — они начнут работать, как только nginx перестанет
// перехватывать эти запросы, и не потребуют отдельного релиза.

export interface LegacyRedirect {
  source: string;
  destination: string;
}

export const legacyRedirects: LegacyRedirect[] = [
${body}
];
`;

writeFileSync(OUT, out, "utf8");
console.log(`legacy-redirects: ${entries.length} правил -> ${OUT}`);
