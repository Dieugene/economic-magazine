# Spec: Native author submission form (replaces ms.questionset.ru)

**Дата:** 2026-05-17
**Маршрут:** `/authors/submit`
**Язык формы:** только RU (на EN-версии пункт меню скрывается)

## Цель

Перенести функциональность формы подачи статьи `http://ms.questionset.ru/` в наш сайт, в стилистике сайта, на эндпоинты нового бэкенда. После релиза автор больше не уходит на внешний сервис.

## Бэкенд-контракт

- `POST /api/articles/upload_new_pdf_file/` — multipart/form-data, без авторизации. Возвращает `201 { message: "..." }`.
- `GET /api/articles/download_template/` — публичный, отдаёт файл шаблона. Сейчас возвращает 404 (шаблон не загружен в бэк), это надо обработать на UI.

**Поля API (`ArticleUploadRequest`):**

| Поле | Тип | Required |
|------|-----|----------|
| authors | string | ✓ |
| workplace_title_and_address | string | ✓ |
| position_title | string | ✓ |
| city | string | ✓ |
| email | string | ✓ |
| phone_number | string | ✓ |
| degree | string | – |
| academic_title | string | – |
| funding | string | – |
| orcid_id | string | – |
| docx_file | binary (.doc/.docx) | ✓ |
| zip_with_additional_files | binary (.zip) | – |

**Расхождение с оригиналом:** в исходной форме есть Регион, Страна, Researcher ID, Scopus ID, SPIN-код РИНЦ. В API их нет — **на фронте не отображаем**. Семантический функциональный регресс осознанный.

## UX

Одностраничная форма с визуальными разделами (карточки `bg-white border border-stone-400 rounded-sm p-6` — паттерн уже на сайте).

**Структура снизу вверх:**

1. **Кнопка скачать шаблон** — над формой. Кликается → GET `/api/articles/download_template/`. При 404 — toast «Шаблон временно недоступен, обратитесь в редакцию».
2. **Раздел «Подтверждения»** — 5 чекбоксов-деклараций из оригинала (соответствие профилю / оригинальность / укомплектованность / отсутствие плагиата / принятие договора). UI-гейт, не передаётся в API.
3. **Раздел «Автор/соавторы»** — ФИО (input), Место работы и адрес (textarea), Должность (input), Город (input).
4. **Раздел «Контакты и доп. сведения»** — Email, Телефон, Учёная степень, Учёное звание, Источник финансирования, ORCID.
5. **Раздел «Файлы»** — `docx_file` (.doc/.docx, ≤ 10 MB), `zip_with_additional_files` (.zip, ≤ 50 MB). Drag-and-drop + кнопка «Выбрать файл».
6. **Раздел «Согласия»** — 2 чекбокса: авторское соглашение (link на `/authors/copyright-agreement`), политика обработки персональных данных (link на `/privacy`).
7. **Honeypot** — скрытое поле `website`, заполненное ботом → submit silently no-op.
8. **Кнопка «Отправить статью»** — disabled, пока не валидно (visual cue: серая → forest-600 active).

**После submit:**

- 201 → форма заменяется inline-блоком «Статья получена. Редакция свяжется с вами по указанному email». Кнопка «Подать ещё одну» сбрасывает state.
- 4xx → красная плашка под кнопкой с message из ответа (если пришёл) или generic.
- Network / 5xx → красная плашка «Не удалось отправить, попробуйте позже».

**Validation (фронт):**

- Required-поля → пометка `*`, валидация при blur и при submit.
- email — стандартная regex.
- phone_number — placeholder `+7 (___) ___-__-__`, валидация: digits ≥ 7.
- ORCID (если заполнен) — формат `\d{4}-\d{4}-\d{4}-\d{3}[\dX]`.
- docx_file → расширение `.doc/.docx`, ≤ 10 MB.
- zip → `.zip`, ≤ 50 MB.

## Сопутствующие правки

- **`/authors/submission`** — добавить блок «Скачать шаблон оформления» (тот же `TemplateDownloadButton`).
- **Header / `/authors/page.tsx`** — пункт «Submit a Paper» скрыть на EN (условный рендер). Описание карточки `submit` на RU поменять на «Форма подачи рукописи через сайт журнала».

## Структура файлов

```
src/app/(public)/authors/submit/page.tsx        ← оболочка
src/components/public/submit/
  SubmissionForm.tsx                            ← orchestrator
  FormSection.tsx                               ← карточка с заголовком
  DeclarationsBlock.tsx                         ← 5 чекбоксов соответствия
  AuthorDataBlock.tsx                           ← 4 поля автора
  ContactsBlock.tsx                             ← email/phone/degree/title/orcid/funding
  FilesBlock.tsx                                ← drag-drop загрузчик (×2)
  ConsentsBlock.tsx                             ← 2 чекбокса согласий + honeypot
  SubmitSuccess.tsx                             ← inline success
  TemplateDownloadButton.tsx                    ← переиспользуем в /authors/submission
src/lib/api/submissions.ts                      ← submitArticle(), downloadTemplate()
src/lib/validation/submission.ts                ← zod-схема + типы
```

## Что НЕ делаем

- Не делаем EN-версию формы.
- Не добавляем reCAPTCHA (бэк не валидирует — бессмысленно). Только honeypot.
- Не делаем сохранение черновика в localStorage (можно потом, если попросят).
- Не делаем multi-step wizard.
- Не дополняем бэк-контракт расширенными полями (Region/Country/RsID/Scopus/SPIN).

## Definition of Done

- Форма открывается по `/authors/submit`, отрисовывается в дизайне сайта.
- Все required-валидации работают, кнопка отправки заблокирована без согласий.
- Успешный submit с реальным .docx через staging POST'ит в бэк, возвращает 201, рисует success-экран.
- 4xx/5xx обрабатываются понятно.
- Скачивание шаблона работает (или показывает корректное сообщение при 404).
- EN-меню не содержит «Submit a Paper».
- На staging проверено вручную: успешная отправка реального файла, валидационные ошибки, 404-шаблон.
