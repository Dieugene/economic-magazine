import type {
  Article,
  Author,
  Section,
  IssueSummary,
  IssueFull,
  IssueSection,
  EditorialBoardMember,
  ArticleType,
  PaginatedArticleList,
} from '@/lib/types';

// ── Sections (slug-и в формате транслитерации, как у бэкенда) ─────

export const sections: Section[] = [
  { slug: 'ekonomicheskaja-teorija', name: { ru: 'Экономическая теория', en: 'Economic Theory' } },
  { slug: 'metodologija-ekonomicheskoj-nauki', name: { ru: 'Методология экономической науки', en: 'Methodology of Economics' } },
  { slug: 'ot-teorii-k-ekonomicheskoj-politike', name: { ru: 'От теории к экономической политике', en: 'From Theory to Economic Policy' } },
  { slug: 'istorija-mysli', name: { ru: 'История мысли', en: 'History of Thought' } },
  { slug: 'mezhdistsiplinarnye-issledovanija', name: { ru: 'Междисциплинарные исследования', en: 'Interdisciplinary Studies' } },
  { slug: 'ekonomicheskaja-istorija', name: { ru: 'Экономическая история', en: 'Economic History' } },
  { slug: 'obzory-i-retsenzii', name: { ru: 'Обзоры и рецензии', en: 'Reviews' } },
];

const sectionBySlug = (slug: string): Section =>
  sections.find((s) => s.slug === slug)!;

// ── References for article 1 ──────────────────────────────────────

export const referencesArticle1: { ru: string; en: string }[] = [
  { ru: '1. Рубинштейн А.Я. Теория опекаемых благ. СПб.: Алетейя, 2018.', en: '1. Rubinstein A.Ya. Theory of Patronized Goods. St. Petersburg: Aletheia, 2018.' },
  { ru: '2. Полтерович В.М. Позитивное сотрудничество: факторы и механизмы эволюции // Вопросы экономики. 2016. № 11. С. 5–23.', en: '2. Polterovich V.M. Positive Collaboration: Factors and Mechanisms of Evolution // Voprosy Ekonomiki. 2016. No. 11. Pp. 5–23.' },
  { ru: '3. Дасгупта П. Экономический прогресс и идея социального капитала // Экономический вестник. 2004. Т. 3, № 2. С. 36–54.', en: '3. Dasgupta P. Economic Progress and the Idea of Social Capital // Economic Bulletin. 2004. Vol. 3, No. 2. Pp. 36–54.' },
  { ru: '4. Макаров В.Л. Экономика знаний: уроки для России // Вестник Российской академии наук. 2003. Т. 73, № 5. С. 450–456.', en: '4. Makarov V.L. Knowledge Economy: Lessons for Russia // Herald of the Russian Academy of Sciences. 2003. Vol. 73, No. 5. Pp. 450–456.' },
  { ru: '5. Merton R.K. The Sociology of Science: Theoretical and Empirical Investigations. Chicago: University of Chicago Press, 1973.', en: '5. Merton R.K. The Sociology of Science: Theoretical and Empirical Investigations. Chicago: University of Chicago Press, 1973.' },
  { ru: '6. David P.A. The Economic Logic of "Open Science" and the Balance between Private Property Rights and the Public Domain in Scientific Data and Information // Stanford Working Paper. 2003. No. 02-30.', en: '6. David P.A. The Economic Logic of "Open Science" and the Balance between Private Property Rights and the Public Domain in Scientific Data and Information // Stanford Working Paper. 2003. No. 02-30.' },
  { ru: '7. Hess C., Ostrom E. Understanding Knowledge as a Commons: From Theory to Practice. Cambridge, MA: MIT Press, 2007.', en: '7. Hess C., Ostrom E. Understanding Knowledge as a Commons: From Theory to Practice. Cambridge, MA: MIT Press, 2007.' },
];

// ── Article builder ───────────────────────────────────────────────

