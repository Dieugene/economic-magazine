# #70 — IssueFull.sections пуст: разбор. **Это не баг бэка.**

**Дата:** 2026-05-03
**Статус:** диагноз закрыт. Бэк работает по контракту. Фронт не отправляет `sections_slugs` при создании/редактировании номера и хардкодит список рубрик в форме статьи.

## Контракт по swagger (`/api/schema/`)

- **`/sections/`** — глобальный CRUD-справочник рубрик: `GET / POST` на `/sections/`, `GET / PUT / PATCH / DELETE` на `/sections/{slug}/`. Каждая рубрика — `slug + name {ru, en}`.
- **`Issue.sections_slugs`** (write-only) — массив slug'ов рубрик, к которым подписан конкретный выпуск. Передаётся в `POST /issues/` и `PATCH /issues/{id}/`.
- **`Issue.sections`** (read-only) — массив наполненных рубрик с вложенными статьями. Содержит **только те** рубрики, что есть в `sections_slugs` этого выпуска.

Фрагмент примера из swagger (POST `/issues/`):

```json
{ "year": 2026, "number": 1, "sequential_number": 1, "sections_slugs": ["ekonomicheskaja-teorija", "metodologija-ekonomicheskoj-nauki"] }
```

То есть рубрики **не предзаданы и не привязаны к номеру автоматически по статьям** — выпуск должен явно подписаться на нужные рубрики.

## Точное воспроизведение и подтверждение

Боевой бэк: `http://185.180.230.243/api/`. Префикс `/api/` обязателен.

JWT-access (валиден до **2026-05-04 14:42:52 UTC**, ~15 часов):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc3ODU2NTcyLCJpYXQiOjE3Nzc4MDI1NzIsImp0aSI6IjNlYzk4ZTA1NDM5NjRiYTdhMTIzOGUzN2RkMDkwNmY0IiwidXNlcl9pZCI6IjQifQ.iT1HpSQ1ABvQfqu0Tz0jz3T_5sBksNmdyU3ldEXWErE
```

Refresh (на случай протухания):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3ODQwNzM3MiwiaWF0IjoxNzc3ODAyNTcyLCJqdGkiOiI3Njk0ZTZjZTM0NmQ0ZTExODdkYjIwM2M1MjM2ODhkYiIsInVzZXJfaWQiOiI0In0.d0LBREKJCHwXNhaVxPndZ6zBmcXcIolRuSnRCsdkqEE
```

Refresh: `POST http://185.180.230.243/api/auth/refresh/  body {"refresh":"<…>"}`.

### Шаг 1. Проверить «пустой» state на issue 7

```
GET http://185.180.230.243/api/issues/7/
Authorization: Bearer <access>
```

Ответ:

```json
{ "id": 7, "status": "Published", "articles_count": 1, "sections": [], ... }
```

`sections: []` — потому что `sections_slugs` пустой.

### Шаг 2. Привязать рубрику к выпуску

```
PATCH http://185.180.230.243/api/issues/7/
Authorization: Bearer <access>
Content-Type: application/json

{"sections_slugs":["ekonomicheskaja-teorija"]}
```

### Шаг 3. Перезапросить — sections наполнен

```
GET http://185.180.230.243/api/issues/7/
```

Ответ (сокращён):

```json
{
  "id": 7,
  "status": "Published",
  "articles_count": 1,
  "sections": [
    {
      "slug": "ekonomicheskaja-teorija",
      "name": { "ru": "Экономическая теория", "en": "Economic theory" },
      "articles": [
        { "id": 10, "title": {...}, "pages": "5-7", "authors": [...], "pdf_file": "..." }
      ]
    }
  ]
}
```

После этого публичная страница `/archive/2026/1/` корректно показывает 1 статью в рубрике.

## Что нужно сделать на фронте

1. **Форма номера** (`/control/issues/[id]/`):
   - подгружать список доступных рубрик из `GET /sections/`;
   - давать мульти-выбор;
   - отправлять `sections_slugs` в POST `/issues/` (при создании) и PATCH `/issues/{id}/` (при редактировании).

2. **Форма статьи** (`/control/articles/[id]/`):
   - убрать хардкод 7 рубрик;
   - брать список из `IssueFull.sections` номера, к которому привязывается статья (или из `/sections/`, если на форме статьи допускается выбрать любую — нужно уточнить требования);
   - если у номера ещё нет привязанных рубрик, показать осмысленное сообщение «сначала добавьте рубрики на странице номера».

3. **Опционально**: отдельная страница CRUD для рубрик (`/sections/`), если заказчик планирует менять справочник.

## Что заведомо в порядке у бэка

- POST `/articles/` — 201, статья сохраняется.
- `articles_count` — корректный.
- Изменение статуса `PUT /issues/{id}/update_status/` — работает, требует загруженного PDF у выпуска и каждой статьи.
- Файлы (`pdf_file`, `cover_file`) приходят с публичного домена `185.180.230.243`, без `http://backend:8000`.

## Не путать с похожими

- Прошлогодний #54 (sections empty + article_count=0) был связан с этим же контрактом.
- #59 (POST `/articles/` 500 на `articles_count`) — отдельный, реально закрытый.
- abstract null отвергается — намеренное поведение нового контракта.
