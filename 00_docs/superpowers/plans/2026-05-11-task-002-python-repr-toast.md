# TASK-002: Python-репр в toast.error → читаемое сообщение — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Когда бэк возвращает 400 с телом-строкой в формате Python `repr` (например `{'references': [ErrorDetail(string='Значение в ключе ru: значение должно быть непустой строкой.', code='invalid')]}`), пользователь должен видеть в `toast.error` человечный текст из `string='...'`, а не сырой Python-репр.

**Architecture:** Изменение локализовано в одной функции `parseDrfBody` (`src/lib/api/errors.ts`). Когда `body` приходит строкой (это случается, если бэк отдал не-JSON в 400-ответе — `client.ts:142-148` ловит `JSON.parse` exception и оставляет сырой текст), мы пытаемся распознать в нём паттерн `ErrorDetail(string='<msg>'...)` регуляркой и вытащить читаемый текст. Если не сматчилось — текущий fallback (вернуть строку как есть) сохраняется.

**Tech Stack:** TypeScript 5, без новых зависимостей. Никакого тест-фреймворка в проекте нет (см. package.json) — верификация через одноразовый node-скрипт в `$env:TEMP` (per memory rule «temp scripts»), не через persistent тесты.

---

## File Structure

**Modify:**
- `02_src/vte-frontend/src/lib/api/errors.ts:30-39` — добавить попытку извлечения `ErrorDetail.string` из строкового body до возврата сырой строки.

**Не трогаем:**
- Логику обработки массивов и объектов в `parseDrfBody` (строки 41-77) — она корректна.
- Public API `parseApiError` (4 call sites: `articles/[id]/page.tsx`, `issues/[id]/page.tsx`, `issues/page.tsx`, сам errors.ts) — сигнатура и возвращаемый тип `string` не меняется.

---

## Task 1: Извлечь ErrorDetail.string из строкового body

**Files:**
- Modify: `02_src/vte-frontend/src/lib/api/errors.ts:30-44`

- [ ] **Step 1: Прочитать текущий `parseDrfBody`**

Открыть `02_src/vte-frontend/src/lib/api/errors.ts` и убедиться, что строки 30-44 совпадают с нижеприведённым. Если есть расхождения — остановиться и сообщить.

Текущий код (строки 30-44):
```typescript
function parseDrfBody(body: unknown): string | null {
  if (body === null || body === undefined) return null;

  if (typeof body === "string") {
    const trimmed = body.trim();
    if (!trimmed) return null;
    // Не показываем сырые HTML-страницы 404/500 от nginx как сообщение об ошибке.
    if (trimmed.startsWith("<")) return null;
    return trimmed;
  }

  if (Array.isArray(body)) {
    const parts = body.map((item) => parseDrfBody(item)).filter(Boolean) as string[];
    return parts.length ? parts.join("; ") : null;
  }
```

- [ ] **Step 2: Заменить строковую ветку — добавить извлечение Python-репра**

Заменить блок (строки 33-39):

```typescript
  if (typeof body === "string") {
    const trimmed = body.trim();
    if (!trimmed) return null;
    // Не показываем сырые HTML-страницы 404/500 от nginx как сообщение об ошибке.
    if (trimmed.startsWith("<")) return null;
    return trimmed;
  }
```

на:

```typescript
  if (typeof body === "string") {
    const trimmed = body.trim();
    if (!trimmed) return null;
    // Не показываем сырые HTML-страницы 404/500 от nginx как сообщение об ошибке.
    if (trimmed.startsWith("<")) return null;
    // Бэк иногда отдаёт ошибки сериалайзера как Python repr-строку:
    // `{'references': [ErrorDetail(string='msg', code='invalid')]}`. JSON.parse
    // в client.ts падает на одинарных кавычках/нестандартных литералах — body
    // приходит сырой строкой. Если внутри есть ErrorDetail(string=...) —
    // извлекаем читаемые сообщения. Иначе показываем строку как есть.
    const fromRepr = extractErrorDetailMessages(trimmed);
    if (fromRepr) return fromRepr;
    return trimmed;
  }
```

- [ ] **Step 3: Добавить вспомогательную функцию `extractErrorDetailMessages` ниже `humanizeField`**

В конец файла (после `humanizeField`, перед последним `}` файла нет — функция top-level) добавить:

```typescript
function extractErrorDetailMessages(s: string): string | null {
  // Соответствует `ErrorDetail(string='msg')` и `ErrorDetail(string="msg")`.
  // Сообщения могут содержать любые символы, кроме кавычки того же типа,
  // которой обрамлены — для одиночных кейсов DRF этого достаточно. Если
  // встретится экранирование (\'), оставим как есть — пользователю всё
  // равно понятнее, чем сырая Python-строка.
  const re = /ErrorDetail\(string=(['"])(.*?)\1/g;
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const msg = m[2].trim();
    if (msg) found.push(msg);
  }
  return found.length ? found.join("; ") : null;
}
```

- [ ] **Step 4: Typecheck**

Выполнить:
```
cd D:/_workspace/economic-magazine/02_src/vte-frontend
npx tsc --noEmit
```
Ожидание: код проходит typecheck без ошибок. Если есть ошибки — починить (вероятнее всего опечатка), затем повторить.

- [ ] **Step 5: Verify через одноразовый node-скрипт**