// Парсит строку «И.И. Иванов, П.П. Петров» → массив Author с пустыми
// остальными полями. Для моков этого достаточно — публичный рендер
// просто склеит full_name обратно через запятую.
function parseAuthors(authorsRu: string, authorsEn?: string): Author[] {
  const ruNames = authorsRu.split(',').map((s) => s.trim()).filter(Boolean);
  const enNames = (authorsEn ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return ruNames.map((ru, i) => ({
    full_name: { ru, ...(enNames[i] ? { en: enNames[i] } : {}) },
    email: '',
    degree: null,
    affiliations: [],
    orcid: '',
  }));
}

function mkArticle(
  id: number,
  titleRu: string,
  authorsRu: string,
  sectionSlug: string,
  pages: string,
  doi: string,
  issueId: number,
  issueYear: number,
  issueNumber: number,
  issueSeq: number,
  pdfSizeKb: number | null = null,
  articleType: ArticleType = 'Scientific',
  authorsEn?: string,
  titleEn?: string,
): Article {
  const section = sectionBySlug(sectionSlug);
  const doiSuffix = doi.split('VTE_')[1];
  return {
    id,
    issue_id: issueId,
    issue_year: issueYear,
    issue_number: issueNumber,
    issue_sequential_number: issueSeq,
    section_name: section.name,
    title: { ru: titleRu, ...(titleEn ? { en: titleEn } : {}) },
    authors: parseAuthors(authorsRu, authorsEn),
    pages,
    doi,
    pdf_file: doiSuffix
      ? `https://journals.rcsi.science/vte/article/download/${doiSuffix}/pdf`
      : null,
    pdf_size_kb: pdfSizeKb,
    abstract: null,
    article_type: articleType,
    keywords: { ru: [], en: [] },
    udk: '',
    jel_codes: [],
    references: [],
    received_date: null,
    accepted_date: null,
    funding: { ru: '' },
    xml_url: null,
  };
}

// ══════════════════════════════════════════════════════════════════
// ISSUE 1: 2026, №1 (30) — 12 articles, IDs 1-12
// ══════════════════════════════════════════════════════════════════

export const articleSummary1: Article = {
  ...mkArticle(
    1,
    'Научная деятельность в цифровую эпоху: производство и распространение знания',
    'А.Я. Рубинштейн, Е.Э. Чуковская',
    'ekonomicheskaja-teorija',
    '7-21',
    '10.52342/2587-7666VTE_2026_1_7_21',
    1, 2026, 1, 30, 188,
    'Scientific',
    'A.Ya. Rubinstein, E.E. Chukovskaya',
    'Scientific activity in the digital age: production and dissemination of knowledge',
  ),
  abstract: {
    ru: 'В статье представлен анализ современной ситуации, сложившейся спустя 12 лет после передачи в 2013 г. академических институтов сначала в подчинение Федерального агентства научных организаций (ФАНО), а затем Министерства науки и высшего образования, обусловившей фактическую утрату Российской академией наук статуса самоуправляемой организации гражданского общества. Это не могло не отразиться на авторитете РАН. Основной акцент сделан на исследовании актуальных проблем деятельности экономических институтов РАН и связанных с ними вопросах авторского права.',
    en: "The article presents an analysis of the current situation 12 years after the transfer in 2013 of academic institutions first to the Federal Agency for Scientific Organisations (FANO) and then to the Ministry of Science and Higher Education, which led to the Russian Academy of Sciences effectively losing its status as a self-governing civil society organization, which affected the authority of the RAS. The focus is on researching current problems in the activities of the RAS's economic institutions and related copyright issues.",
  },
};

export const articleSummary2: Article = mkArticle(2, 'Неопределённость и экономическая активность: теоретические аспекты', 'Н.В. Комаровская', 'ekonomicheskaja-teorija', '22-38', '10.52342/2587-7666VTE_2026_1_22_38', 1, 2026, 1, 30, 213);
export const articleSummary3: Article = mkArticle(3, 'Культурная трансформация как объект институционального проектирования: теоретические основы и эмпирические возможности C-NUDGE моделирования', 'И.К. Капульцевич', 'ekonomicheskaja-teorija', '39-53', '10.52342/2587-7666VTE_2026_1_39_53', 1, 2026, 1, 30, 257);
export const articleSummary4: Article = mkArticle(4, 'Науковедческие подходы Т. Куна и И. Лакатоса в методологии экономической науки и их критика', 'А.С. Тишкин', 'metodologija-ekonomicheskoj-nauki', '54-69', '10.52342/2587-7666VTE_2026_1_54_69', 1, 2026, 1, 30, 249);
export const articleSummary5: Article = mkArticle(5, 'Пенсии от государства: польза не очевидна, вред очевиден', 'К.Э. Яновский, С.В. Жаворонков, И. Затковецкий', 'ot-teorii-k-ekonomicheskoj-politike', '70-91', '10.52342/2587-7666VTE_2026_1_70_91', 1, 2026, 1, 30, 512);
export const articleSummary6: Article = mkArticle(6, 'Целевой жилищный капитал: социально ориентированный институциональный дизайн', 'М.Э. Дмитриев, А.А. Оконишников, А.Н. Семеняка', 'ot-teorii-k-ekonomicheskoj-politike', '92-111', '10.52342/2587-7666VTE_2026_1_92_111', 1, 2026, 1, 30, 426);
export const articleSummary7: Article = mkArticle(7, 'Образование и доход: парадоксы глобализации', 'К.Ф. Быковский, Д.Д. Карташев', 'ot-teorii-k-ekonomicheskoj-politike', '112-127', '10.52342/2587-7666VTE_2026_1_112_127', 1, 2026, 1, 30, 376);
export const articleSummary8: Article = mkArticle(8, 'Китайское экономическое образование в период кампаний критики второй половины 1950-х годов', 'О.Н. Борох', 'istorija-mysli', '128-144', '10.52342/2587-7666VTE_2026_1_128_144', 1, 2026, 1, 30, 202);
export const articleSummary9: Article = mkArticle(9, 'Добродетель и порок: этические кодексы маргинальных сообществ современной России (Часть 1)', 'А.Н. Медушевский', 'mezhdistsiplinarnye-issledovanija', '145-163', '10.52342/2587-7666VTE_2026_1_145_163', 1, 2026, 1, 30, 223);
export const articleSummary10: Article = mkArticle(10, 'Мир демократического правления в начале XXI века', 'Ю.А. Нисневич', 'mezhdistsiplinarnye-issledovanija', '164-188', '10.52342/2587-7666VTE_2026_1_164_188', 1, 2026, 1, 30, 399);
export const articleSummary11: Article = mkArticle(11, 'Программы реформирования экономики и запуск экономических реформ в России', 'С.А. Васильев', 'ekonomicheskaja-istorija', '189-214', '10.52342/2587-7666VTE_2026_1_189_214', 1, 2026, 1, 30, 258);
export const articleSummary12: Article = mkArticle(12, 'Искусственный интеллект в здравоохранении: «лекарство» или «яд»?', 'О.А. Кислицына', 'obzory-i-retsenzii', '215-227', '10.52342/2587-7666VTE_2026_1_215_227', 1, 2026, 1, 30, 183, 'Book_review');

const issue1Articles: Article[] = [
  articleSummary1, articleSummary2, articleSummary3, articleSummary4,
  articleSummary5, articleSummary6, articleSummary7, articleSummary8,
  articleSummary9, articleSummary10, articleSummary11, articleSummary12,
];

// ══════════════════════════════════════════════════════════════════
// ISSUE 2: 2025, №4 (29) — 12 articles
// ══════════════════════════════════════════════════════════════════

const art13: Article = mkArticle(13, 'Благополучие, связанное с работой: концепция и методологические подходы к измерению', 'И.В. Соболева, Е.А. Черных', 'ekonomicheskaja-teorija', '7-19', '10.52342/2587-7666VTE_2025_4_7_19', 2, 2025, 4, 29, 182);
const art14: Article = mkArticle(14, 'Реформы: фактор идеологии в свете российских научных публикаций', 'В.В. Вольчик, В.В. Кот', 'ekonomicheskaja-teorija', '20-35', '10.52342/2587-7666VTE_2025_4_20_35', 2, 2025, 4, 29, 193);
const art15: Article = mkArticle(15, 'Нужна ли новому мировому экономическому порядку новая экономическая теория?', 'В.Л. Тамбовцев', 'metodologija-ekonomicheskoj-nauki', '36-52', '10.52342/2587-7666VTE_2025_4_36_52', 2, 2025, 4, 29, 206);
const art16: Article = mkArticle(16, 'Конкурирующие парадигмы в рамках современной политической экономии', 'С.Н. Левин, К.С. Саблин', 'metodologija-ekonomicheskoj-nauki', '53-67', '10.52342/2587-7666VTE_2025_4_53_67', 2, 2025, 4, 29, 360);
const art17: Article = mkArticle(17, 'Оценка инфляционных ожиданий населения России на основе поисковых запросов в сети Интернет (подход «сверху вниз»)', 'В.С. Щербаков', 'ot-teorii-k-ekonomicheskoj-politike', '68-90', '10.52342/2587-7666VTE_2025_4_68_90', 2, 2025, 4, 29, 3100);
const art18: Article = mkArticle(18, 'Р.М. Нуреев: от «политэкономии в широком смысле» к поиску институциональной «большой теории» экономической истории', 'Г.Д. Гловели, К.Э. Мерзликин', 'istorija-mysli', '91-104', '10.52342/2587-7666VTE_2025_4_91_104', 2, 2025, 4, 29, 417);
const art19: Article = mkArticle(19, 'Исследование НТП и теорий технико-экономического развития в работах Ю.Я. Ольсевича', 'Г.А. Маслов', 'istorija-mysli', '105-116', '10.52342/2587-7666VTE_2025_4_105_116', 2, 2025, 4, 29, 166);
const art20: Article = mkArticle(20, 'Трансформация системы экономического образования в Китае (первая половина 1950-х годов)', 'О.Н. Борох', 'istorija-mysli', '117-132', '10.52342/2587-7666VTE_2025_4_117_132', 2, 2025, 4, 29, 194);
const art21: Article = mkArticle(21, 'И доверие, и закон: как социальный капитал и формальные институты влияют на соблюдение ковидных ограничений', 'А.П. Казун', 'mezhdistsiplinarnye-issledovanija', '133-143', '10.52342/2587-7666VTE_2025_4_133_143', 2, 2025, 4, 29, 248);
const art22: Article = mkArticle(22, 'Влияние социального капитала на субъективное благополучие', 'В.Н. Титов, Д.М. Логинов', 'mezhdistsiplinarnye-issledovanija', '144-157', '10.52342/2587-7666VTE_2025_4_144_157', 2, 2025, 4, 29, 511);
const art23: Article = mkArticle(23, 'Экономические реформы в России 90-х гг.: формирование команды и идеологии реформаторов', 'С.А. Васильев', 'ekonomicheskaja-istorija', '158-179', '10.52342/2587-7666VTE_2025_4_158_179', 2, 2025, 4, 29, 236);
const art24: Article = mkArticle(24, 'Российское общество и вызовы времени: десятилетие 2014–2024 гг. (новое исследование Института социологии РАН)', 'Н.М. Плискевич', 'obzory-i-retsenzii', '180-190', '10.52342/2587-7666VTE_2025_4_180_190', 2, 2025, 4, 29, 157, 'Book_review');

const issue2Articles: Article[] = [art13, art14, art15, art16, art17, art18, art19, art20, art21, art22, art23, art24];

// ══════════════════════════════════════════════════════════════════
// ISSUE 3: 2025, №3 (28) — 12 articles
// ══════════════════════════════════════════════════════════════════

const art25: Article = mkArticle(25, 'Международная накопительная интеграция и оценка её экономических эффектов', 'Б.А. Хейфец, В.Ю. Чернова', 'ekonomicheskaja-teorija', '7-24', '10.52342/2587-7666VTE_2025_3_7_24', 3, 2025, 3, 28);
const art26: Article = mkArticle(26, 'Институт дотаций в России', 'Я.В. Трофимова', 'ekonomicheskaja-teorija', '25-37', '10.52342/2587-7666VTE_2025_3_25_37', 3, 2025, 3, 28);
const art27: Article = mkArticle(27, 'Текст-как-данные: экономическая перспектива', 'А.М. Либман', 'metodologija-ekonomicheskoj-nauki', '38-48', '10.52342/2587-7666VTE_2025_3_38_48', 3, 2025, 3, 28);
const art28: Article = mkArticle(28, 'Почему россияне избегают медицинской помощи? (Социально-демографические детерминанты и причины избегающего поведения)', 'О.А. Кислицына', 'ot-teorii-k-ekonomicheskoj-politike', '49-64', '10.52342/2587-7666VTE_2025_3_49_64', 3, 2025, 3, 28);
const art29: Article = mkArticle(29, 'Научные исследования в российских вузах: проблемы и региональные особенности', 'Т.Л. Клячко', 'ot-teorii-k-ekonomicheskoj-politike', '65-89', '10.52342/2587-7666VTE_2025_3_65_89', 3, 2025, 3, 28);
const art30: Article = mkArticle(30, 'Экологическая политика принимающих экономик и мультинациональные корпорации: эмпирический анализ', 'М.А. Юревич, А.А. Федюнина', 'ot-teorii-k-ekonomicheskoj-politike', '90-104', '10.52342/2587-7666VTE_2025_3_90_104', 3, 2025, 3, 28);
const art31: Article = mkArticle(31, 'Не всё то золото, что в БС', 'А.Л. Зюбина', 'ot-teorii-k-ekonomicheskoj-politike', '105-118', '10.52342/2587-7666VTE_2025_3_105_118', 3, 2025, 3, 28);
const art32: Article = mkArticle(32, 'Международное правосудие в поисках равновесия между правом и политикой (Часть 2)', 'А.Н. Медушевский', 'mezhdistsiplinarnye-issledovanija', '119-133', '10.52342/2587-7666VTE_2025_3_119_133', 3, 2025, 3, 28);
const art33: Article = mkArticle(33, 'Коммуникация в контексте политической символизации: от дискурсов к речевым ситуациям', 'Г.И. Мусихин', 'mezhdistsiplinarnye-issledovanija', '134-143', '10.52342/2587-7666VTE_2025_3_134_143', 3, 2025, 3, 28);
const art34: Article = mkArticle(34, 'Инфляция, экономия и онлайн-покупки: потребительское поведение россиян в первой половине 2020-х годов', 'Д.М. Логинов, Т.М. Малева', 'mezhdistsiplinarnye-issledovanija', '144-158', '10.52342/2587-7666VTE_2025_3_144_158', 3, 2025, 3, 28);
const art35: Article = mkArticle(35, 'Хозяйственная деятельность ордена тамплиеров', 'А.В. Ковалёв', 'ekonomicheskaja-istorija', '159-167', '10.52342/2587-7666VTE_2025_3_159_167', 3, 2025, 3, 28);
const art36: Article = mkArticle(36, 'В продолжение дискуссии о первопричинах устойчивого экономического роста (О книге Й. Стейнссона)', 'А.А. Мальцев, С.В. Чичилимов', 'obzory-i-retsenzii', '168-178', '10.52342/2587-7666VTE_2025_3_168_178', 3, 2025, 3, 28, null, 'Book_review');

const issue3Articles: Article[] = [art25, art26, art27, art28, art29, art30, art31, art32, art33, art34, art35, art36];

// ══════════════════════════════════════════════════════════════════
// ISSUE 5: 2025, №1 (26) — 12 articles
// ══════════════════════════════════════════════════════════════════

const art37: Article = mkArticle(37, 'Экономический смысл и прикладное значение индикаторов удовлетворённости жизнью', 'О.Н. Антипина, Н.А. Миклашевская, Е.А. Орлова', 'ekonomicheskaja-teorija', '7-22', '10.52342/2587-7666VTE_2025_1_7_22', 5, 2025, 1, 26);
const art38: Article = mkArticle(38, 'Специфика российских институтов и патернализм государства (Часть 1. Государство в узком и широком смысле)', 'Н.М. Плискевич', 'ekonomicheskaja-teorija', '23-36', '10.52342/2587-7666VTE_2025_1_23_36', 5, 2025, 1, 26);
const art39: Article = mkArticle(39, 'Экономико-правовое пространство теневой экономики', 'Е.В. Батурина', 'ot-teorii-k-ekonomicheskoj-politike', '37-50', '10.52342/2587-7666VTE_2025_1_37_50', 5, 2025, 1, 26);
const art40: Article = mkArticle(40, 'Определяя неопределённость', 'Н.В. Комаровская', 'istorija-mysli', '51-64', '10.52342/2587-7666VTE_2025_1_51_64', 5, 2025, 1, 26);
const art41: Article = mkArticle(41, 'Маффео Панталеони: либеральный экономист и кризис либерального государства в Италии', 'Д.В. Мельник', 'istorija-mysli', '65-78', '10.52342/2587-7666VTE_2025_1_65_78', 5, 2025, 1, 26);
const art42: Article = mkArticle(42, 'Мир авторитарного правления в начале XXI века (Часть 1)', 'Ю.А. Нисневич', 'mezhdistsiplinarnye-issledovanija', '79-92', '10.52342/2587-7666VTE_2025_1_79_92', 5, 2025, 1, 26);
const art43: Article = mkArticle(43, 'Жизненный успех: что он означает для россиян?', 'Н.Е. Тихонова', 'mezhdistsiplinarnye-issledovanija', '93-112', '10.52342/2587-7666VTE_2025_1_93_112', 5, 2025, 1, 26);
const art44: Article = mkArticle(44, 'Социальная активность российской молодёжи: концептуально-психологические факторы', 'П.А. Ефимова, З.Х. Лепшокова, А.Г. Яшина, Е.В. Попов, А.С. Титов', 'mezhdistsiplinarnye-issledovanija', '113-126', '10.52342/2587-7666VTE_2025_1_113_126', 5, 2025, 1, 26);
const art45: Article = mkArticle(45, 'Справедливое социальное государство как ценность и как реальность для российских граждан (Часть 2. Принципы справедливости в социальном государстве)', 'В.Л. Римский', 'mezhdistsiplinarnye-issledovanija', '127-146', '10.52342/2587-7666VTE_2025_1_127_146', 5, 2025, 1, 26);
const art46: Article = mkArticle(46, 'Государственное регулирование занятости женщин и профессиональная сегрегация в российской сфере труда — 100 лет истории (Часть 3. 1992–2024 гг.)', 'М.Е. Баскакова', 'ekonomicheskaja-istorija', '147-166', '10.52342/2587-7666VTE_2025_1_147_166', 5, 2025, 1, 26);
const art47: Article = mkArticle(47, 'Экономика Севастополя в 1920-е гг.: от политики «военного коммунизма» к нэпу', 'А.Г. Баранов, Е.П. Гармашова, Т.А. Лопатина, Д.В. Пунга', 'ekonomicheskaja-istorija', '167-184', '10.52342/2587-7666VTE_2025_1_167_184', 5, 2025, 1, 26);
const art48: Article = mkArticle(48, 'Нобелевская премия по экономике 2024 г. и перспективы институциональной экономики', 'С.С. Винокуров', 'obzory-i-retsenzii', '185-196', '10.52342/2587-7666VTE_2025_1_185_196', 5, 2025, 1, 26, null, 'Book_review');

const issue5Articles: Article[] = [art37, art38, art39, art40, art41, art42, art43, art44, art45, art46, art47, art48];

// ── All articles ──────────────────────────────────────────────────

export const allArticleSummaries: Article[] = [
  ...issue1Articles,
  ...issue2Articles,
  ...issue3Articles,
  ...issue5Articles,
];

// ── Full article data (with abstract, references, etc.) ──────────

export const articleFullData: Article = {
  ...articleSummary1,
  keywords: {
    ru: ['социологические исследования', 'распространение знания', 'интеллектуальная собственность', 'авторские права', 'нейросети', 'ранжирование журналов', 'рейтинг'],
    en: ['sociological research', 'knowledge dissemination', 'intellectual property', 'copyright', 'neural networks', 'journal ranking', 'rating'],
  },
  udk: '330.1',
  jel_codes: ['A11', 'D83', 'O33'],
  references: referencesArticle1,
  received_date: '2025-11-18',
  accepted_date: '2026-01-20',
  funding: {
    ru: 'Исследование выполнено при финансовой поддержке Министерства науки и высшего образования Российской Федерации в рамках государственного задания Института экономики РАН.',
    en: 'The study was financially supported by the Ministry of Science and Higher Education of the Russian Federation within the state assignment of the Institute of Economics RAS.',
  },
  xml_url: 'https://journals.rcsi.science/vte/article/view/2026_1_7_21/xml',
};

export const articleFullData13: Article = {
  ...art13,
  abstract: {
    ru: 'Показано, что сегодня в условиях усложнения социально-трудовых отношений традиционные индикаторы, фокусирующиеся на соответствии параметров рабочих мест установленным стандартам в области доходов и рамочных условий занятости, в недостаточной степени отражают многоплановые реалии этого положения и возникает запрос на переосмысление методологии его оценки.',
  },
  keywords: {
    ru: ['благополучие связанное с работой', 'качество занятости', 'субъективное благополучие', 'удовлетворённость работой', 'интегративный подход', 'адаптивная рационализация', 'индикаторы благополучия'],
    en: ['work-related well-being', 'quality of employment', 'subjective well-being', 'job satisfaction', 'integrative approach', 'adaptive rationalization', 'well-being indicators'],
  },
  jel_codes: ['J28', 'J81', 'I31'],
  received_date: '2025-08-10',
  accepted_date: '2025-10-15',
  xml_url: 'https://journals.rcsi.science/2587-7666/article/xml/353792',
};

export const articleFullData14: Article = {
  ...art14,
  abstract: {
    ru: 'В статье исследуется влияние идеологии на осмысление в экономической науке процессов социальных и экономических преобразований на основе качественного анализа наиболее цитируемых статей российских экономистов в научной электронной библиотеке eLIBRARY.RU за период 1992–2025 гг.',
  },
  keywords: {
    ru: ['идеология', 'экономические реформы', 'экономическая наука', 'экономическая политика', 'китайский опыт реформ'],
    en: ['ideology', 'economic reforms', 'economic science', 'economic policy', 'Chinese experience of reform'],
  },
  jel_codes: ['B41', 'P21', 'P30'],
  received_date: '2025-07-20',
  accepted_date: '2025-10-01',
  funding: {
    ru: 'Российский научный фонд № 24-18-00665, «Идеологический ландшафт российской экономической науки» в Южном федеральном университете.',
    en: 'Russian Science Foundation No. 24-18-00665, "Ideological landscape of Russian economic science" at Southern Federal University.',
  },
  xml_url: 'https://journals.rcsi.science/2587-7666/article/xml/353802',
};

// ── Issues ────────────────────────────────────────────────────────

export const issueSummary1: IssueSummary = {
  id: 1, year: 2026, number: 1, sequential_number: 30,
  published_date: '2026-02-27',
  cover_file: null,
  pdf_file: 'https://journals.rcsi.science/vte/issue/download/2026_1/full.pdf',
  status: 'Published', articles_count: 12,
};
export const issueSummary2: IssueSummary = {
  id: 2, year: 2025, number: 4, sequential_number: 29,
  published_date: '2025-11-10',
  cover_file: null,
  pdf_file: 'https://questionset.ru/files/arch/2025/2025-N4/VTE_2025_4.pdf',
  status: 'Published', articles_count: 12,
};
export const issueSummary3: IssueSummary = {
  id: 3, year: 2025, number: 3, sequential_number: 28,
  published_date: '2025-08-20',
  cover_file: null,
  pdf_file: 'https://questionset.ru/files/arch/2025/2025-N3/VTE_2025_3.pdf',
  status: 'Published', articles_count: 12,
};
export const issueSummary4: IssueSummary = {
  id: 4, year: 2025, number: 2, sequential_number: 27,
  published_date: '2025-05-15',
  cover_file: null,
  pdf_file: 'https://questionset.ru/files/arch/2025/2025-N2/VTE_2025_2.pdf',
  status: 'Published', articles_count: 10,
};
export const issueSummary5: IssueSummary = {
  id: 5, year: 2025, number: 1, sequential_number: 26,
  published_date: '2025-02-20',
  cover_file: null,
  pdf_file: 'https://questionset.ru/files/arch/2025/2025-N1/VTE_2025_1.pdf',
  status: 'Published', articles_count: 12,
};

// ── IssueFull (sections list with article IDs) ───────────────────

const SECTION_ORDER = [
  'ekonomicheskaja-teorija',
  'metodologija-ekonomicheskoj-nauki',
  'ot-teorii-k-ekonomicheskoj-politike',
  'istorija-mysli',
  'mezhdistsiplinarnye-issledovanija',
  'ekonomicheskaja-istorija',
  'obzory-i-retsenzii',
];

function buildSections(articles: Article[]): IssueSection[] {
  const grouped = new Map<string, Article[]>();
  for (const a of articles) {
    const slug = sections.find((s) => s.name.ru === a.section_name.ru)?.slug;
    if (!slug) continue;
    if (!grouped.has(slug)) grouped.set(slug, []);
    grouped.get(slug)!.push(a);
  }
  return SECTION_ORDER
    .filter((slug) => grouped.has(slug))
    .map((slug) => {
      const s = sectionBySlug(slug);
      return { slug, name: s.name, articles: grouped.get(slug)! };
    });
}

export const issueFullData1: IssueFull = { ...issueSummary1, sections: buildSections(issue1Articles) };
export const issueFullData2: IssueFull = { ...issueSummary2, sections: buildSections(issue2Articles) };
export const issueFullData3: IssueFull = { ...issueSummary3, sections: buildSections(issue3Articles) };
export const issueFullData4: IssueFull = { ...issueSummary4, sections: [] };
export const issueFullData5: IssueFull = { ...issueSummary5, sections: buildSections(issue5Articles) };

// Backward-compatible aliases
export const issueSummary = issueSummary1;
export const issueFullData = issueFullData1;

const allIssues: IssueSummary[] = [issueSummary1, issueSummary2, issueSummary3, issueSummary4, issueSummary5];
const issueFullMap: Record<number, IssueFull> = {
  1: issueFullData1, 2: issueFullData2, 3: issueFullData3,
  4: issueFullData4, 5: issueFullData5,
};
const articlesByIssue: Record<number, Article[]> = {
  1: issue1Articles, 2: issue2Articles, 3: issue3Articles,
  4: [], 5: issue5Articles,
};
const articleMap: Record<number, Article> = Object.fromEntries(
  allArticleSummaries.map((a) => [a.id, a]),
);
// Полные данные перекрывают summary
const fullArticleOverrides: Record<number, Article> = {
  1: articleFullData,
  13: articleFullData13,
  14: articleFullData14,
};

export const issuesByYear: IssueSummary[] = allIssues;

// ── Editorial board ──────────────────────────────────────────────

const eb = (id: number, name: string, role: string, degree: string, affiliation: string, email: string, spin: string | null, orcid: string, scopus: string | null): EditorialBoardMember => ({
  id, full_name: { ru: name }, role: { ru: role }, degree: { ru: degree }, affiliation: { ru: affiliation },
  email, spin_code: spin, orcid, scopus_id: scopus, order: id,
});

export const editorialBoard: EditorialBoardMember[] = [
  eb(1, 'В.С. Автономов', 'Член редколлегии', 'член-корреспондент РАН, д-р экон. наук, профессор', 'Национальный исследовательский университет «Высшая школа экономики», профессор', 'vavtonomov@hse.ru', '6086-8715', '0000-0001-8169-729X', null),
  eb(2, 'О.И. Ананьин', 'Член редколлегии', 'канд. экон. наук, профессор', 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор', 'ananyin@hse.ru', '9967-2838', '0000-0001-7380-290X', null),
  eb(3, 'М.Р. Байсингер', 'Член редколлегии', 'д-р полит. наук, профессор (США)', 'Принстонский университет (США), директор Принстонского института международных и региональных исследований', 'mbeissin@princeton.edu', null, '0000-0001-7937-2277', '6603181314'),
  eb(4, 'А.Е. Варшавский', 'Член редколлегии', 'д-р экон. наук, профессор', 'Центральный экономико-математический институт РАН, заведующий лабораторией моделирования экономической стабильности', 'varshavae@yandex.ru', '7987-6250', '0000-0001-8229-3692', null),
  eb(5, 'М.И. Воейков', 'Зам. гл. редактора', 'д-р экон. наук, профессор', 'Институт экономики РАН, главный научный сотрудник', 'mvok1943@mail.ru', '5900-2420', '0000-0002-3873-8276', null),
  eb(6, 'Г.Д. Гловели', 'Член редколлегии', 'д-р экон. наук, профессор', 'Институт экономики РАН, руководитель Центра методологических и историко-экономических исследований', 'glovelig@mail.ru', '6514-1027', '0000-0001-7871-6533', null),
  eb(7, 'Р.С. Гринберг', 'Член редколлегии', 'член-корреспондент РАН, д-р экон. наук, профессор', 'Институт экономики РАН, научный руководитель Института экономики РАН', 'grinberg@inecon.ru', null, '', '55999922800'),
  eb(8, 'В.Е. Дементьев', 'Член редколлегии', 'член-корреспондент РАН, д-р экон. наук, профессор', 'Центральный экономико-математический институт РАН, руководитель научного направления, зам. председателя Ученого совета ЦЭМИ РАН', 'dementev@cemi.rssi.ru', '9399-5255', '0000-0001-5612-3999', null),
  eb(9, 'А.П. Заостровцев', 'Зам. гл. редактора', 'канд. экон. наук, доцент', 'Национальный исследовательский университет «Высшая школа экономики» (Санкт-Петербург), профессор', 'zao-and@yandex.ru', '2198-0122', '0000-0003-0302-4182', null),
  eb(10, 'Л.В. Зеленоборская', 'Член редколлегии', 'канд. экон. наук', 'Институт экономики РАН, ученый секретарь Института экономики РАН', 'lvz@inecon.ru', null, '', null),
  eb(11, 'Р.И. Капелюшников', 'Член редколлегии', 'член-корреспондент РАН, д-р экон. наук, профессор', 'Институт мировой экономики и международных отношений им. Е.М. Примакова РАН, главный научный сотрудник', 'rostis@hse.ru', '1189-1604', '0000-0002-2312-2110', null),
  eb(12, 'С.Г. Кирдина-Чэндлер', 'Член редколлегии', 'д-р социол. наук', 'Институт экономики РАН, главный научный сотрудник, заведующая сектором институционально-эволюционной экономики', 'kirdina@inecon.ru', '2262-1600', '0000-0002-9234-8308', null),
  eb(13, 'А.М. Либман', 'Член редколлегии', 'д-р экон. наук, профессор (ФРГ)', 'Берлинский свободный университет, профессор', 'alexander.libman@fu-berlin.de', '5378-4313', '0000-0001-8504-3007', null),
  eb(14, 'В.И. Маевский', 'Член редколлегии', 'академик РАН, д-р экон. наук, профессор', 'Институт экономики РАН, руководитель Центра институционально-эволюционной экономики и прикладных проблем воспроизводства', 'maev1941@bk.ru', '7212-8734', '0000-0003-4169-825X', null),
  eb(15, 'Н.А. Макашева', 'Зам. гл. редактора', 'д-р экон. наук, профессор', 'Институт информации по общественным наукам РАН, главный научный сотрудник', 'nmakasheva@mail.ru', '8991-0890', '0000-0002-3460-3040', null),
  eb(16, 'В.С. Мартьянов', 'Член редколлегии', 'канд. полит. наук, доцент', 'Институт философии и права УрО РАН, директор', 'martianovy@rambler.ru', '8770-5974', '0000-0002-7747-0022', null),
  eb(17, 'В.Ю. Музычук', 'Член редколлегии', 'д-р экон. наук, профессор', 'Институт экономики РАН, заместитель директора по научной работе', 'vm-instecon@yandex.ru', '4161-3862', '0009-0008-7902-7228', null),
  eb(18, 'А.Н. Олейник', 'Член редколлегии', 'д-р экон. наук, профессор (Канада)', 'Университет «Мемориал» (Канада), профессор', 'aoleynik@mun.ca', '3948-9729', '0000-0002-5229-1052', null),
  eb(19, 'Н.М. Плискевич', 'Зам. гл. редактора', '', 'Институт экономики РАН, старший научный сотрудник', 'znplis@yandex.ru', '1479-1879', '0000-0003-0860-6229', null),
  eb(20, 'Л.И. Полищук', 'Член редколлегии', 'канд. экон. наук, доцент', 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор', 'lpolish@iu.edu', '1963-5472', '', null),
  eb(21, 'В.М. Полтерович', 'Член редколлегии', 'академик РАН, д-р экон. наук, профессор', 'Центральный экономико-математический институт РАН, заведующий лабораторией математической экономики', 'polterov@mail.ru', '2154-8463', '0000-0001-6092-6823', null),
  eb(22, 'Т.Ф. Ремингтон', 'Член редколлегии', 'PhD, канд. полит. наук (США)', 'Национальный исследовательский университет «Высшая школа экономики», Университет Эмори (Emory University, США), профессор', 'polstfr@emory.edu', null, '0000-0002-1109-3121', null),
  eb(23, 'А.Я. Рубинштейн', 'Член редколлегии', 'д-р филос. наук, профессор', 'Институт экономики РАН, главный научный сотрудник, руководитель научного направления «Теоретическая экономика»', 'arubin@aha.ru', '9701-6884', '0000-0003-0455-3879', null),
  eb(24, 'М.Е. Симон', 'Член редколлегии', 'канд. полит. наук, доцент', 'Российская академия народного хозяйства и государственной службы, ведущий научный сотрудник', 'mr.marksimon@gmail.com', '6172-7029', '', null),
  eb(25, 'Н.Е. Тихонова', 'Член редколлегии', 'д-р социол. наук, профессор', 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор', 'netichonova@gmail.com', '1448-9948', '0000-0002-5826-4418', null),
  eb(26, 'М.Ю. Урнов', 'Член редколлегии', 'д-р полит. наук, профессор', 'Национальный исследовательский университет «Высшая школа экономики», ординарный профессор', 'murnov@hse.ru', '3716-9699', '0000-0003-3175-2064', null),
  eb(27, 'Б.А. Хейфец', 'Член редколлегии', 'д-р экон. наук, профессор', 'Институт экономики РАН, главный научный сотрудник', 'bah412@rambler.ru', '5873-3262', '0000-0002-6009-434X', null),
  eb(28, 'Т.В. Чубарова', 'Зам. гл. редактора', 'д-р экон. наук, доцент', 'Институт экономики РАН, главный научный сотрудник', 't_chubarova@mail.ru', '3367-5073', '0000-0002-3985-0198', null),
];

// ── Mock router ──────────────────────────────────────────────────
// path начинается с / (без префикса /api/, т.к. он в base URL)

export function getMockData(path: string, _init?: RequestInit): unknown {
  // Issue by ID
  const issueByIdMatch = path.match(/^\/issues\/(\d+)\/$/);
  if (issueByIdMatch) {
    const id = Number(issueByIdMatch[1]);
    return issueFullMap[id] ?? null;
  }

  // Годы архива — отдельной веткой ВЫШЕ общей '/issues/': иначе её перехватит
  // startsWith и архив получит массив выпусков вместо { years }. Годы выводим
  // из тех же выпусков, чтобы плитка года не вела в notFound().
  if (path.startsWith('/issues/years/')) {
    const years = Array.from(
      new Set(allIssues.filter((i) => i.status === 'Published').map((i) => i.year))
    );
    return { years: years.sort((a, b) => b - a) };
  }

  // Issues list (with optional ?year=)
  if (path.startsWith('/issues/')) {
    const yearMatch = path.match(/[?&]year=(\d+)/);
    if (yearMatch) {
      const year = Number(yearMatch[1]);
      return allIssues.filter((i) => i.year === year);
    }
    return allIssues;
  }

  // Article by ID
  const articleByIdMatch = path.match(/^\/articles\/(\d+)\/$/);
  if (articleByIdMatch) {
    const id = Number(articleByIdMatch[1]);
    return fullArticleOverrides[id] ?? articleMap[id] ?? null;
  }

  // Articles list with ?issue_id=
  if (path.startsWith('/articles/')) {
    const issueIdMatch = path.match(/[?&]issue_id=(\d+)/);
    if (issueIdMatch) {
      return articlesByIssue[Number(issueIdMatch[1])] ?? [];
    }
    return allArticleSummaries;
  }

  // Sections list
  if (path === '/sections/') return sections;

  // Single section — как на бэке, detail отдаёт рубрику вместе со статьями
  const sectionMatch = path.match(/^\/sections\/([^/]+)\/$/);
  if (sectionMatch) {
    const section = sectionBySlug(sectionMatch[1]);
    if (!section) return null;
    const articles = allArticleSummaries.filter(
      (a) => a.section_name.ru === section.name.ru
    );
    return { ...section, articles };
  }

  // Editorial board
  if (path === '/editorial_board/') return editorialBoard;

  // Search (paginated)
  if (path.startsWith('/search/')) {
    const params = new URLSearchParams(path.split('?')[1] || '');
    const q = params.get('q')?.toLowerCase() ?? '';
    const sectionFilter = params.get('section') ?? '';
    const yearFrom = params.get('year_from') ? Number(params.get('year_from')) : undefined;
    const yearTo = params.get('year_to') ? Number(params.get('year_to')) : undefined;

    const sectionNameFilter = sectionFilter
      ? sections.find((s) => s.slug === sectionFilter)?.name.ru
      : undefined;

    const results = allArticleSummaries.filter((a) => {
      const authorsRu = a.authors.map((au) => au.full_name.ru).join(', ').toLowerCase();
      if (q && !a.title.ru.toLowerCase().includes(q) && !authorsRu.includes(q)) return false;
      if (sectionNameFilter && a.section_name.ru !== sectionNameFilter) return false;
      if (yearFrom && a.issue_year !== null && a.issue_year < yearFrom) return false;
      if (yearTo && a.issue_year !== null && a.issue_year > yearTo) return false;
      return true;
    });
    const result: PaginatedArticleList = {
      count: results.length,
      next: null,
      previous: null,
      results,
    };
    return result;
  }

  // Auth — mock-режим принимает любые credentials
  if (path === '/auth/login/') {
    return { access: 'mock-access-token', refresh: 'mock-refresh-token' };
  }
  if (path === '/auth/refresh/') {
    return { access: 'mock-access-token-refreshed', refresh: 'mock-refresh-token-refreshed' };
  }
  if (path === '/auth/logout/') {
    return { message: 'Вы успешно вышли из системы' };
  }

  // Pages — нет на бэкенде, возвращаем 404 чтобы клиент использовал fallback
  if (path.startsWith('/pages/')) {
    throw new Error('404 Not Found');
  }

  console.warn(`[mock] No mock data for path: ${path}`);
  return null;
}

// Re-export для совместимости с импортами админ-страниц
export { allArticleSummaries as allArticles };
