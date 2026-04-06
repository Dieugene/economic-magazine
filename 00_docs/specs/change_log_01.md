# Changelog #01 — Корректировки API-спецификации

Дата: 2026-04-06

Обновления в связи с поступившими вопросами и уточнениями.

---

## 1. Структура IssueFull — подтверждение вложенности sections → articles

**Файл:** `00_docs/architecture/api-spec.yaml` (схема `IssueFull`)

Спецификация уже описывала правильную вложенную структуру — статьи находятся внутри рубрик:

```json
{
  "sections": [
    {
      "section": { "slug": "economic-theory", "name": { "ru": "...", "en": "..." } },
      "articles": [
        { "id": 1, "title": { "ru": "..." }, "authors": [...], ... }
      ]
    }
  ]
}
```

Swagger UI мог отображать `allOf` неочевидно. Описание и пример в спецификации подтверждают: **номер → рубрики → статьи в каждой рубрике** — именно такая вложенность.

Фронтенд работает с этой структурой: `IssueFull.sections[].articles[]`.

---

## 2. Reference — убран `id`, уточнено хранение

**Файлы:**
- `00_docs/architecture/api-spec.yaml` — схема `Reference`
- `02_src/vte-frontend/src/lib/types/index.ts` — интерфейс `Reference`
- `02_src/vte-frontend/src/lib/api/mock/data.ts` — mock-данные
- `02_src/vte-frontend/src/app/(public)/article/[id]/page.tsx` — рендеринг

**Что изменено:**

Поле `id` убрано из `Reference`. Список литературы уникален для каждой статьи, переиспользование между статьями не предполагается. Отдельная самостоятельная сущность с собственным эндпоинтом для references не нужна.

Формат Reference теперь:
```json
{
  "order": 1,
  "text_ru": "Рубинштейн А.Я. Теория опекаемых благ. СПб.: Алетейя, 2018.",
  "text_en": "Rubinstein A.Ya. Theory of Patronized Goods. St. Petersburg: Aletheia, 2018."
}
```

Хранение на стороне бэкенда — JSON-поле или дочерняя таблица без отдельного эндпоинта (на усмотрение разработчика).

---

## 3. Убран параметр `lang` из всех публичных эндпоинтов

**Файл:** `00_docs/architecture/api-spec.yaml` — все публичные пути

**Что изменено:**

Параметр `?lang=ru|en` удалён из query-параметров всех публичных эндпоинтов:
- `GET /api/issues/`
- `GET /api/issues/{id}/`
- `GET /api/articles/{id}/`
- `GET /api/sections/`
- `GET /api/sections/{slug}/articles/`
- `GET /api/editorial-board/`
- `GET /api/pages/{slug}/`
- `GET /api/search/`

**Причина:** Все локализованные поля (`title`, `abstract`, `full_name`, `affiliation`, `name` и т.д.) всегда возвращаются в формате `LocalizedString { ru, en? }` — оба языка в одном ответе. Фронтенд переключает язык на клиенте без повторных запросов к API.

Схема `Lang` также удалена из раздела `components/schemas`.

---

## 4. Уточнение полей ArticleSummary для эндпоинта `/sections/{slug}/articles/`

**Файл:** `00_docs/architecture/api-spec.yaml` — описание эндпоинта

**Что изменено:**

Добавлено описание с перечнем полей, необходимых фронтенду для карточки статьи в рубрике:

| Поле | Назначение |
|------|-----------|
| `id` | Ссылка на полную статью |
| `title` | Заголовок карточки |
| `authors` (только `full_name`) | Список авторов |
| `abstract` | Раскрывающаяся аннотация |
| `doi` | Отображается на карточке |
| `pages` | Диапазон страниц |
| `pdf_url` | Кнопка скачивания |
| `pdf_size_kb` | Размер файла |
| `issue_year` | Группировка по выпускам |
| `issue_number` | Номер выпуска |
| `issue_sequential_number` | Сквозной номер |

Полные метаданные (bibliography, keywords, xml_url) **не нужны** — они загружаются отдельно на странице статьи через `GET /api/articles/{id}/`.
