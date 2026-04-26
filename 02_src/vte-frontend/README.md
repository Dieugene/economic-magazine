# ВТЭ — Фронтенд журнала «Вопросы теоретической экономики»

## О проекте

Фронтенд научного журнала «Вопросы теоретической экономики» (questionset.ru). Включает публичный сайт для читателей (архив номеров, страницы статей, рубрикатор) и админ-панель для редакции (управление номерами, карточки статей, загрузка PDF).

Фронтенд работает автономно на mock-данных. Переключение на реальный бэкенд (Django REST API) — через переменную окружения, без изменений в коде.

## Технологии

- **Next.js 16** (App Router, React Server Components, SSG/ISR)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **next-intl** (двуязычность RU/EN)
- **Lucide React** (иконки)

## Быстрый старт

### Требования

- Node.js 20+
- npm

### Установка и запуск

```bash
cd 02_src/vte-frontend
cp .env.example .env.local   # создать файл настроек
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

### Настройка окружения

Файл `.env.example` содержит все необходимые переменные с комментариями. При первом запуске скопируйте его в `.env.local`:

```bash
cp .env.example .env.local
```

По умолчанию фронтенд работает на mock-данных — бэкенд не нужен.

### Переключение на реальный API

В `.env.local`:

```
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_PROXY_TARGET=http://185.180.230.243/api
```

Перезапустите `npm run dev`. Все клиентские запросы фронта будут проксироваться через `/backend/*` своего origin (см. `src/app/backend/[...path]/route.ts`), что снимает проблемы с CORS.

Если бэкенд доступен напрямую (CORS настроен), можно вместо прокси задать абсолютный URL:

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Структура проекта

```
src/
├── app/
│   ├── (public)/               # Публичный сайт
│   │   ├── page.tsx            # Главная / О журнале
│   │   ├── archive/[year]/     # Архив за год (сетка обложек)
│   │   ├── archive/[year]/[issue]/  # Страница номера (содержание по рубрикам)
│   │   ├── article/[id]/       # Страница статьи (метаданные, аннотация, PDF)
│   │   ├── sections/[slug]/    # Рубрикатор (статьи по рубрике)
│   │   ├── editorial-board/    # Редколлегия
│   │   ├── authors/            # Авторам
│   │   ├── ethics/             # Этика публикаций
│   │   ├── contacts/           # Контакты
│   │   ├── search/             # Поиск
│   │   └── privacy/            # Политика персональных данных
│   ├── (control)/control/      # Админ-панель
│   │   ├── login/              # Авторизация
│   │   ├── issues/             # Список номеров + создание/редактирование
│   │   ├── issues/[id]/        # Редактирование номера, список статей
│   │   └── articles/[id]/      # Карточка статьи (форма)
│   └── layout.tsx              # Корневой layout
├── components/
│   ├── public/                 # Компоненты публичного сайта (Header, Footer, Nav)
│   ├── admin/                  # Компоненты админки (Sidebar, формы)
│   └── ui/                     # Базовые UI-компоненты
├── lib/
│   ├── api/
│   │   ├── client.ts           # API-клиент (mock/real переключение)
│   │   └── mock/               # Mock-данные (JSON-фикстуры)
│   ├── types/
│   │   └── index.ts            # TypeScript типы API-контрактов
│   └── i18n/                   # Конфигурация интернационализации
└── messages/                   # Переводы (ru.json, en.json)
```

## API-контракт

### Эндпоинты, используемые фронтендом

Базовый URL: `https://<host>/api/`. Фронт обращается через прокси `/backend/*` (см. секцию «Переключение на реальный API»).

| Страница | Эндпоинт | Метод |
|----------|----------|-------|
| Список / архив | `/issues/` | GET (фильтр `?year=N`, статус опциональный) |
| Страница номера | `/issues/{id}/` | GET |
| Статьи номера | `/articles/?issue_id={id}` | GET |
| Все статьи | `/articles/` | GET |
| Страница статьи | `/articles/{id}/` | GET |
| Список рубрик | `/sections/` | GET |
| Конкретная рубрика | `/sections/{slug}/` | GET |
| Статьи рубрики | `/sections/{slug}/articles/` | GET |
| Редколлегия | `/editorial_board/` | GET |
| Поиск | `/search/?q={query}` | GET (поддерживает `section`, `year_from`, `year_to`, `page`, `page_size`) |

**Админские эндпоинты** (требуют JWT в `Authorization: Bearer ...`):

| Действие | Эндпоинт | Метод |
|----------|----------|-------|
| Логин / refresh / logout | `/auth/login/`, `/auth/refresh/`, `/auth/logout/` | POST |
| Создать номер | `/issues/` | POST |
| Обновить номер | `/issues/{id}/` | PATCH |
| Удалить номер | `/issues/{id}/` | DELETE |
| Изменить статус | `/issues/{id}/update_status/` | PUT (`{status: "Draft"\|"Ready"\|"Published"}`) |
| Загрузка обложки / PDF | `/issues/{id}/upload_cover/`, `/issues/{id}/upload_pdf/` | POST (`multipart/form-data`) |
| Создать статью | `/articles/` | POST |
| Обновить статью | `/articles/{id}/` | PATCH |
| Удалить статью | `/articles/{id}/` | DELETE |
| Загрузка PDF статьи | `/articles/{id}/upload_ready_pdf_file/` | POST (`multipart/form-data`) |

Полный реестр методов — в [`src/lib/api/client.ts`](src/lib/api/client.ts) (`api`, `auth`, `adminApi`).

### CORS

Если фронт идёт через прокси `/backend/*` (рекомендуется), CORS не нужен — все запросы same-origin.

Если фронт обращается к бэкенду напрямую (`NEXT_PUBLIC_API_URL=https://api.example.com`), бэкенд должен разрешить CORS для домена фронта.

### Загрузка файлов

- Обложка номера: `POST /issues/{id}/upload_cover/`, поле `cover_image` (image/*)
- PDF номера: `POST /issues/{id}/upload_pdf/`, поле `pdf_file` (application/pdf)
- PDF статьи: `POST /articles/{id}/upload_ready_pdf_file/`, поле `pdf_file`
- Фронтенд отображает файлы по URL из ответа API (поля `pdf_file`, `cover_file`, `xml_url`)

## TypeScript типы

Типы API-контрактов: `src/lib/types/index.ts`

Ключевые типы:

- **`IssueSummary`** — номер журнала (id, year, number, cover_url, status, ...)
- **`IssueFull`** — номер + статьи, сгруппированные по рубрикам
- **`ArticleSummary`** — краткая карточка статьи (title, authors, doi, pdf_url, ...)
- **`ArticleFull`** — полные метаданные (+ keywords, references, jel_codes, ...)
- **`Author`** — автор (full_name, affiliation, email, orcid)
- **`EditorialBoardMember`** — член редколлегии

Все текстовые поля с русской и английской версиями используют тип `LocalizedString`:

```typescript
interface LocalizedString {
  ru: string;
  en?: string;
}
```

Эти типы должны точно соответствовать структуре ответов бэкенда. При расхождении фронтенд сломается.

## Дизайн

Согласованные HTML-макеты: `02_src/design/` (зелёная палитра).
Альтернативный вариант: `02_src/design-alt-navy/` (синяя палитра).

Дизайн-токены:

- Шрифты: Cormorant Garamond (заголовки), IBM Plex Sans (тело текста)
- Основной цвет: `#2B3D2F` (forest)
- Акцент: `#B07D3A` (copper)
- Ссылки: `#1A7A6D` (teal)
- Фоны: `#F7F5F0`, `#F0EDE6` (stone)

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера (http://localhost:3000) |
| `npm run build` | Продакшн-сборка |
| `npm run start` | Запуск продакшн-сервера |
| `npm run lint` | Проверка ESLint |

