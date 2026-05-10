# QA Fixtures

Бинарные файлы для ручного прогона тест-плана `../test_plan_issues_sections_articles.md`. Сами файлы **не коммитятся** (см. `.gitignore`), коммитится только этот манифест. При новом клоне репо — восстановить по разделу [«Восстановление»](#восстановление) ниже.

## Pre-flight check (обязательный первый шаг любой QA-сессии)

**До seed, до логина, до всего остального** — сразу при старте сессии:

1. Открыть этот файл, пробежаться по разделу «Содержимое».
2. Проверить наличие каждого упомянутого файла на диске (`ls 00_docs/qa/fixtures/`).
3. Любой отсутствующий файл — **восстановить по разделу «Восстановление»**, до начала тестов. Запретно прибегать к мотивации «у меня нет нужного PDF / JPG, поэтому пропущу кейс F8b/F9c/F6/E1.Обложка/8.7». Фикстура — это не «опциональный nice-to-have», это инструмент тестера; нет фикстуры — есть инструкция, как её получить.
4. Если по какой-то фикстуре инструкции нет (например, второй PDF другого размера) — её можно скачать с `questionset.ru` (старая боевая версия журнала) или со staging (`http://185.180.230.243/media/issues/pdfs/...`). Запретно отказывать в выполнении кейса по причине «нет фикстуры», не попробовав восстановить из источников.
5. Любой `SKIP` или `BLOCKED` по причине «нет фикстуры», который не сопровождается реальной попыткой восстановить — считается **необоснованным** и не засчитывается в финальное покрытие.

## Содержимое

```
fixtures/
├── README.md             ← этот файл (трекается в git)
├── pdfs/
│   ├── issue_small.pdf   ← 2.3 МБ, для быстрых smoke-загрузок
│   └── issue_large.pdf   ← 5.8 МБ, для проверки замены / разной массы
├── images/
│   ├── qa-cover.jpg      ← 1200×1600, JPG, ~88 КБ, основной cover
│   ├── qa-cover-alt.png  ← 1200×1600, PNG, ~66 КБ, для теста замены формата
│   ├── qa-cover-tiny.jpg ← 200×200, JPG, для проверки маленькой/квадратной обложки
│   └── qa-cover-1px.jpg  ← 1×1, JPG, деградированный edge-case
└── bad/
    ├── not_a_pdf.pdf     ← текстовый файл с расширением .pdf (edge 8.7)
    └── empty.pdf         ← нулевого размера
```

## Назначение по кейсам

| Файл | Используется в | Что проверяет |
|---|---|---|
| `pdfs/issue_small.pdf` | F-кейсы, E1.PDF, E2.PDF | штатная загрузка PDF выпуска / статьи |
| `pdfs/issue_large.pdf` | E1.PDF (повторная замена) | замена ранее загруженного файла |
| `images/qa-cover.jpg` | E1.Обложка, F-публикация | штатная загрузка обложки |
| `images/qa-cover-alt.png` | E1.Обложка (замена) | замена JPG → PNG |
| `images/qa-cover-tiny.jpg` | edge | малый размер, нестандартное соотношение |
| `images/qa-cover-1px.jpg` | edge | минимально валидный JPG |
| `bad/not_a_pdf.pdf` | edge 8.7 | UI/бэк должен отклонить не-PDF |
| `bad/empty.pdf` | edge 8.7 | пустой файл — поведение бэка |

## Восстановление

Если папки нет (свежий clone):

1. Создать структуру:
   ```bash
   mkdir -p 00_docs/qa/fixtures/pdfs 00_docs/qa/fixtures/images 00_docs/qa/fixtures/bad
   ```

2. **PDFs.** Скопировать оригиналы из `03_data/`:
   ```bash
   cp 03_data/VTE_2025_1.pdf       00_docs/qa/fixtures/pdfs/issue_small.pdf
   cp 03_data/ВТЭ_2026_№2__0424.pdf 00_docs/qa/fixtures/pdfs/issue_large.pdf
   ```
   Если в `03_data/` пусто — попросить файлы у владельца репо (см. `CLAUDE_CONTEXT.md`).

3. **Cover images.** Сгенерировать через Pillow (Python ≥ 3.10, `pip install Pillow`). Скрипт-однострочник:
   ```python
   # save as gen_cover.py and run
   from PIL import Image, ImageDraw, ImageFont
   import os
   OUT = r"00_docs/qa/fixtures/images"
   os.makedirs(OUT, exist_ok=True)
   def cover(p, label, accent=(34,84,61)):
       img = Image.new("RGB",(1200,1600),(240,234,220))
       d = ImageDraw.Draw(img)
       d.rectangle([(0,0),(1200,240)], fill=accent)
       d.rectangle([(1160,240),(1200,1600)], fill=accent)
       try:
           f = ImageFont.truetype(r"C:\Windows\Fonts\georgia.ttf", 78)
       except OSError:
           f = ImageFont.load_default()
       d.text((80,360),"Вопросы", fill=accent, font=f)
       d.text((80,460),"теоретической", fill=accent, font=f)
       d.text((80,560),"экономики", fill=accent, font=f)
       d.text((80,1480),label, fill=(120,120,120), font=f)
       img.save(p, quality=88)
   cover(f"{OUT}/qa-cover.jpg", "QA Cover · 2026 №1")
   cover(f"{OUT}/qa-cover-alt.png", "QA Cover · 2026 №2", accent=(160,90,40))
   Image.new("RGB",(200,200),(200,60,60)).save(f"{OUT}/qa-cover-tiny.jpg",quality=85)
   Image.new("RGB",(1,1),(0,0,0)).save(f"{OUT}/qa-cover-1px.jpg",quality=85)
   ```

4. **Bad files.**
   ```bash
   echo "This is not a PDF file." > 00_docs/qa/fixtures/bad/not_a_pdf.pdf
   : > 00_docs/qa/fixtures/bad/empty.pdf       # zero-byte file
   ```

## Альтернативные источники (если основной путь восстановления недоступен)

Если `03_data/` пуст и `Pillow` ещё не установлен — фикстуры можно собрать из открытых источников:

- **Замена-PDF** (для F8b «Замена PDF выпуска» / F8c «Замена PDF статьи»): скачать любой опубликованный PDF старой боевой версии журнала, например:
  ```bash
  curl -sLk -o 00_docs/qa/fixtures/pdfs/issue_large.pdf \
    "http://185.180.230.243/media/issues/pdfs/1/VTE_2026-1.pdf"
  # или с questionset.ru — поискать по архиву
  ```
- **Cover JPG** (для E1.Обложка / п.7 бэклога): взять реальную обложку с `questionset.ru`, например:
  ```bash
  curl -sLk -o 00_docs/qa/fixtures/images/qa-cover.jpg \
    "http://questionset.ru/files/arch/2026/2026-N1/271x384.jpg"
  ```
- **Fake-PDF** (для F6 / 8.7 / Bug-B): сделать текстовый файл с расширением `.pdf`:
  ```bash
  echo "this is definitely not a pdf" > 00_docs/qa/fixtures/bad/not_a_pdf.pdf
  ```

После использования альтернативного источника — отметить в Notes сессии (откуда взято), чтобы следующая сессия видела происхождение файла.

## Принципы

- **Никаких настоящих PDF от заказчика в этой папке** без согласования. Имена нейтральные (`issue_small`, `issue_large`), без идентифицирующих метаданных.
- Все обложки помечены текстом «QA TEST FIXTURE / Not a real cover», чтобы случайно не утекли в продакшен-сборку.
- Папка `fixtures/` целиком в `.gitignore` (см. корневой `.gitignore`), кроме этого README. При появлении нового файла — добавить запись в раздел «Содержимое» и в таблицу «Назначение».
- **Не использовать пути в `/tmp/`** для фикстур, передаваемых в MCP-инструменты (chrome-devtools `upload_file` и т.п.) — на Windows Git Bash маппит `/tmp/` в `%TEMP%`, но MCP проверяет workspace root и отвергает путь `/tmp/...`. Все фикстуры — только в этой папке `00_docs/qa/fixtures/` или в `$env:TEMP`.