Создать скрипт `$env:TEMP/vte-task002-verify.mjs` (Windows PowerShell: `$env:TEMP`, Bash: `/tmp` уже в %TEMP%):

```javascript
// Sanity-check: импортируем parseApiError и прогоняем три сценария.
import { parseApiError } from 'file:///D:/_workspace/economic-magazine/02_src/vte-frontend/src/lib/api/errors.ts';
// ^ прямого импорта .ts из node не будет; используем подход через regexp проверки:

const cases = [
  // Реальный пример из QA-сессии:
  { name: 'refs.ru', body: "{'references': [ErrorDetail(string='Значение в ключе ru: значение должно быть непустой строкой.', code='invalid')]}", expectContains: 'Значение в ключе ru' },
  // Двойные кавычки:
  { name: 'double-quotes', body: '[ErrorDetail(string="Bad date", code="invalid")]', expectContains: 'Bad date' },
  // Несколько ErrorDetail:
  { name: 'multiple', body: "{'a': [ErrorDetail(string='msg1', code='x')], 'b': [ErrorDetail(string='msg2', code='y')]}", expectContains: 'msg1; msg2' },
  // Не-Python-репр:
  { name: 'plain-text', body: 'Plain error text without errordetail', expectContains: 'Plain error text' },
  // HTML — должен скипнуться выше:
  { name: 'html', body: '<html><body>404</body></html>', expectContains: null },
];

const re = /ErrorDetail\(string=(['"])(.*?)\1/g;
function extract(s) {
  const found = [];
  let m;
  while ((m = re.exec(s)) !== null) { found.push(m[2].trim()); }
  re.lastIndex = 0;
  return found.length ? found.join('; ') : null;
}

for (const c of cases) {
  const got = extract(c.body);
  const ok = c.expectContains === null
    ? got === null
    : got !== null && got.includes(c.expectContains);
  console.log(`${ok ? 'OK ' : 'FAIL'}  ${c.name.padEnd(15)} → ${JSON.stringify(got)}`);
}
```

Запустить:
```
node $env:TEMP\vte-task002-verify.mjs
```
(под Git Bash: `node "$TEMP/vte-task002-verify.mjs"`)

Ожидание: 4 строки `OK`, 1 строка `OK html` (потому что у html ErrorDetail нет, extract вернёт null — это совпадает с expectContains:null).

После проверки удалить файл:
```
del $env:TEMP\vte-task002-verify.mjs
```

- [ ] **Step 6: Build smoke-check**

```
cd D:/_workspace/economic-magazine/02_src/vte-frontend
npx next build
```
Ожидание: сборка проходит без ошибок (warnings допустимы, как обычно в Next 16). Если новые ошибки — починить и повторить.

- [ ] **Step 7: Commit**

```
cd D:/_workspace/economic-magazine
git add 02_src/vte-frontend/src/lib/api/errors.ts
git commit -m "$(cat <<'EOF'
fix(toast): extract ErrorDetail messages from Python-repr 400-bodies

When the backend returns a 400 with body in Python repr form
(`{'field': [ErrorDetail(string='msg', code='invalid')]}`), JSON.parse
in client.ts fails and body is kept as raw string. parseDrfBody
previously returned that raw string verbatim, so users saw Python
internals in the toast. Now extractErrorDetailMessages pulls every
`ErrorDetail(string='...')` segment and joins them; falls back to the
raw string if no match (preserves prior behaviour for non-Python-repr
bodies).

Closes TASK-002.
EOF
)"
```

---

## Self-Review

**1. Spec coverage:**
- AC1 «человечный текст без `ErrorDetail(string=...)` и фигурных Python-скобок» — Steps 2-3 извлекают `string=...` и возвращают строки соединёнными через `; `.
- AC2 «другие поля с условной обязательностью» — регулярка `ErrorDetail(string=…)` ловит любые сообщения этого типа, не привязана к `references`.
- AC3 «регрессия не появилась: 200/OK по-прежнему success-toast; неизвестные форматы продолжают показывать что-то» — Step 2 сохраняет `return trimmed` как fallback; путь объектного `body` не тронут (массивы, `{detail}`, `{message}`, `non_field_errors`, `{field: [...]}` обрабатываются как раньше); 200/OK не доходит до `parseApiError` (он реагирует на throw).

**2. Placeholder scan:** TODO/TBD/«handle edge cases» отсутствуют. Каждый шаг с конкретным кодом или командой.

**3. Type consistency:** `extractErrorDetailMessages: (s: string) => string | null` совместима с использованием на строке 39 (`const fromRepr = extractErrorDetailMessages(trimmed); if (fromRepr) return fromRepr;`). Без новых типов.

---

## Notes

- Regex consciously narrow: matches только `ErrorDetail(string='...')` / `ErrorDetail(string="...")`. Не пытается распарсить нюансы Python-escape — если внутри сообщения есть кавычка того же типа экранированная как `\'`, регулярка остановится раньше. Это допустимо: lone messages редко содержат свои собственные кавычки, и даже усечённое сообщение читаемее сырого репра.
- Если бэк начнёт отдавать корректный JSON (как было раньше), `JSON.parse` в client.ts сработает, `body` будет объектом, ветка строкового извлечения не вступит — старая логика DRF object/array будет работать как раньше.
